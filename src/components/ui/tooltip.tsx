import { useState, createContext, useContext, useRef, useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

const TooltipContext = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} })

interface TooltipProviderProps { children: ReactNode; delayDuration?: number }
export function TooltipProvider({ children }: TooltipProviderProps) { return <>{children}</> }

interface TooltipProps { children: ReactNode }
export function Tooltip({ children }: TooltipProps) {
  const [open, setOpen] = useState(false)
  return <TooltipContext.Provider value={{ open, setOpen }}>{children}</TooltipContext.Provider>
}

export function TooltipTrigger({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useContext(TooltipContext)
  return <button className={className} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} {...props}>{children}</button>
}

export function TooltipContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useContext(TooltipContext)
  if (!open) return null
  return <div className={cn('z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95', className)} {...props}>{children}</div>
}