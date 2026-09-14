import { useState } from 'react'
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const mockCourses = [
  // ── Year 1 ──────────────────────────────────────────────────────────────
  { id: '1',  code: 'SPF101', name: 'Spiritual Formation',                    year: 'Year 1', semester: '1st', credits: 3, lecturer: '' },
  { id: '2',  code: 'ESM102', name: 'Essentials of Supportive Ministry',      year: 'Year 1', semester: '1st', credits: 3, lecturer: '' },
  { id: '3',  code: 'HMT103', name: 'Hermeneutics',                           year: 'Year 1', semester: '1st', credits: 3, lecturer: '' },
  { id: '4',  code: 'PPS104', name: 'Prayer Principles',                      year: 'Year 1', semester: '1st', credits: 3, lecturer: '' },
  { id: '5',  code: 'ECC105', name: 'Ecclesiology',                           year: 'Year 1', semester: '1st', credits: 3, lecturer: '' },
  { id: '6',  code: 'MSG106', name: 'Missiology',                             year: 'Year 1', semester: '1st', credits: 3, lecturer: '' },
  { id: '7',  code: 'BLG107', name: 'Bible Language (Greek)',                 year: 'Year 1', semester: '2nd', credits: 3, lecturer: '' },
  { id: '8',  code: 'PTM108', name: 'Practical Theology of Ministry',         year: 'Year 1', semester: '2nd', credits: 3, lecturer: '' },
  { id: '9',  code: 'BLH109', name: 'Bible Language (Hebrew)',                year: 'Year 1', semester: '2nd', credits: 3, lecturer: '' },
  { id: '10', code: 'MNE110', name: 'Ministerial Ethics/Etiquettes',          year: 'Year 1', semester: '2nd', credits: 3, lecturer: '' },
  { id: '11', code: 'BBF111', name: 'Biblical Faith',                         year: 'Year 1', semester: '2nd', credits: 3, lecturer: '' },
  { id: '12', code: 'CAL112', name: 'Church Admin/Leadership',                year: 'Year 1', semester: '2nd', credits: 3, lecturer: '' },
  { id: '13', code: 'FMM113', name: 'Family, Marriage, and Ministry',         year: 'Year 1', semester: '2nd', credits: 3, lecturer: '' },
  { id: '14', code: 'FOG114', name: 'Fundamentals of GEWC',                   year: 'Year 1', semester: '2nd', credits: 3, lecturer: '' },
  { id: '15', code: 'KDH115', name: 'Kingdom Honour',                         year: 'Year 1', semester: '2nd', credits: 3, lecturer: '' },
  // ── Year 2 ──────────────────────────────────────────────────────────────
  { id: '16', code: 'PNM201', name: 'Pneumatology',                           year: 'Year 2', semester: '1st', credits: 3, lecturer: '' },
  { id: '17', code: 'RMG202', name: 'Research Methodology',                   year: 'Year 2', semester: '1st', credits: 3, lecturer: '' },
  { id: '18', code: 'WRS203', name: 'World Religions',                        year: 'Year 2', semester: '1st', credits: 3, lecturer: '' },
  { id: '19', code: 'STG204', name: 'Systematic Theology',                    year: 'Year 2', semester: '1st', credits: 3, lecturer: '' },
  { id: '20', code: 'APG205', name: 'Apologetics',                            year: 'Year 2', semester: '1st', credits: 3, lecturer: '' },
  { id: '21', code: 'CHT206', name: 'Church History',                         year: 'Year 2', semester: '1st', credits: 3, lecturer: '' },
  { id: '22', code: 'HML207', name: 'Homiletics',                             year: 'Year 2', semester: '1st', credits: 3, lecturer: '' },
  { id: '23', code: 'OTL208', name: 'Old Testament Literature',               year: 'Year 2', semester: '1st', credits: 3, lecturer: '' },
  { id: '24', code: 'NTL209', name: 'New Testament Literature',               year: 'Year 2', semester: '2nd', credits: 3, lecturer: '' },
  { id: '25', code: 'APE210', name: 'Apocalypse/Eschatology',                 year: 'Year 2', semester: '2nd', credits: 3, lecturer: '' },
  { id: '26', code: 'ECP211', name: 'Essentials of Christian Perfection',     year: 'Year 2', semester: '2nd', credits: 3, lecturer: '' },
  { id: '27', code: 'CHC212', name: 'Christian Counselling',                  year: 'Year 2', semester: '2nd', credits: 3, lecturer: '' },
  { id: '28', code: 'IRM213', name: 'Itinerant Ministry',                     year: 'Year 2', semester: '2nd', credits: 3, lecturer: '' },
  { id: '29', code: 'TYM214', name: 'Teens/Youth Ministry',                   year: 'Year 2', semester: '2nd', credits: 3, lecturer: '' },
  { id: '30', code: 'WSM215', name: 'Worship Ministry',                       year: 'Year 2', semester: '2nd', credits: 3, lecturer: '' },
  { id: '31', code: 'PJM216', name: 'Project Management',                     year: 'Year 2', semester: '2nd', credits: 3, lecturer: '' },
  { id: '32', code: 'PNP217', name: 'Pioneering Principles',                  year: 'Year 2', semester: '2nd', credits: 3, lecturer: '' },
  { id: '33', code: 'EFM218', name: 'Excellence in Facilities and Management',year: 'Year 2', semester: '2nd', credits: 3, lecturer: '' },
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
                <th className="text-left px-6 py-3">Year</th>
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
                  <td className="px-6 py-4 text-xs text-gray-500">{(course as typeof mockCourses[0]).year}</td>
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
