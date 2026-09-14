import { useState } from 'react'
import {
  Plus, ClipboardList, Clock, Users, Edit, Trash2,
  ChevronLeft, CheckCircle, BookOpen, HelpCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Question {
  id: string
  text: string
  type: 'mcq' | 'essay'
  options: string[]
  correctAnswer: string
  points: number
}

interface Exam {
  id: string
  title: string
  course: string
  date: string
  startTime: string
  endTime: string
  duration: number
  status: 'draft' | 'scheduled' | 'active' | 'completed'
  submissions: number
  questions: Question[]
}

const courses = [
  'SPF101','ESM102','HMT103','PPS104','ECC105','MSG106','BLG107','PTM108',
  'BLH109','MNE110','BBF111','CAL112','FMM113','FOG114','KDH115',
  'PNM201','RMG202','WRS203','STG204','APG205','CHT206','HML207','OTL208',
  'NTL209','APE210','ECP211','CHC212','IRM213','TYM214','WSM215',
  'PJM216','PNP217','EFM218',
]

const initialExams: Exam[] = [
  {
    id: '1', title: 'Hermeneutics – Final Exam', course: 'HMT103',
    date: '2026-09-20', startTime: '09:00', endTime: '11:00', duration: 60,
    status: 'scheduled', submissions: 0,
    questions: [
      { id: 'q1', text: 'What is the primary goal of biblical hermeneutics?', type: 'mcq', options: ['To translate the Bible','To interpret the Bible correctly','To memorize scripture','To write commentaries'], correctAnswer: 'To interpret the Bible correctly', points: 2 },
      { id: 'q2', text: 'How many books are in the Old Testament?', type: 'mcq', options: ['39','27','66','50'], correctAnswer: '39', points: 2 },
      { id: 'q3', text: 'What is the first book of the Bible?', type: 'mcq', options: ['Genesis','Exodus','Leviticus','Numbers'], correctAnswer: 'Genesis', points: 2 },
    ],
  },
  {
    id: '2', title: 'Pneumatology – Mid-Semester', course: 'PNM201',
    date: '2026-09-25', startTime: '10:00', endTime: '11:00', duration: 60,
    status: 'scheduled', submissions: 0, questions: [],
  },
  {
    id: '3', title: 'Systematic Theology Quiz', course: 'STG204',
    date: '2026-07-10', startTime: '09:00', endTime: '10:00', duration: 45,
    status: 'completed', submissions: 66,
    questions: [
      { id: 'q1', text: 'The Trinity consists of how many persons?', type: 'mcq', options: ['1','2','3','4'], correctAnswer: '3', points: 2 },
    ],
  },
]

const blankExamForm = { title: '', course: '', date: '', startTime: '', endTime: '', duration: '60', status: 'scheduled' }
const blankQForm = { text: '', type: 'mcq' as 'mcq' | 'essay', options: ['', '', '', ''], correctAnswer: '', points: '2' }

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  scheduled: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-purple-100 text-purple-700',
}

export default function AdminExams() {
  const [exams, setExams] = useState<Exam[]>(initialExams)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)

  const [showExamModal, setShowExamModal] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | null>(null)
  const [examForm, setExamForm] = useState(blankExamForm)

  const [showQModal, setShowQModal] = useState(false)
  const [editingQ, setEditingQ] = useState<Question | null>(null)
  const [qForm, setQForm] = useState(blankQForm)

  // ── Exam CRUD ──────────────────────────────────────────────
  const openCreate = () => { setEditingExam(null); setExamForm(blankExamForm); setShowExamModal(true) }

  const openEdit = (exam: Exam, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingExam(exam)
    setExamForm({ title: exam.title, course: exam.course, date: exam.date, startTime: exam.startTime, endTime: exam.endTime, duration: String(exam.duration), status: exam.status })
    setShowExamModal(true)
  }

  const saveExam = () => {
    if (!examForm.title || !examForm.course) { toast.error('Title and course are required'); return }
    if (editingExam) {
      const updated = exams.map(e => e.id === editingExam.id ? { ...e, ...examForm, duration: Number(examForm.duration), status: examForm.status as Exam['status'] } : e)
      setExams(updated)
      if (selectedExam?.id === editingExam.id) setSelectedExam(updated.find(e => e.id === editingExam.id) ?? null)
      toast.success('Exam updated!')
    } else {
      const exam: Exam = { id: Date.now().toString(), ...examForm, duration: Number(examForm.duration), status: examForm.status as Exam['status'], submissions: 0, questions: [] }
      setExams([exam, ...exams])
      toast.success('Exam created!')
    }
    setShowExamModal(false)
  }

  const deleteExam = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Delete this examination? This cannot be undone.')) return
    setExams(exams.filter(e => e.id !== id))
    if (selectedExam?.id === id) setSelectedExam(null)
    toast.success('Exam deleted')
  }

  // ── Question CRUD ──────────────────────────────────────────
  const openAddQ = () => { setEditingQ(null); setQForm(blankQForm); setShowQModal(true) }

  const openEditQ = (q: Question) => {
    setEditingQ(q)
    setQForm({ text: q.text, type: q.type, options: q.options.length === 4 ? [...q.options] : ['','','',''], correctAnswer: q.correctAnswer, points: String(q.points) })
    setShowQModal(true)
  }

  const saveQuestion = () => {
    if (!qForm.text.trim()) { toast.error('Question text is required'); return }
    if (qForm.type === 'mcq' && qForm.options.some(o => !o.trim())) { toast.error('Fill in all 4 options'); return }
    if (qForm.type === 'mcq' && !qForm.correctAnswer) { toast.error('Select the correct answer'); return }
    if (!selectedExam) return

    const q: Question = {
      id: editingQ?.id ?? Date.now().toString(),
      text: qForm.text,
      type: qForm.type,
      options: qForm.type === 'mcq' ? qForm.options : [],
      correctAnswer: qForm.type === 'mcq' ? qForm.correctAnswer : '',
      points: Number(qForm.points) || 1,
    }

    const questions = editingQ
      ? selectedExam.questions.map(existing => existing.id === editingQ.id ? q : existing)
      : [...selectedExam.questions, q]

    const updated = { ...selectedExam, questions }
    setExams(exams.map(e => e.id === selectedExam.id ? updated : e))
    setSelectedExam(updated)
    setShowQModal(false)
    toast.success(editingQ ? 'Question updated!' : 'Question added!')
  }

  const deleteQuestion = (qId: string) => {
    if (!selectedExam || !confirm('Delete this question?')) return
    const updated = { ...selectedExam, questions: selectedExam.questions.filter(q => q.id !== qId) }
    setExams(exams.map(e => e.id === selectedExam.id ? updated : e))
    setSelectedExam(updated)
    toast.success('Question deleted')
  }

  // ── Question Manager View ──────────────────────────────────
  if (selectedExam) {
    const totalMarks = selectedExam.questions.reduce((s, q) => s + q.points, 0)
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedExam(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-[#1a1a2e]">{selectedExam.title}</h2>
              <p className="text-sm text-gray-500">{selectedExam.course} · {selectedExam.date} · {selectedExam.duration} mins</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={(e) => openEdit(selectedExam, e)} className="btn-outline text-sm py-2.5">
              <Edit size={15} /> Edit Details
            </button>
            <button onClick={openAddQ} className="btn-accent text-sm py-2.5">
              <Plus size={16} /> Add Question
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Questions', value: selectedExam.questions.length },
            { label: 'Total Marks', value: totalMarks },
            { label: 'Submissions', value: selectedExam.submissions },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="text-2xl font-bold text-[#0f3460]">{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Questions */}
        {selectedExam.questions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
            <HelpCircle size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 mb-4">No questions yet. Add your first question to get started.</p>
            <button onClick={openAddQ} className="btn-primary"><Plus size={16} /> Add First Question</button>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedExam.questions.map((q, i) => (
              <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="w-7 h-7 bg-[#0f3460] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-[#1a1a2e] mb-3">{q.text}</p>
                      {q.type === 'mcq' ? (
                        <div className="grid grid-cols-2 gap-2">
                          {q.options.map((opt) => (
                            <div key={opt} className={`text-xs px-3 py-2 rounded-lg border flex items-center gap-1.5 ${opt === q.correctAnswer ? 'border-green-400 bg-green-50 text-green-700 font-semibold' : 'border-gray-100 bg-gray-50 text-gray-600'}`}>
                              {opt === q.correctAnswer && <CheckCircle size={11} />} {opt}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic bg-gray-50 rounded-lg px-3 py-2">Essay question — manually graded</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs bg-[#0f3460]/10 text-[#0f3460] px-2 py-1 rounded-lg font-semibold">{q.points} pt{q.points !== 1 ? 's' : ''}</span>
                    <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${q.type === 'mcq' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{q.type.toUpperCase()}</span>
                    <button onClick={() => openEditQ(q)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0f3460] transition-colors"><Edit size={14} /></button>
                    <button onClick={() => deleteQuestion(q.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Question Modal */}
        {showQModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1a1a2e]">{editingQ ? 'Edit Question' : 'Add Question'}</h3>
                <button onClick={() => setShowQModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="label">Question Text</label>
                  <textarea value={qForm.text} onChange={(e) => setQForm({ ...qForm, text: e.target.value })} className="input-field" rows={3} placeholder="Type the question here..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Question Type</label>
                    <select value={qForm.type} onChange={(e) => setQForm({ ...qForm, type: e.target.value as 'mcq' | 'essay', correctAnswer: '' })} className="input-field">
                      <option value="mcq">Multiple Choice (MCQ)</option>
                      <option value="essay">Essay / Short Answer</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Marks / Points</label>
                    <input type="number" min="1" value={qForm.points} onChange={(e) => setQForm({ ...qForm, points: e.target.value })} className="input-field" />
                  </div>
                </div>

                {qForm.type === 'mcq' && (
                  <div>
                    <label className="label">Options <span className="text-gray-400 font-normal text-xs">(click the radio button to mark the correct answer)</span></label>
                    <div className="space-y-2">
                      {qForm.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="correct-answer"
                            className="accent-green-600 shrink-0"
                            checked={qForm.correctAnswer !== '' && qForm.correctAnswer === opt}
                            onChange={() => opt.trim() && setQForm({ ...qForm, correctAnswer: opt })}
                          />
                          <input
                            value={opt}
                            onChange={(e) => {
                              const opts = [...qForm.options]
                              opts[i] = e.target.value
                              const correct = qForm.correctAnswer === opt ? e.target.value : qForm.correctAnswer
                              setQForm({ ...qForm, options: opts, correctAnswer: correct })
                            }}
                            className="input-field flex-1"
                            placeholder={`Option ${String.fromCharCode(65 + i)}`}
                          />
                        </div>
                      ))}
                    </div>
                    {qForm.correctAnswer && (
                      <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                        <CheckCircle size={11} /> Correct answer: <strong>{qForm.correctAnswer}</strong>
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button onClick={() => setShowQModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
                <button onClick={saveQuestion} className="btn-primary flex-1 justify-center">
                  {editingQ ? 'Update Question' : 'Add Question'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Exam List View ─────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#1a1a2e]">Examinations</h2>
        <button onClick={openCreate} className="btn-accent text-sm py-2.5">
          <Plus size={16} /> Create Examination
        </button>
      </div>

      {exams.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <ClipboardList size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 mb-4">No examinations yet.</p>
          <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Create First Exam</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {exams.map((exam) => (
            <div
              key={exam.id}
              onClick={() => setSelectedExam(exam)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-[#0f3460]/30 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-[#0f3460]/10 rounded-xl flex items-center justify-center shrink-0">
                    <ClipboardList size={20} className="text-[#0f3460]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#1a1a2e] truncate">{exam.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 flex-wrap">
                      <span className="font-bold text-[#e94560]">{exam.course}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {exam.date} · {exam.startTime}–{exam.endTime}</span>
                      <span className="flex items-center gap-1"><BookOpen size={10} /> {exam.questions.length} questions</span>
                      <span className="flex items-center gap-1"><Users size={10} /> {exam.submissions} submissions</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[exam.status]}`}>
                    {exam.status}
                  </span>
                  <button onClick={(e) => openEdit(exam, e)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0f3460] transition-colors">
                    <Edit size={15} />
                  </button>
                  <button onClick={(e) => deleteExam(exam.id, e)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Exam Modal */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6">{editingExam ? 'Edit Examination' : 'Create Examination'}</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Exam Title <span className="text-red-500">*</span></label>
                <input value={examForm.title} onChange={(e) => setExamForm({ ...examForm, title: e.target.value })} className="input-field" placeholder="e.g. TH101 Final Examination" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Course <span className="text-red-500">*</span></label>
                  <select value={examForm.course} onChange={(e) => setExamForm({ ...examForm, course: e.target.value })} className="input-field">
                    <option value="">Select course</option>
                    {courses.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select value={examForm.status} onChange={(e) => setExamForm({ ...examForm, status: e.target.value })} className="input-field">
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Date</label><input value={examForm.date} onChange={(e) => setExamForm({ ...examForm, date: e.target.value })} type="date" className="input-field" /></div>
                <div><label className="label">Duration (mins)</label><input value={examForm.duration} onChange={(e) => setExamForm({ ...examForm, duration: e.target.value })} type="number" className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Start Time</label><input value={examForm.startTime} onChange={(e) => setExamForm({ ...examForm, startTime: e.target.value })} type="time" className="input-field" /></div>
                <div><label className="label">End Time</label><input value={examForm.endTime} onChange={(e) => setExamForm({ ...examForm, endTime: e.target.value })} type="time" className="input-field" /></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowExamModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={saveExam} className="btn-primary flex-1 justify-center">{editingExam ? 'Update Exam' : 'Create Exam'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
