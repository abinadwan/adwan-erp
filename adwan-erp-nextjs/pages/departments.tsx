import { useState, useEffect, FormEvent } from 'react';
import { useUser } from '@/hooks/useUser';

interface Department {
  id: number;
  name: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [deptName, setDeptName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const user = useUser();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const res = await fetch('/api/departments');
    if (res.ok) {
      const data = await res.json();
      setDepartments(data);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = editId ? `/api/departments/${editId}` : '/api/departments';
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: deptName }),
    });

    if (res.ok) {
      setDeptName('');
      setEditId(null);
      fetchDepartments();
    } else {
      alert('Failed to save department');
    }
  };

  const handleEdit = (dept: Department) => {
    setDeptName(dept.name);
    setEditId(dept.id);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this department?')) {
      const res = await fetch(`/api/departments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDepartments();
      } else {
        alert('Failed to delete department');
      }
    }
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <>
      {isAdmin && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label htmlFor="deptName" className="block">Name</label>
              <input type="text" id="deptName" value={deptName} onChange={(e) => setDeptName(e.target.value)} className="border p-2 w-full" required />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{editId ? 'Update' : 'Save'}</button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setDeptName(''); }} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
            )}
          </form>
        </div>
      )}
      <div className="bg-white p-4 rounded shadow mb-4">
        <table className="w-full border">
          <thead>
            <tr>
              <th>Name</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td>{dept.name}</td>
                {isAdmin && (<td><button onClick={() => handleEdit(dept)} className="text-blue-500">Edit</button><button onClick={() => handleDelete(dept.id)} className="text-red-500 ml-2">Delete</button></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
