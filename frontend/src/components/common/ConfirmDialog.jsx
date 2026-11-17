import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirmer', message, loading = false }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Annuler</Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Traitement…' : 'Confirmer'}
          </Button>
        </>
      }
    >
      <p className="text-gray-700">{message}</p>
    </Modal>
  );
}