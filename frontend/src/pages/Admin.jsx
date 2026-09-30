import { ShieldCheck } from 'lucide-react';

export default function Admin() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded shadow-sm border">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="text-indigo-500 w-6 h-6"/>
          System Administration
        </h2>
        <p className="mt-2 text-sm text-slate-500">Manage users, audit logs, and pipeline execution states.</p>
      </div>

      <div className="bg-white border rounded shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td className="px-6 py-4">admin@meghanvaya.in</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded font-medium text-xs">ADMIN</span></td>
              <td className="px-6 py-4"><span className="text-emerald-500">Active</span></td>
            </tr>
            <tr>
              <td className="px-6 py-4">analyst@meghanvaya.in</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-medium text-xs">METEOROLOGIST</span></td>
              <td className="px-6 py-4"><span className="text-emerald-500">Active</span></td>
            </tr>
            <tr>
              <td className="px-6 py-4">officer@meghanvaya.in</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-amber-50 text-amber-700 rounded font-medium text-xs">GOVT_OFFICER</span></td>
              <td className="px-6 py-4"><span className="text-emerald-500">Active</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
