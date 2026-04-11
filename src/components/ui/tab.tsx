import join from '@/utils/join'
import * as React from 'react'
import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'

// --- Context Definition ---
interface TabContext {
  current: string
  elements: string[]
  add(id: string): void
  remove(id: string): void
  set(id: string): void
}

// Initial state for the context
const initialContextValue: TabContext = {
  current: "",
  elements: [],
  set: () => {},
  add: () => {},
  remove: () => {}
}

const context = createContext<TabContext>(initialContextValue)
context.displayName = "TabContext"

interface RootProps { 
  children?: React.ReactNode
  onChange: (value: string) => void
  defaultValue: string 
  direction?: 'col' | 'row'
}


function TabRoot({ children, onChange, defaultValue, direction = 'row' }: RootProps) {
  const [elements, setElements] = useState<TabContext['elements']>([])
  const [current, setCurrent] = useState<string>(defaultValue)

  function add(id: string) {
    if(import.meta.env.DEV && elements.includes(id))
      console.warn(`[Component/Tab] Duplicate element '${id}' detected`)

    setElements(p => [...p, id])
  }

  function remove(id: string) {
    setElements(p => p.filter(s => s !== id))
  }

  function set(id: string) {
    if(!elements.includes(id))
      return console.warn(`[Component/Tab] Cannot set value to '${id}' because element not exist`)
    
    setCurrent(id)
  }

  useEffect(() => {
    onChange(current)
  }, [current])

  return (
    <context.Provider value={{ elements, current, add, remove, set }}>
      <div className={join(direction == 'col' ? 'flex flex-col' : 'flex', 'gap-2 p-1 border border-accent/50 bg-accent/10 rounded-md')}>
        {children}
      </div>
    </context.Provider>
  )
}

interface ElementProps {
  id: string
  children: React.ReactNode;
}

function TabElement({ id,  children }: ElementProps) {
  const contextValue = useContext(context)

  useEffect(() => {
    contextValue.add(id)

    return () => {
      contextValue.remove(id)
    }
  }, [id])

  const isActive = useMemo(() => contextValue.current === id, [contextValue.current])

  // Element displays nothing visually, but it manages state in the context
  return (
    <div 
      className={join('text-center p-1 px-3 rounded-md cursor-pointer select-none', isActive ? 'bg-accent/40': 'hover:outline-2 hover:outline-accent/30')}
      onClick={() => contextValue.set(id)}
    >
      {children}
    </div>
  )
}

export const Tab = { Root: TabRoot, Element: TabElement }