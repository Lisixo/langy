import join from "@/utils/join"
import getCurrentPlatform, { Platform } from "@/utils/platform"
import { useMemo } from "react"

export function Badge({ children }: BadgeProps) {
  return <div className={join('p-1 border-accent/50 text-accent-light font-bold border rounded-md bg-accent/10')}>
    {children}
  </div>
}

export interface BadgeProps {
  children: React.ReactNode
}

export function KeyComboBadge({ optionKey = false, crtlKey = false, keys }: KeyComboBadgeProps) {
  const allKeys = useMemo(() => ([optionKey ? getCurrentPlatform() === Platform.MacOS ? '⌘' : 'Alt' : null, crtlKey && 'Crtl', ...keys].filter(k => k)), [optionKey, keys])

  return <Badge>
    {allKeys.join(" + ")}
  </Badge>
}

export interface KeyComboBadgeProps {
  optionKey?: boolean
  crtlKey?: boolean
  keys: string | string[]
}