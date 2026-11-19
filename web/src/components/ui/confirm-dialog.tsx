import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  /**
   * Ação confirmada. Se rejeitar, o diálogo continua aberto (quem chama
   * exibe o erro); se resolver, o diálogo fecha.
   */
  onConfirm: () => void | Promise<void>
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Excluir',
  onConfirm,
}: ConfirmDialogProps) {
  const [isPending, setIsPending] = useState(false)

  async function handleConfirm() {
    setIsPending(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch {
      // Mantém aberto; o erro já foi exibido por quem chamou.
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <DialogContent title={title} description={description}>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline" size="sm" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="solid"
            size="sm"
            className="bg-danger hover:bg-danger/90"
            disabled={isPending}
            onClick={() => void handleConfirm()}
          >
            {isPending ? 'Excluindo...' : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
