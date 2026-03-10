import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 text-slate-800 shadow-2xl">
        <div className="mb-3 text-lg font-bold">{title}</div>
        <div className="text-sm">{children}</div>
        <button onClick={onClose} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-white">
          Fechar
        </button>
      </div>
    </div>
  )
}
