export default function CategoryTree({ categories, level = 0, onEdit, onDelete }) {
  const roots = categories.filter((c) => !c.parentId);
  return (
    <ul className={level === 0 ? 'space-y-2' : 'ml-6 space-y-1 mt-1'}>
      {roots.map((cat) => {
        const children = categories.filter((c) => c.parentId === cat.id);
        return (
          <li key={cat.id}>
            <div className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50">
              <div>
                <span className="font-medium">{cat.name}</span>
                {cat.description && <p className="text-xs text-gray-500">{cat.description}</p>}
              </div>
              <div className="flex gap-2">
                {onEdit && <button onClick={() => onEdit(cat)} className="text-xs text-primary-600">Modifier</button>}
                {onDelete && <button onClick={() => onDelete(cat)} className="text-xs text-red-600">Supprimer</button>}
              </div>
            </div>
            {children.length > 0 && (
              <CategoryTree categories={children} level={level + 1} onEdit={onEdit} onDelete={onDelete} />
            )}
          </li>
        );
      })}
    </ul>
  );
}