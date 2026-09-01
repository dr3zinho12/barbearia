import { Modal } from './Modal';

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirmar',
  danger = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <button type="button" className="btn-ghost" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </button>
          <button type="button" className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Processando...' : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-slate-300">{description}</p>
    </Modal>
  );
}
