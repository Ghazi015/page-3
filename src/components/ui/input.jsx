import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn('w-full border-b border-ink/25 bg-transparent py-3 text-base text-ink outline-none placeholder:text-ink/35 focus-visible:border-ink', className)} {...props} />
})
