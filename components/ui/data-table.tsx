'use client';

import { useState } from 'react';
import Papa from 'papaparse';

interface Column<T> {
  key: keyof T;
  header: string;
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
}

export function DataTable<T extends Record<string, any>>({ data, columns }: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);

  const filtered = data.filter((row) =>
    columns.some((col) => String(row[col.key]).toLowerCase().includes(query.toLowerCase())),
  );

  const sorted = sortKey
    ? [...filtered].sort((a, b) => String(a[sortKey]).localeCompare(String(b[sortKey])))
    : filtered;

  const exportCSV = () => {
    const csv = Papa.unparse(sorted);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'table.csv');
    link.click();
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          className="border px-2 py-1"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={exportCSV} className="border px-2 py-1">
          CSV
        </button>
        <button onClick={exportPDF} className="border px-2 py-1">
          PDF
        </button>
      </div>
      <table className="min-w-full border">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="border px-2 py-1 cursor-pointer"
                onClick={() => setSortKey(col.key)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i} className="border-t">
              {columns.map((col) => (
                <td key={String(col.key)} className="border px-2 py-1">
                  {String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
