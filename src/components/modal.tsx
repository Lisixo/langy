import { useInnerOuterDetector } from "@/hooks/useOutsideDetector";
import join from "@/utils/join";
import { IconX } from "@tabler/icons-react";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function Modal({ onClose, closeable, title, children, accent = false }: ModalProps) {
  const clickHandler = () => {
    console.log(closeable)
    closeable && onClose()
  }

  const { inner, outer } = useInnerOuterDetector(clickHandler)

  useEffect(() => {
    const keyboardHandler = (ev: KeyboardEvent) => {
      if(ev.code === "Escape")
        clickHandler()
    }

    window.addEventListener('keydown', keyboardHandler)

    return () => {
      window.removeEventListener('keydown', keyboardHandler)
    }
  }, [])

  const modalRoot = document.querySelector('#modal-root')
  if(!modalRoot) return null;

  return (
    createPortal(
      <div
        ref={outer}
        className="fixed inset-0 h-screen w-screen bg-black/75 flex flex-col justify-center items-center z-50"
      >
        <div ref={inner} className={join("bg-zinc-800 relative max-w-md rounded-md", accent && ' drop-shadow-2xl drop-shadow-accent/20')}>
          <div className={join("flex items-center justify-between p-4 rounded-t-md gap-4", accent ? 'bg-accent-dark/50' : 'bg-zinc-700')}>
            <h1 className="font-bold text-xl">{title}</h1>
            <div>
              { closeable && (
                <div className="hover:bg-zinc-50/15 hover:cursor-pointer rounded-md p-2" onClick={onClose}>
                  <IconX />
                </div>
              )}
            </div>
          </div>
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
      , modalRoot
    )
  )
}

export interface ModalProps {
  onClose: () => void;
  closeable?: boolean
  title?: string
  accent?: boolean
  children: ReactNode;
}

export interface ModalFunctionalProps {
  onClose: () => void;
}