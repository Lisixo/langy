import { create } from 'zustand'
import { getDatabase, type Project } from '../modules/storage'
import { v4 as uuidv4 } from 'uuid';

export interface LoadedProject extends Project {
  languagesState: Record<string, LanguageProgress>
}

export interface LanguageProgress {
  count: number
  translated: number
  verified: number
}

interface SettingsState {
  projectId: string | null
  project: LoadedProject | null
  projectListCache: Project[]
  create(name: string): Promise<LoadedProject>
  loadFromFile(): Promise<LoadedProject>
  loadFromMemory(projectId: string): Promise<LoadedProject>
  removeFromMemory(projectId: string): Promise<void>
  refresh(): Promise<void>
  fetchProjectList(): Promise<Project[]>
  close(): Promise<void>
}

const useProject = create<SettingsState>((set, get) => ({
  projectId: null,
  project: null,
  projectListCache: [],
  create: async (name) => {
    const db = await getDatabase()
    const project: Project = {
      projectId: uuidv4(),
      name: name,
      languages: []
    }
    
    while(await db.get('projects', project.projectId)) {
      project.projectId = uuidv4()
    }

    await db.add('projects', project)
    
    const loadedProject: LoadedProject = {
      ...project,
      languagesState: {}
    }

    set(({
      projectId: loadedProject.projectId,
      project: loadedProject
    }))

    await get().fetchProjectList()
    return loadedProject
  },
  loadFromFile: async () => {
    throw new Error("Not implemented")
  },
  removeFromMemory: async (projectId) => {
    const db = await getDatabase()

    const tx = db.transaction(['projects', 'translations'], 'readwrite')
    const projects = tx.objectStore('projects')
    projects.delete(projectId)

    const index = tx.objectStore('translations').index('by-project')
    let cursor = await index.openKeyCursor(IDBKeyRange.only(projectId))

    while(cursor) {
      await tx.objectStore('translations').delete(cursor.primaryKey);
      cursor = await cursor.continue();
    }

    await tx.done;
    
    await get().fetchProjectList()
    return
  },
  loadFromMemory: async (projectId) => {
    const db = await getDatabase()
    const data = await db.get('projects', projectId)

    if(!data) throw new Error(`Project '${projectId}' not exists`)

    const project = {
      ...data,
      languagesState: {}
    } satisfies LoadedProject

    set(({
      projectId: project.projectId,
      project: project
    }))

    return project
  },
  refresh: async () => {
    return
  },
  fetchProjectList: async () => {
    const db = await getDatabase()
    const list = await db.getAll('projects')

    set({ projectListCache: list })
    return list
  },
  close: async () => {
    set({ project: null, projectId: null })
  },
}))

export default useProject