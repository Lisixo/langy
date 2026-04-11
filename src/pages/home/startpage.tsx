import { IconFile, IconTablePlus } from "@tabler/icons-react";
import type { KeyComboProps } from "@/components/key";
import KeyCombo from "@/components/key";
import { useEffect, useState } from "react";
import { Modal, type ModalFunctionalProps } from "@/components/modal";
import { t } from "i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useProject from "@/hooks/useProject";
import type { Project } from "@/modules/storage";
import { KeyboardAnchor } from "@/components/ui/anchor";

export default function HomeStartPage() {
  const [openCreateModal, setOpenCreateModal] = useState(false)

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-full gap-4 p-8">
        <h1 className="text-6xl font-momo-trust mb-8">Langy</h1>

        <div className="flex flex-col gap-4">
          <KeyboardAnchor onClick={() => {}} keys={{ optionKey: true, crtlKey: true, keys: "O" }}>
            <IconFile />
            <p>Open project from file</p>
          </KeyboardAnchor>
          <KeyboardAnchor onClick={() => setOpenCreateModal(true)} keys={{ optionKey: true, crtlKey: true, keys: "N" }}>
            <IconTablePlus />
            <p>Create project</p>
          </KeyboardAnchor>
        </div>

        <span>or</span>

        <InCacheProjectsList />

        <div className="grow"></div>

        <div className="border border-amber-500 bg-amber-600/20 text-amber-300 rounded-md p-4 font-bold flex flex-col items-center select-none">
          <p>App is in development</p>
          <p>Bug or missing features can occur</p>
        </div>
      </div>
      {
        openCreateModal && (
          <CreateProjectModal onClose={() => setOpenCreateModal(false)} />
        )
      }
    </>
  );
}

function InCacheProjectsList () {
  const project = useProject()

  return (
    <div className="border border-zinc-600 bg-zinc-800 rounded-md p-4">
      <h2 className="text-center mb-4">Load project from browser memory</h2>

      <div className="flex flex-col gap-4">
        {
          project.projectListCache.map(p => <InCacheProjectListElement key={p.projectId} project={p}/>)
        }
      </div>
    </div>
  )
}

function InCacheProjectListElement({ project: p }: { project: Project }) {
  const project = useProject()
  
  return (
    <div key={p.projectId} className="flex flex-col gap-2 p-2 bg-accent/10 rounded-md border border-accent/20">
      <div className="flex gap-2">
        <p className="font-bold text-zinc-100">{p.name}</p>
        <p className="text-zinc-400 hidden md:block ">{p.projectId}</p>
      </div>
      <div className="flex gap-2 w-full">
        <Button className="grow" onClick={() => project.loadFromMemory(p.projectId)}>
          Load
        </Button>
        <Button className="grow" variant="danger" onClick={() => project.removeFromMemory(p.projectId)}>
          Delete
        </Button>
      </div>
    </div>
  )
}

function CreateProjectModal(props: ModalFunctionalProps) {
  const [closeable, setCloseable] = useState(true)
  const project = useProject()

  const formHandler = async (d: FormData) => {
    setCloseable(false)
    const name = d.get('projectName') as string
    await project.create(name)
    props.onClose()
  }

  return (
    <Modal closeable={closeable} title={t('project.create')} accent {...props}>
      <form action={formHandler} className="flex flex-col gap-2">
        <Input
          placeholder={t('project.name')}
          name="projectName"
          defaultValue={t('project.create')}
        />

        <div className="flex">
          <Button type='submit'>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  )
}