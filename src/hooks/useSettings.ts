import { create } from 'zustand'
import { getDatabase, type ConfigValue } from '../modules/storage'

interface SettingsState {
  entries: SettingsEntry[]
  values: Record<string, SettingsEntry['defaultValue']>
  disabledEntries: string[]
  locked: boolean
  register(entry: SettingsEntry): void
  fetch(id: string): Promise<ConfigValue>
  set(id: string, value: SettingsEntry["defaultValue"]): Promise<void>
  lock(): void
}

interface BaseEntry {
  id: string
  category: string
  visibility: 'visible' | 'hidden' | 'locked'
  dependsOn?: string[]
}

export interface CheckboxEntry extends BaseEntry {
  type: 'checkbox'
  defaultValue: boolean
  action?(value: boolean, prev: boolean, entry: this): void | Promise<void>
}

export interface SelectEntry<T extends string = string> extends BaseEntry {
  type: 'select';
  selectOptions: T[]
  defaultValue: T
  action?(value: T, prev: T, entry: this): void | Promise<void>
}

export interface ColorDefinition<T extends string = string> {
  key: T
  color: string
}

export interface SelectColorEntry<T extends string = string> extends BaseEntry {
  type: 'select-color';
  selectOptions: ColorDefinition<T>[]
  defaultValue: T
  action?(value: T, prev: T, entry: this): void | Promise<void>
}

export interface InputEntry extends BaseEntry {
  type: 'input';
  defaultValue: string
  action?(value: string, prev: string, entry: this): void | Promise<void>
}

export interface NumericInputEntry extends BaseEntry {
  type: 'input-numeric';
  defaultValue: number
  action?(value: number, prev: number, entry: this): void | Promise<void>
  minValue?: number
  maxValue?: number
}

export type SettingsEntry = CheckboxEntry | SelectEntry | SelectColorEntry | InputEntry | NumericInputEntry;

const useSettings = create<SettingsState>((set, get) => ({
  entries: [],
  values: {},
  disabledEntries: [],
  locked: false,
  lock: () => {
    set({locked:true})
  },
  register: async (se) => {
    if(get().locked)
      throw new Error(`Cannot register new entries. Settings are locked`)
    if(get().entries.find(e => e.id === se.id))
      throw new Error(`Entry '${se.id}' already registered`)

    set(prev => ({
      entries: [...prev.entries, se],
    }))

    const value = await get().fetch(se.id)
    get().set(se.id, value)

    set(prev => ({
      values: {...prev.values, [se.id]: value }
    }))
  },
  fetch: async (id) => {
    const entry = get().entries.find(e => e.id === id)
    if(!entry) throw new Error(`Setting '${id}' not exists`)

    const db = await getDatabase();

    const value = await db.get('config', id)

    // create from default value
    if(value === undefined){
      await db.put('config', entry.defaultValue, id)
      return entry.defaultValue
    }

    return value
  },
  set: async (id, value) => {
    const entry = get().entries.find(e => e.id === id)
    if(!entry) throw new Error(`Setting '${id}' not exists`)

    const db = await getDatabase();
    const prevValue = await db.get('config', entry.id)

    set(prev => {
      const { entries, values } = get()
      entries.filter(e => {
        if(!e.dependsOn || e.dependsOn.length === 0) return false

        return e.dependsOn.some(depId => values[depId] !== true) || e.visibility === 'locked'
      })

      return ({
        values: {...prev.values, [entry.id]: value}
      })
    })
    await db.put('config', value, entry.id)
    entry.action && await entry.action(value as never, prevValue as never, entry as never)
  }
}))

export default useSettings