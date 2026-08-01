import { useState, createContext, useContext, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

const TabsContext = createContext<{ value: string; setValue: (v: string) => void }>({ value: '', setValue: () => {} })

interface TabsProps { value?: string; defaultValue?: string; onValueChange?: (v: string) => void; children: ReactNode; className?: string }
export function Tabs({ value: controlledValue, defaultValue = '', onValueChange, children, className }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const value = controlledValue ?? internalValue
  const setValue = (v: string) => { setInternalValue(v); onValueChange?.(v) }
  return <TabsContext.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsContext.Provider>
}

export function TabsList({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', className)} {...props}>{children}</div>
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { value: string }
export function TabsTrigger({ value: triggerValue, className, children, ...props }: TabsTriggerProps) {
  const { value, setValue } = useContext(TabsContext)
  const isActive = value === triggerValue
  return <button className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all', isActive && 'bg-background text-foreground shadow-sm', className)} onClick={() => setValue(triggerValue)} {...props}>{children}</button>
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> { value: string }
export function TabsContent({ value: contentValue, className, children, ...props }: TabsContentProps) {
  const { value } = useContext(TabsContext)
  if (value !== contentValue) return null
  return <div className={cn('mt-2 ring-offset-background', className)} {...props}>{children}</div>
}