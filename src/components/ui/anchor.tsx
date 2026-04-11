import { useEffect } from "react";
import { KeyComboBadge, type KeyComboBadgeProps } from "./badge";

export function KeyboardAnchor({ children, onClick, keys }: KeyboardAnchorProps) {
  useEffect(() => {
    const keyboardHandler = (ev: KeyboardEvent) => {
      if(keys.crtlKey && !(ev.ctrlKey || ev.getModifierState('AltGraph')))
        return

      if(keys.optionKey && !(ev.altKey || ev.getModifierState('AltGraph')))
        return 

      if("Key" + (Array.isArray(keys.keys) ? keys.keys[0] : keys.keys) === ev.code) {
        onClick()
      }
    }

    window.addEventListener('keydown', keyboardHandler)

    return () => {
      window.removeEventListener('keydown', keyboardHandler)
    }
  }, [])

  return (
    <button 
      className="p-2 rounded-md hover:bg-accent/10 transition-opacity flex justify-between items-center gap-2 cursor-pointer"
      onClick={() => onClick()}
    >
      {children}
      <KeyComboBadge {...keys} />
    </button>
  )
}

export interface KeyboardAnchorProps {
  keys: KeyComboBadgeProps
  onClick(): void
  children: React.ReactNode
}