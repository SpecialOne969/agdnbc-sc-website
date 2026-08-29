import { useState } from 'react'
import { Upload, Download, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const mockResults = [
  { id: '1', studentId: 'AGDNBC/2024/001', name: 'Emmanuel Okafor', course: 'TH101', score: 82, grade: 'A', semester: '1st 2024/2025', status: 'published' },
  { id: '2', studentId: 'AGDNBC/2024/002', name: 'Mary Johnson', course: 'TH101', score: 76, grade: 'B', semester: '1st 2024/2025', status: 'published' },
  { id: '3', studentId: 'AGDNBC/2024/003', name: 'James Adeyemi', course: 'TH101', score: 55, grade: 'C', semester: '1st 2024/2025', status: 'published' },
]

export default function AdminResults() {
  const [search, setSearch] = useState('')
  const filtered = mockResults.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) || r.studentId.includes(search)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-[#1a1a2e]">Results Management</h2>
        <div className="flex gap-3">
          <label className="btn-outline text-sm py-2.5 cursor-pointer">
            <Upload size={16} /> Upload CSV
            <input type="file" className="hidden" accept=".csv" onChange={() => toast.success('Results file selected!')} />
          </label>
          <button className="btn-primary text-sm py-2.5">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <strong>CSV Format:</strong> School ID, Course Code, Score, Semester, Academic Year — one student per row.
        Download the template to get started.
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
                <th className="text-left px-6 py-3">School ID</th>
                <th className="text-center px-6 py-3">Course</th>
                <th className="text-center px-6 py-3">Score</th>
                <th className="text-center px-6 py-3">Grade</th>
                <th className="text-left px-6 py-3">Semester</th>
                <th className="text-center px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-[#f7f9fc]">
                  <td className="px-6 py-4 font-medium text-sm text-[#1a1a2e]">{r.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{r.studentId}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-[#0f3460]">{r.course}</td>
                  <td className="px-6 py-4 text-center font-bold text-[#0f3460]">{r.score}%</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">{r.grade}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.semester}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
