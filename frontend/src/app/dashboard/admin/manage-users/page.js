"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => { load(); }, []);

  async function load() {
    try { setUsers(await api.get("/api/users")); }
    catch (err) { console.error(err); }
  }

  async function updateRole(id, role) {
    try {
      await api.put(`/api/users/${id}/role`, { role });
      load();
    } catch (err) { alert(err.message); }
  }

  async function removeUser(id) {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      load();
    } catch (err) { alert(err.message); }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Email</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Role</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Credits</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b last:border-0">
                <td className="px-4 py-3 text-sm flex items-center gap-2">
                  {u.image && <img src={u.image} className="w-6 h-6 rounded-full" alt="" />}
                  {u.name}
                </td>
                <td className="px-4 py-3 text-sm">{u.email}</td>
                <td className="px-4 py-3 text-sm">
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u._id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="supporter">Supporter</option>
                    <option value="creator">Creator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-sm">{u.credits}</td>
                <td className="px-4 py-3 text-sm">
                  <button onClick={() => removeUser(u._id)} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
