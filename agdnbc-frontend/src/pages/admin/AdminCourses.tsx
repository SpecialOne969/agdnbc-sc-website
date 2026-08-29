import { useState } from 'react'
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const mockCourses = [
  { id: '1', code: 'TH101', name: 'Introduction to the Bible', programme: 'Certificate in Theology', semester: '1st', credits: 3, lecturer: 'Rev. Dr. A. Numbere' },
  { id: '2', code: 'TH102', name: 'Old Testament Survey', programme: 'Certificate in Theology', semester: '1st', credits: 3, lecturer: 'Rev. D. Adeyemi' },
  { id: '3', code: 'TH103', name: 'New Testament Survey', programme: 'Certificate in Theology', semester: '1st', credits: 3, lecturer: 'Pastor B. Okafor' },
  { id: '4', code: 'BS201', name: 'Biblical Hermeneutics', programme: 'Diploma in Biblical Studies', semester: '1st', credits: 3, lecturer: 'Pastor B. Okafor' },
  { id: '5', code: 'BS202', name: 'Systematic Theology', programme: 'Diploma in Biblical Studies', semester: '1st', credits: 3, lecturer: 'Rev. Dr. A. Numbere' },
]

export default function AdminCourses() {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ code: '', name: '', programme: '', semester: '1st', credits: '3', lecturer: '' })

  const handleSave = () => {
    toast.success('Course saved!')
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#1a1a2e]">Course Management</h2>
        <button onClick={() => setShowModal(true)} className="btn-accent text-sm py-2.5">
          <Plus size={16} /> Add Course
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f7f9fc] text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-6 py-3">Code</th>
                <th className="text-left px-6 py-3">Course Name</th>
                <th className="text-left px-6 py-3">Programme</th>
                <th className="text-center px-6 py-3">Semester</th>
                <th className="text-center px-6 py-3">Credits</th>
                <th className="text-left px-6 py-3">Lecturer</th>
                <th className="text-center px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockCourses.map((course) => (
                <tr key={course.id} className="border-b border-gray-50 hover:bg-[#f7f9fc]">
                  <td className="px-6 py-4 font-mono text-sm font-bold text-[#0f3460]">{course.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">{course.name}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 max-w-[160px] truncate">{course.programme}</td>
                  <td className="px-6 py-4 text-center text-sm">{course.semester}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-[#0f3460]">{course.credits}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{course.lecturer}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-[#0f3460]"><Edit size={14} /></button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><BookOpen size={20} /> Add Course</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Course Code</label><input value={form.code} onChange={(e) => setForm({...form, code: e.target.value})} className="input-field" placeholder="TH101" /></div>
                <div><label className="label">Credits</label><input value={form.credits} onChange={(e) => setForm({...form, credits: e.target.value})} className="input-field" type="number" min="1" max="6" /></div>
              </div>
              <div><label className="label">Course Name</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input-field" /></div>
              <div><label className="label">Programme</label><select value={form.programme} onChange={(e) => setForm({...form, programme: e.target.value})} className="input-field"><option value="">Select</option><option>Certificate in Theology</option><option>Diploma in Biblical Studies</option><option>Christian Ministry & Leadership</option><option>Mission & Evangelism</option></select></div>
              <div><label className="label">Lecturer</label><input value={form.lecturer} onChange={(e) => setForm({...form, lecturer: e.target.value})} className="input-field" /></div>
              <div><label className="label">Semester</label><select value={form.semester} onChange={(e) => setForm({...form, semester: e.target.value})} className="input-field"><option>1st</option><option>2nd</option></select></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex-1 justify-center">Save Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
