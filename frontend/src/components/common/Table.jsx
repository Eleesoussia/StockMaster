export default function Table({ columns, data, emptyText = 'Aucune donnée' }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 text-left font-semibold text-gray-700">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-gray-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id || i} className="border-b last:border-0 hover:bg-gray-50">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3">
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}