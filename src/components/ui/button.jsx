import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export const Button = forwardRef(function Button(
  { className, variant = 'dark', type = 'button', ...props }, ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-3 rounded-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] outline-none transition-[transform,opacity] duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'dark' && 'bg-ink text-paper',
        variant === 'light' && 'bg-paper text-ink',
        variant === 'accent' && 'bg-acid text-ink',
        variant === 'outline' && 'border border-current bg-transparent text-current',
        className,
      )}
      {...props}
    />
  )
})
