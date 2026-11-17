export default function Pagination({ pagination, onChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages } = pagination;

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="btn-secondary disabled:opacity-50"
      >
        ← Précédent
      </button>
      <span className="px-3 text-sm text-gray-700">
        Page {page} / {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="btn-secondary disabled:opacity-50"
      >
        Suivant →
      </button>
    </div>
  );
}