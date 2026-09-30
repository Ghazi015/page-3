import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description
export const DialogClose = DialogPrimitive.Close

export const DialogContent = forwardRef(function DialogContent({ className, children, ...props }, ref) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog-overlay fixed inset-0 z-[100] bg-ink/75 backdrop-blur-sm" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn('dialog-content fixed left-1/2 top-1/2 z-[101] max-h-[min(92vh,760px)] w-[calc(100%-32px)] max-w-[650px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-paper p-7 shadow-2xl outline-none sm:p-12', className)}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 transition-transform duration-300 hover:rotate-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink" aria-label="Close dialog">
          <X size={17} strokeWidth={1.5} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
})
