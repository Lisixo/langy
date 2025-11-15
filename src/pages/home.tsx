import { IconFile, IconTablePlus } from "@tabler/icons-react"
import type { KeyComboProps } from "../components/key"
import KeyCombo from "../components/key"

export default function HomePage() {
    return (
        <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-6xl font-momo-trust mb-16">Langy</h1>

            <div className="flex flex-col gap-4">
                <ActionButton shortcutKey={{ optionKey: true, keys: 'O'}}>
                    <IconFile />
                    <p>Open project from file</p>
                </ActionButton>

                <ActionButton shortcutKey={{ optionKey: true, keys: 'N'}}>
                    <IconTablePlus />
                    <p>Create project</p>
                </ActionButton>
            </div>
        </div>
    )
}

function ActionButton({ children, shortcutKey }: ActionButtonProps) {
    return (
        <button 
            className="flex justify-between gap-12 select-none"
        >
            <div className="flex gap-2">{ children }</div>
            {
                shortcutKey && <KeyCombo {...shortcutKey} />
            }
        </button>
    )
}

interface ActionButtonProps {
    shortcutKey?: KeyComboProps
    children?: React.ReactNode
}