import { useMemo } from "react"
import getCurrentPlatform, { Platform } from "../utils/platform"

export default function KeyCombo({ optionKey, keys }: KeyComboProps) {
    const allKeys = useMemo(() => ([optionKey ? getCurrentPlatform() === Platform.MacOS ? '⌘' : 'Crtl' : null, ...keys].filter(k => k)), [optionKey, keys])
    return (
        <div className="flex gap-1 text-sm font-roboto">
            {
                allKeys.map((key, idx) => (
                    <span className="p-0.5 px-1 bg-neutral-700 border border-neutral-600/50 rounded-md flex items-center justify-center select-none" key={idx}>{key}</span>
                ))
            }
        </div>
    )
}

export interface KeyComboProps {
    optionKey?: boolean
    keys: string | string[]
}