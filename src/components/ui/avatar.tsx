import { useState, type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Avatar({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [hasError, setHasError] = useState(false)
  return <img className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)} onError={() => setHasError(true)} {...props} />
}