import { useState, createContext, useContext, useRef, useEffect, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Check, ChevronDown } from 'lucide-react'

const SelectContext = createContext<{ open: boolean; setOpen: (v: boolean) => void; value: string; onValueChange: (v: string) => void }>({ open: false, setOpen: () => {}, value: '', onValueChange: () => {} })

interface SelectProps { value?: string; defaultValue?: string; onValueChange?: (value: string) => void; children: ReactNode }
export function Select({ value: controlledValue, defaultValue = '', onValueChange, children }: SelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const value = controlledValue ?? internalValue
  const handleValueChange = useCallback((v: string) => { setInternalValue(v); onValueChange?.(v); setOpen(false) }, [onValueChange])
  return <SelectContext.Provider value={{ open, setOpen, value, onValueChange: handleValueChange }}>{children}</SelectContext.Provider>
}

export function SelectTrigger({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = useContext(SelectContext)
  return <button type="button" role="combobox" aria-expanded={open} className={cn('flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50', className)} onClick={() => setOpen(!open)} {...props}>{children}<ChevronDown className="h-4 w-4 opacity-50" /></button>
}

export function SelectContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = useContext(SelectContext)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { if (!open) return; const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }; document.addEventListener('mousedown', handler); return () => document.removeEventListener('mousedown', handler) }, [open, setOpen])
  if (!open) return null
  return <div ref={ref} className={cn('relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md', className)} {...props}>{children}</div>
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> { value: string }
export function SelectItem({ value: itemValue, className, children, ...props }: SelectItemProps) {
  const { value, onValueChange } = useContext(SelectContext)
  const isSelected = value === itemValue
  return <div className={cn('relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground', isSelected && 'bg-accent text-accent-foreground', className)} onClick={() => onValueChange(itemValue)} {...props}><span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">{isSelected && <Check className="h-4 w-4" />}</span>{children}</div>
}

export function SelectValue({ placeholder, className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }) {
  const { value } = useContext(SelectContext)
  return <span className={cn(!value && 'text-muted-foreground', className)} {...props}>{value || placeholder}</span>
}