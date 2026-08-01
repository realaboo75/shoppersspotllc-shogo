import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { X } from 'lucide-react'

const DialogContext = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} })

interface DialogProps { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; children: ReactNode }
export function Dialog({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const open = controlledOpen ?? internalOpen
  const setOpen = useCallback((v: boolean) => { setInternalOpen(v); onOpenChange?.(v) }, [onOpenChange])
  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>
}

export function DialogTrigger({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useContext(DialogContext)
  return <button className={className} onClick={() => setOpen(true)} {...props}>{children}</button>
}

export function DialogContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = useContext(DialogContext)
  useEffect(() => { if (!open) return; const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler) }, [open, setOpen])
  if (!open) return null
  return (<><div className="fixed inset-0 z-50 bg-black/80" onClick={() => setOpen(false)} /><div className={cn('fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg', className)} {...props}>{children}<button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100" onClick={() => setOpen(false)}><X className="h-4 w-4" /><span className="sr-only">Close</span></button></div></>)
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} /> }
export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) { return <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} /> }
export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) { return <p className={cn('text-sm text-muted-foreground', className)} {...props} /> }