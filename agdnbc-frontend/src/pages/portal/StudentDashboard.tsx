import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { BookOpen, FileText, ClipboardList, CreditCard, Bell, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { getMyAnnouncements, getMyPayments, getMyExams } from '../../services/api'

const quickLinks = [
  { label: 'My Courses', icon: BookOpen, to: '/portal/courses', color: 'bg-blue-50 text-blue-700' },
  { label: 'Results', icon: FileText, to: '/portal/results', color: 'bg-green-50 text-green-700' },
  { label: 'Examinations', icon: ClipboardList, to: '/portal/exams', color: 'bg-purple-50 text-purple-700' },
  { label: 'Payments', icon: CreditCard, to: '/portal/payments', color: 'bg-orange-50 text-orange-700' },
]

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const { data: announcements } = useQuery({ queryKey: ['announcements'], queryFn: getMyAnnouncements })
  const { data: payments } = useQuery({ queryKey: ['my-payments'], queryFn: getMyPayments })
  const { data: exams } = useQuery({ queryKey: ['my-exams'], queryFn: getMyExams })

  const announcementList = announcements?.data || []
  const paymentList = payments?.data || []
  const examList = exams?.data || []
  const hasOutstanding = paymentList.some((p: { status: string }) => p.status === 'pending')
  const upcomingExams = examList.filter((e: { status: string }) => e.status === 'upcoming')

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#0f3460] to-[#16213e] rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋</h2>
        <p className="text-blue-200 text-sm">
          {user?.programme || 'Diploma in Biblical Studies'} · {user?.level || 'Year 1'} · {user?.schoolId}
        </p>
      </div>

      {/* Alerts */}
      {!user?.portalAccessValid && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800 text-sm">Portal Access Fee Required</p>
            <p className="text-xs text-amber-700 mt-1">
              Your annual portal access fee of ₦1,000 is pending. Pay now to retain full access.
            </p>
          </div>
          <Link to="/portal/payments" className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 whitespace-nowrap">
            Pay Now
          </Link>
        </div>
      )}

      {hasOutstanding && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-700 text-sm">Outstanding Payments</p>
            <p className="text-xs text-red-600 mt-1">You have pending fee payments. Please settle to avoid access restrictions.</p>
          </div>
          <Link to="/portal/payments" className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 whitespace-nowrap">
            View
          </Link>
        </div>
      )}

      {/* Quick Links */}
      <div>
        <h3 className="font-bold text-[#0f3460] mb-4">Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map(({ label, icon: Icon, to, color }) => (
            <Link key={to} to={to} className={`${color} rounded-xl p-5 flex flex-col items-center gap-3 hover:opacity-80 transition-opacity group`}>
              <Icon size={28} />
              <span className="text-sm font-semibold text-center">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Exams + Announcements */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-[#0f3460] flex items-center gap-2">
              <ClipboardList size={18} /> Upcoming Exams
            </h3>
            <Link to="/portal/exams" className="text-xs text-[#e94560] hover:underline flex items-center gap-1">
              View All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="p-5">
            {upcomingExams.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ClipboardList size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No upcoming examinations</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingExams.slice(0, 3).map((exam: { id: string; title: string; date: string; duration: number }) => (
                  <div key={exam.id} className="flex items-center justify-between p-3 bg-[#f7f9fc] rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-[#0f3460]">{exam.title}</p>
                      <p className="text-xs text-gray-400">{exam.date} · {exam.duration} mins</p>
                    </div>
                    <Link to={`/portal/exams/${exam.id}/take`} className="text-xs bg-[#0f3460] text-white px-3 py-1 rounded-lg">
                      Take Exam
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-[#0f3460] flex items-center gap-2">
              <Bell size={18} /> Announcements
            </h3>
          </div>
          <div className="p-5">
            {announcementList.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Bell size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No announcements at this time</p>
              </div>
            ) : (
              <div className="space-y-3">
                {announcementList.slice(0, 4).map((a: { id: string; title: string; body: string; createdAt: string }) => (
                  <div key={a.id} className="flex gap-3 p-3 bg-[#f7f9fc] rounded-lg">
                    <CheckCircle size={16} className="text-[#e94560] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#0f3460]">{a.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
