import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'
import { IconButton } from '@/components/ui/icon-button'
import { cn } from '@/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogClose = DialogPrimitive.Close

export interface DialogContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
  title: string
  description?: string
  children: ReactNode
}

export function DialogContent({
  title,
  description,
  children,
  className,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] duration-300',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        )}
      />

      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-y-auto rounded-[12px] border border-gray-200 bg-white p-6 shadow-[0px_10px_30px_rgba(0,0,0,0.12)] outline-none',
          'duration-300 ease-out-expo data-[state=closed]:duration-150 data-[state=closed]:ease-in',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-2',
          className,
        )}
        {...(description ? {} : { 'aria-describedby': undefined })}
        {...props}
      >
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <DialogPrimitive.Title className="text-base leading-6 font-semibold text-gray-800">
              {title}
            </DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="text-sm leading-5 font-normal text-gray-600">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>

          <DialogPrimitive.Close asChild>
            <IconButton
              aria-label="Fechar"
              className="[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-out-expo hover:[&_svg]:rotate-90"
            >
              <X />
            </IconButton>
          </DialogPrimitive.Close>
        </header>

        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
