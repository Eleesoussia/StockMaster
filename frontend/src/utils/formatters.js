export function formatPrice(value) {
  const n = parseFloat(value || 0);
  return `${n.toFixed(2)} DT`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncate(str, n = 60) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
}