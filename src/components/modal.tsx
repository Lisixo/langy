import { useInnerOuterDetector } from "@/hooks/useOutsideDetector";
import join from "@/utils/join";
import { IconX } from "@tabler/icons-react";
import { t } from "i18next";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Flex } from "./ui/container";
import { Button } from "./ui/button";

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
        <div ref={inner} className={join("bg-zinc-800 relative rounded-md max-w-full min-w-1/4 md:min-w-1/2 xl:min-w-1/3", accent && ' drop-shadow-2xl drop-shadow-accent/20')}>
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

export function ConfirmModal({ title, descripton, onCancel, onConfirm}: ConfirmModalProps) {
  return (
    <Modal title={title ?? t("generic.modal.confirm.title")} accent onClose={onCancel}>
      <Flex col>
        <p>{ descripton ?? t("generic.modal.confirm.desc")}</p>
        
        <Flex className=" flex-row-reverse">
          <Button variant="danger" onClick={onConfirm}>
            {t("generic.confirm")}
          </Button>
          <Button onClick={onCancel}>
            {t("generic.cancel")}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}

interface ConfirmModalProps {
  title?: string,
  descripton?: string
  onConfirm?: () => void
  onCancel: () => void
}