import { useState, createContext, useContext, useRef, useEffect, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

const DropdownContext = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} })

interface DropdownMenuProps { children: ReactNode }
export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  return <DropdownContext.Provider value={{ open, setOpen }}><div className="relative inline-block text-left">{children}</div></DropdownContext.Provider>
}

export function DropdownMenuTrigger({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = useContext(DropdownContext)
  return <button className={className} onClick={() => setOpen(!open)} {...props}>{children}</button>
}

export function DropdownMenuContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = useContext(DropdownContext)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { if (!open) return; const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }; document.addEventListener('mousedown', handler); return () => document.removeEventListener('mousedown', handler) }, [open, setOpen])
  if (!open) return null
  return <div ref={ref} className={cn('absolute right-0 z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md', className)} {...props}>{children}</div>
}

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { inset?: boolean }
export function DropdownMenuItem({ className, inset, ...props }: DropdownMenuItemProps) {
  return <button className={cn('relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground', inset && 'pl-8', className)} {...props} />
}