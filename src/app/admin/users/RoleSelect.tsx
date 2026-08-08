"use client";

import { useState } from "react";
import { updateUserRole } from "./actions";

export default function RoleSelect({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setLoading(true);
    try {
      await updateUserRole(userId, newRole);
    } catch (err) {
      alert("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case "ADMIN": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      case "SELLER": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div className="relative">
      <select
        value={currentRole}
        onChange={handleChange}
        disabled={loading}
        className={`appearance-none px-3 py-1 pr-8 rounded text-xs font-bold border outline-none cursor-pointer ${getRoleColor(currentRole)} ${loading ? 'opacity-50' : ''}`}
      >
        <option value="BUYER">BUYER</option>
        <option value="SELLER">SELLER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
        <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
}
