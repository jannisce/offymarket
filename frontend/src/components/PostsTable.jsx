function PostsTable({ rows, emptyMessage = 'No hay datos disponibles.' }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600"
            >
              Usuario
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600"
            >
              Cantidad de Posts
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rows.map((row) => (
            <tr key={row.name} data-testid="posts-row">
              <td className="px-4 py-3 text-sm font-medium text-slate-700">{row.name}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{row.postCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PostsTable;
