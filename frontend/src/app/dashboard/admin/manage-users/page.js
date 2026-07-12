"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Person, TrashBin } from "@gravity-ui/icons";

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
    if (!confirm("Delete this user? This action cannot be undone.")) return;
    try {
      await api.delete(`/api/users/${id}`);
      load();
    } catch (err) { alert(err.message); }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-sm text-gray-500 mt-1">View, update roles, and manage platform users</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Credits</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5 text-sm">
                  <div className="flex items-center gap-2.5">
                    {u.image || u.photoUrl ? (
                      <img src={u.image || u.photoUrl} className="w-7 h-7 rounded-full object-cover" alt="" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Person className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{u.email}</td>
                <td className="px-4 py-3.5 text-sm">
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u._id, e.target.value)}
                    className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="supporter">Supporter</option>
                    <option value="creator">Creator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{u.credits}</td>
                <td className="px-4 py-3.5 text-sm">
                  <button
                    onClick={() => removeUser(u._id)}
                    className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <TrashBin className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Person className="w-8 h-8 mb-2" />
                    <p className="text-sm">No users found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
