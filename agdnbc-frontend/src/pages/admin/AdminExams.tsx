import { useState } from 'react'
import { Plus, ClipboardList, Clock, Users, Edit } from 'lucide-react'
import toast from 'react-hot-toast'

const mockExams = [
  { id: '1', title: 'Introduction to Bible – Final', course: 'TH101', date: '2026-08-15', startTime: '09:00', duration: 60, questions: 30, status: 'scheduled', submissions: 0 },
  { id: '2', title: 'OT Survey – Mid-Semester', course: 'TH102', date: '2026-08-20', startTime: '10:00', duration: 60, questions: 20, status: 'scheduled', submissions: 0 },
  { id: '3', title: 'Christian Doctrine Quiz', course: 'TH104', date: '2026-07-10', startTime: '09:00', duration: 45, questions: 15, status: 'completed', submissions: 42 },
]

export default function AdminExams() {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', course: '', date: '', startTime: '', endTime: '', duration: '60' })

  const handleCreate = () => {
    toast.success('Examination created!')
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#1a1a2e]">Examinations</h2>
        <button onClick={() => setShowModal(true)} className="btn-accent text-sm py-2.5">
          <Plus size={16} /> Create Examination
        </button>
      </div>

      <div className="grid gap-4">
        {mockExams.map((exam) => (
          <div key={exam.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0f3460]/10 rounded-xl flex items-center justify-center">
                <ClipboardList size={20} className="text-[#0f3460]" />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a2e]">{exam.title}</h4>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span className="font-bold text-[#e94560]">{exam.course}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {exam.date} at {exam.startTime}</span>
                  <span>{exam.duration} mins · {exam.questions} questions</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users size={14} /> {exam.submissions} submissions
                </div>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                exam.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {exam.status}
              </span>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0f3460]"><Edit size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6">Create Examination</h3>
            <div className="space-y-4">
              <div><label className="label">Exam Title</label><input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="input-field" placeholder="e.g. TH101 Final Exam" /></div>
              <div><label className="label">Course</label><select value={form.course} onChange={(e) => setForm({...form, course: e.target.value})} className="input-field"><option value="">Select course</option><option>TH101</option><option>TH102</option><option>TH103</option><option>TH104</option><option>TH105</option></select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Date</label><input value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} type="date" className="input-field" /></div>
                <div><label className="label">Duration (minutes)</label><input value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} type="number" className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Start Time</label><input value={form.startTime} onChange={(e) => setForm({...form, startTime: e.target.value})} type="time" className="input-field" /></div>
                <div><label className="label">End Time</label><input value={form.endTime} onChange={(e) => setForm({...form, endTime: e.target.value})} type="time" className="input-field" /></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={handleCreate} className="btn-primary flex-1 justify-center">Create Exam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
