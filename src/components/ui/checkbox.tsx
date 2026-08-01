import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { Check } from 'lucide-react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> { checked?: boolean; onCheckedChange?: (checked: boolean) => void }

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className, checked, onCheckedChange, ...props }, ref) => (
  <button type="button" role="checkbox" aria-checked={checked} className={cn('peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', checked && 'bg-primary text-primary-foreground', className)} onClick={() => onCheckedChange?.(!checked)}>
    {checked && <Check className="h-4 w-4" />}
    <input ref={ref} type="checkbox" className="sr-only" checked={checked} readOnly {...props} />
  </button>
))
Checkbox.displayName = 'Checkbox'