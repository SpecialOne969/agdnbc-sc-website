import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Plus, User, CheckCircle, XCircle, Edit, Eye } from 'lucide-react'
import { adminGetStudents, adminCreateStudent } from '../../services/api'
import toast from 'react-hot-toast'

const mockStudents = [
  { id: '1',  schoolId: 'AGDNBCSC/2024/031PH', name: 'Hope Maxwell Kalio',           programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '2',  schoolId: 'AGDNBCSC/2024/032PH', name: 'John Iwokiri',                  programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '3',  schoolId: 'AGDNBCSC/2024/033PH', name: 'Richard Hart',                  programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '4',  schoolId: 'AGDNBCSC/2024/034PH', name: 'Sarah Abayomi',                 programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '5',  schoolId: 'AGDNBCSC/2024/035PH', name: 'Lawrence Hart',                 programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '6',  schoolId: 'AGDNBCSC/2024/036PH', name: 'Honour Kanam',                  programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '7',  schoolId: 'AGDNBCSC/2024/037PH', name: 'Baridakara N. C. Kpani',        programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '8',  schoolId: 'AGDNBCSC/2024/038PH', name: 'Steve Oparaodu',                programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '9',  schoolId: 'AGDNBCSC/2024/039PH', name: 'Duudee S. Lucky',               programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '10', schoolId: 'AGDNBCSC/2024/040PH', name: 'Azubuike Success Chinyere',     programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '11', schoolId: 'AGDNBCSC/2024/041PH', name: 'Marian Ohuoba',                 programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '12', schoolId: 'AGDNBCSC/2024/042PH', name: 'Otonye Africanus Ikpaki',       programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '13', schoolId: 'AGDNBCSC/2024/043PH', name: 'Beatrice Nnenna Ewa',           programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '14', schoolId: 'AGDNBCSC/2024/046PH', name: 'Moses Ijeh',                    programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '15', schoolId: 'AGDNBCSC/2024/048PH', name: 'Imeh E. Akpan',                 programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '16', schoolId: 'AGDNBCSC/2024/049PH', name: 'Favour Enyeribe',               programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '17', schoolId: 'AGDNBCSC/2024/050BY', name: 'Imiedubamo John Otini',         programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '18', schoolId: 'AGDNBCSC/2024/051BY', name: 'Dieozubida N. Igwele',          programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '19', schoolId: 'AGDNBCSC/2024/052BY', name: 'Ikpitibo Ebi Mathew',           programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '20', schoolId: 'AGDNBCSC/2024/053BY', name: 'Otobo Dina Walton',             programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '21', schoolId: 'AGDNBCSC/2024/054BY', name: 'Isaac Green',                   programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '22', schoolId: 'AGDNBCSC/2024/056BY', name: 'Otiti Akiebo',                  programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '23', schoolId: 'AGDNBCSC/2024/057BY', name: 'Ebizimo Pioyeinperekumo',       programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '24', schoolId: 'AGDNBCSC/2024/058BY', name: 'Christian Njoku',               programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '25', schoolId: 'AGDNBCSC/2024/059BY', name: 'Ebitimi Torugbene',             programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '26', schoolId: 'AGDNBCSC/2024/060BY', name: 'Barafiai Ziwaribotua',          programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '27', schoolId: 'AGDNBCSC/2024/061BY', name: 'Abbey Dike',                    programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '28', schoolId: 'AGDNBCSC/2024/062BY', name: 'Ibim Alabraba',                 programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '29', schoolId: 'AGDNBCSC/2024/064BY', name: 'Gilbert Daziba Evans',          programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '30', schoolId: 'AGDNBCSC/2024/065BY', name: 'Sarah Daniel',                  programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '31', schoolId: 'AGDNBCSC/2024/069BY', name: 'Ebiwari Igodo',                 programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '32', schoolId: 'AGDNBCSC/2024/070BY', name: 'Dankaba Monovie',               programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '33', schoolId: 'AGDNBCSC/2024/071BY', name: 'Kings Livinus Godswil',         programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '34', schoolId: 'AGDNBCSC/2024/073BY', name: 'Izibeniwulun Taribo',           programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '35', schoolId: 'AGDNBCSC/2024/074BY', name: 'Ogboin MacDonald Meekness',     programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '36', schoolId: 'AGDNBCSC/2024/075BY', name: 'Okeke Boniface',                programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '37', schoolId: 'AGDNBCSC/2024/076BY', name: 'Grace Green',                   programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '38', schoolId: 'AGDNBCSC/2024/077BY', name: 'Victor James',                  programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '39', schoolId: 'AGDNBCSC/2024/078PH', name: 'Letura Fred Nkookoo',           programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '40', schoolId: 'AGDNBCSC/2024/079PH', name: 'Orinaba Mammy Johnwill Otobo',  programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '41', schoolId: 'AGDNBCSC/2024/080PH', name: 'Nwanwa Joy Omolayo',            programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '42', schoolId: 'AGDNBCSC/2024/081PH', name: 'Prince B. Baloga',              programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '43', schoolId: 'AGDNBCSC/2024/082PH', name: 'Daniel Daniel Timothy',         programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '44', schoolId: 'AGDNBCSC/2024/083PH', name: 'Peace Akioma Odeodi',           programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '45', schoolId: 'AGDNBCSC/2024/084PH', name: 'Fiito Lekia',                   programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '46', schoolId: 'AGDNBCSC/2024/086PH', name: 'Chioma E. Dickey',              programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '47', schoolId: 'AGDNBCSC/2024/087PH', name: 'Mercy Furo-Awokumaka',          programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '48', schoolId: 'AGDNBCSC/2024/088PH', name: 'Ijeoma Achese-Amadi',           programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '49', schoolId: 'AGDNBCSC/2024/089PH', name: 'Achese Amadi',                  programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '50', schoolId: 'AGDNBCSC/2024/090PH', name: 'Cheta Friday',                  programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '51', schoolId: 'AGDNBCSC/2024/091PH', name: 'Maeke Obed Barilumene',         programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '52', schoolId: 'AGDNBCSC/2024/092PH', name: 'Felix Igisi Koromo',             programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '53', schoolId: 'AGDNBCSC/2024/093PH', name: 'Tamunobubelebara Otonye',       programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '54', schoolId: 'AGDNBCSC/2024/094PH', name: 'Kabia Blessing Gbirigbe',       programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '55', schoolId: 'AGDNBCSC/2024/095PH', name: 'Patricia Reuben',               programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '56', schoolId: 'AGDNBCSC/2024/096PH', name: 'Joseph Zorasi',                 programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '57', schoolId: 'AGDNBCSC/2024/098PH', name: 'Matthew Loveday',               programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '58', schoolId: 'AGDNBCSC/2024/099PH', name: 'Joseph Gift Sokari',            programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '59', schoolId: 'AGDNBCSC/2024/100BY', name: 'Beatrice Otti',                 programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '60', schoolId: 'AGDNBCSC/2024/101BY', name: 'Amanda Boma Oruye',             programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '61', schoolId: 'AGDNBCSC/2024/102BY', name: 'Ozue Oghenemaro Fidelis',       programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '62', schoolId: 'AGDNBCSC/2024/103PH', name: 'Beauty John Africa',            programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '63', schoolId: 'AGDNBCSC/2024/104PH', name: 'Dickey Gloria Ngozi',           programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
  { id: '64', schoolId: 'AGDNBCSC/2024/106BY', name: 'Lucky Wariboko',                programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '65', schoolId: 'AGDNBCSC/2024/107BY', name: 'Etu-Okpara Chikaodiri',         programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Bayelsa',       portalAccess: true },
  { id: '66', schoolId: 'AGDNBCSC/2024/108PH', name: 'Greatman Badom',                programme: 'Biblical Studies', level: 'Year 2', status: 'active', campus: 'Port Harcourt', portalAccess: true },
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
    (s.campus ?? '').toLowerCase().includes(search.toLowerCase())
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
                <th className="text-left px-6 py-3">Campus</th>
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
                        <div className="text-xs text-gray-400">{student.programme}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{student.schoolId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{(student as typeof mockStudents[0]).campus ?? '—'}</td>
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
