'use client';
import { useState } from 'react';

export interface Column<T> {
  key: keyof T;
  header: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
}

export function DataTable<T>({ columns, data }: Props<T>) {
  const [query, setQuery] = useState('');
  const filtered = data.filter(row =>
    JSON.stringify(row).toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <table>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={String(c.key)}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, idx) => (
            <tr key={idx}>
              {columns.map(c => (
                <td key={String(c.key)}>{String(row[c.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
