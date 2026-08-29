import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Plus, User, CheckCircle, XCircle, Edit, Eye } from 'lucide-react'
import { adminGetStudents, adminCreateStudent } from '../../services/api'
import toast from 'react-hot-toast'

const mockStudents = [
  { id: '1', schoolId: 'AGDNBC/2024/001', name: 'Emmanuel Okafor', programme: 'Diploma in Biblical Studies', level: 'Year 2', status: 'active', email: 'e.okafor@email.com', portalAccess: true },
  { id: '2', schoolId: 'AGDNBC/2024/002', name: 'Mary Johnson', programme: 'Certificate in Theology', level: 'Year 1', status: 'active', email: 'm.johnson@email.com', portalAccess: true },
  { id: '3', schoolId: 'AGDNBC/2024/003', name: 'James Adeyemi', programme: 'Mission & Evangelism', level: 'Year 1', status: 'inactive', email: 'j.adeyemi@email.com', portalAccess: false },
  { id: '4', schoolId: 'AGDNBC/2024/004', name: 'Grace Nwosu', programme: 'Christian Ministry & Leadership', level: 'Year 2', status: 'active', email: 'g.nwosu@email.com', portalAccess: false },
]

export default function AdminStudents() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', programme: '', level: 'Year 1' })
  const [saving, setSaving] = useState(false)

  const { data, isLoading, refetch } = useQuery({ queryKey: ['admin-students'], queryFn: adminGetStudents })
  const students = data?.data?.length ? data.data : mockStudents

  const filtered = students.filter((s: typeof mockStudents[0]) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.schoolId.toLowerCase().includes(search.toLowerCase()) ||
    s.programme.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async () => {
    setSaving(true)
    try {
      await adminCreateStudent(formData)
      toast.success('Student account created!')
      setShowModal(false)
      refetch()
    } catch {
      toast.error('Failed to create student.')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading students...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-[#1a1a2e]">Student Management</h2>
        <button onClick={() => setShowModal(true)} className="btn-accent text-sm py-2.5">
          <Plus size={16} /> Create Student Account
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
          placeholder="Search by name, school ID, or programme..."
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">{filtered.length} students found</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f7f9fc] text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-6 py-3">Student</th>
                <th className="text-left px-6 py-3">School ID</th>
                <th className="text-left px-6 py-3">Programme</th>
                <th className="text-center px-6 py-3">Level</th>
                <th className="text-center px-6 py-3">Portal</th>
                <th className="text-center px-6 py-3">Status</th>
                <th className="text-center px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student: typeof mockStudents[0]) => (
                <tr key={student.id} className="border-b border-gray-50 hover:bg-[#f7f9fc] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#0f3460] rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#1a1a2e] text-sm">{student.name}</div>
                        <div className="text-xs text-gray-400">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{student.schoolId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-[180px] truncate">{student.programme}</td>
                  <td className="px-6 py-4 text-center text-sm text-[#0f3460] font-semibold">{student.level}</td>
                  <td className="px-6 py-4 text-center">
                    {student.portalAccess
                      ? <CheckCircle size={16} className="text-green-500 mx-auto" />
                      : <XCircle size={16} className="text-red-400 mx-auto" />}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                      student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#0f3460]"><Eye size={15} /></button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#e94560]"><Edit size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-6 flex items-center gap-2">
              <User size={20} /> Create Student Account
            </h3>
            <div className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="Student full name" />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" className="input-field" placeholder="student@email.com" />
              </div>
              <div>
                <label className="label">Programme</label>
                <select value={formData.programme} onChange={(e) => setFormData({ ...formData, programme: e.target.value })} className="input-field">
                  <option value="">Select programme</option>
                  <option>Certificate in Theology</option>
                  <option>Diploma in Biblical Studies</option>
                  <option>Christian Ministry & Leadership</option>
                  <option>Mission & Evangelism</option>
                </select>
              </div>
              <div>
                <label className="label">Current Level</label>
                <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="input-field">
                  <option>Year 1</option>
                  <option>Year 2</option>
                </select>
              </div>
              <p className="text-xs text-gray-400">A School ID will be auto-generated. The student will set their own 8-character password on first login.</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={handleCreate} disabled={saving} className="btn-primary flex-1 justify-center">
                {saving ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
