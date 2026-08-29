import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ClipboardList, Clock, Calendar, CheckCircle, Lock, Play } from 'lucide-react'
import { getMyExams } from '../../services/api'

const mockExams = [
  { id: '1', title: 'Introduction to the Bible – Final Exam', course: 'TH101', date: '2026-08-15', startTime: '09:00', endTime: '11:00', duration: 60, status: 'upcoming', score: null },
  { id: '2', title: 'Old Testament Survey – Mid-Semester Test', course: 'TH102', date: '2026-08-20', startTime: '10:00', endTime: '11:00', duration: 60, status: 'upcoming', score: null },
  { id: '3', title: 'Christian Doctrine – Quiz', course: 'TH104', date: '2026-07-10', startTime: '09:00', endTime: '10:00', duration: 60, status: 'completed', score: 78 },
]

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  upcoming: { label: 'Upcoming', color: 'bg-blue-100 text-blue-700', icon: Calendar },
  active: { label: 'Active – Take Now', color: 'bg-green-100 text-green-700', icon: Play },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-600', icon: CheckCircle },
  missed: { label: 'Missed', color: 'bg-red-100 text-red-600', icon: Lock },
}

export default function StudentExams() {
  const { data, isLoading } = useQuery({ queryKey: ['my-exams'], queryFn: getMyExams })
  const exams = data?.data?.length ? data.data : mockExams

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading examinations...</div>

  const upcoming = exams.filter((e: typeof mockExams[0]) => e.status === 'upcoming' || e.status === 'active')
  const completed = exams.filter((e: typeof mockExams[0]) => e.status === 'completed' || e.status === 'missed')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0f3460]">My Examinations</h2>
      </div>

      {/* Instructions */}
      <div className="bg-[#0f3460] text-white rounded-xl p-5">
        <h4 className="font-bold mb-2 flex items-center gap-2"><ClipboardList size={18} /> Examination Guidelines</h4>
        <ul className="text-blue-200 text-sm space-y-1">
          <li>• Exams are only accessible during the approved date and time window.</li>
          <li>• Once started, the timer cannot be paused. Ensure you have a stable internet connection.</li>
          <li>• Do not navigate away from the exam page — this may be flagged.</li>
          <li>• Exams auto-submit when the time expires.</li>
        </ul>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="font-bold text-[#0f3460] mb-4">Upcoming & Active</h3>
          <div className="space-y-4">
            {upcoming.map((exam: typeof mockExams[0]) => {
              const cfg = statusConfig[exam.status] || statusConfig.upcoming
              const Icon = cfg.icon
              return (
                <div key={exam.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0f3460]/10 rounded-xl flex items-center justify-center shrink-0">
                      <ClipboardList size={20} className="text-[#0f3460]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0f3460]">{exam.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {exam.date}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {exam.startTime} – {exam.endTime}</span>
                        <span>{exam.duration} mins</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${cfg.color}`}>
                      <Icon size={11} /> {cfg.label}
                    </span>
                    {exam.status === 'active' && (
                      <Link to={`/portal/exams/${exam.id}/take`} className="btn-accent text-sm py-2">
                        <Play size={14} /> Start
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h3 className="font-bold text-[#0f3460] mb-4">Completed Exams</h3>
          <div className="space-y-3">
            {completed.map((exam: typeof mockExams[0]) => (
              <div key={exam.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle size={18} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0f3460] text-sm">{exam.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{exam.date}</p>
                  </div>
                </div>
                {exam.score !== null && (
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-[#0f3460]">{exam.score}%</div>
                    <div className="text-xs text-gray-400">Score</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
