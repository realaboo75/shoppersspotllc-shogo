import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { X } from 'lucide-react'

const SheetContext = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} })

interface SheetProps { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; children: ReactNode }
export function Sheet({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: SheetProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const open = controlledOpen ?? internalOpen
  const setOpen = useCallback((v: boolean) => { setInternalOpen(v); onOpenChange?.(v) }, [onOpenChange])
  return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>
}

export function SheetTrigger({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useContext(SheetContext)
  return <button className={className} onClick={() => setOpen(true)} {...props}>{children}</button>
}

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> { side?: 'top' | 'bottom' | 'left' | 'right' }
export function SheetContent({ side = 'right', className, children, ...props }: SheetContentProps) {
  const { open, setOpen } = useContext(SheetContext)
  useEffect(() => { if (!open) return; const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler) }, [open, setOpen])
  if (!open) return null
  const sideClasses = { top: 'inset-x-0 top-0 border-b', bottom: 'inset-x-0 bottom-0 border-t', left: 'inset-y-0 left-0 h-full w-3/4 border-r', right: 'inset-y-0 right-0 h-full w-3/4 border-l' }
  return (<><div className="fixed inset-0 z-50 bg-black/80" onClick={() => setOpen(false)} /><div className={cn('fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out', sideClasses[side], className)} {...props}><button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100" onClick={() => setOpen(false)}><X className="h-4 w-4" /><span className="sr-only">Close</span></button>{children}</div></>)
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} /> }
export function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) { return <h3 className={cn('text-lg font-semibold text-foreground', className)} {...props} /> }