import { useState } from 'react'
import { Search, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const mockPayments = [
  { id: '1', studentId: 'AGDNBC/2024/001', name: 'Emmanuel Okafor', category: 'School Fees', amount: 35000, status: 'paid', date: '2026-01-20', ref: 'PAY-001' },
  { id: '2', studentId: 'AGDNBC/2024/002', name: 'Mary Johnson', category: 'Portal Access Fee', amount: 1000, status: 'paid', date: '2026-01-15', ref: 'PAY-002' },
  { id: '3', studentId: 'AGDNBC/2024/003', name: 'James Adeyemi', category: 'Tuition', amount: 30000, status: 'pending', date: null, ref: null },
  { id: '4', studentId: 'AGDNBC/2024/004', name: 'Grace Nwosu', category: 'School Fees', amount: 35000, status: 'paid', date: '2026-01-22', ref: 'PAY-004' },
]

const statusIcon = { paid: CheckCircle, pending: Clock, failed: AlertCircle }
const statusColor = { paid: 'text-green-600 bg-green-100', pending: 'text-orange-600 bg-orange-100', failed: 'text-red-600 bg-red-100' }

export default function AdminPayments() {
  const [search, setSearch] = useState('')
  const filtered = mockPayments.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.studentId.includes(search))
  const total = mockPayments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-[#1a1a2e]">Payment Records</h2>
        <button className="btn-outline text-sm py-2.5"><Download size={16} /> Export CSV</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="text-xs text-green-600 font-semibold">Total Collected</div>
          <div className="text-2xl font-bold text-green-700 mt-1">₦{total.toLocaleString()}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <div className="text-xs text-orange-600 font-semibold">Pending</div>
          <div className="text-2xl font-bold text-orange-700 mt-1">{mockPayments.filter((p) => p.status === 'pending').length}</div>
        </div>
        <div className="bg-[#f7f9fc] border border-gray-200 rounded-xl p-5">
          <div className="text-xs text-gray-500 font-semibold">Total Transactions</div>
          <div className="text-2xl font-bold text-[#0f3460] mt-1">{mockPayments.length}</div>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search by student name or ID..." />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f7f9fc] text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-6 py-3">Student</th>
                <th className="text-left px-6 py-3">Category</th>
                <th className="text-left px-6 py-3">Reference</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-right px-6 py-3">Amount</th>
                <th className="text-center px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const Icon = statusIcon[p.status as keyof typeof statusIcon]
                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-[#f7f9fc]">
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm text-[#1a1a2e]">{p.name}</div>
                      <div className="text-xs font-mono text-gray-400">{p.studentId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.category}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{p.ref || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{p.date || '—'}</td>
                    <td className="px-6 py-4 text-right font-bold text-[#0f3460]">₦{p.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[p.status as keyof typeof statusColor]}`}>
                        <Icon size={11} /> {p.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
