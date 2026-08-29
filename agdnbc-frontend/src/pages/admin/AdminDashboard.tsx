import { useQuery } from '@tanstack/react-query'
import { Users, CreditCard, ClipboardList, TrendingUp, BookOpen, AlertCircle } from 'lucide-react'
import { adminGetDashboardStats } from '../../services/api'

const mockStats = {
  totalStudents: 247,
  activeStudents: 231,
  totalRevenue: 4850000,
  pendingPayments: 38,
  activeExams: 3,
  newAdmissions: 12,
}

const recentActivity = [
  { type: 'payment', text: 'New payment received from AGDNBC/2024/012', time: '2 mins ago', color: 'bg-green-500' },
  { type: 'admission', text: 'New admission application submitted', time: '15 mins ago', color: 'bg-blue-500' },
  { type: 'exam', text: 'TH101 exam was submitted by 45 students', time: '1 hour ago', color: 'bg-purple-500' },
  { type: 'payment', text: '5 portal access fees processed', time: '2 hours ago', color: 'bg-green-500' },
  { type: 'result', text: 'Results uploaded for TH104', time: '3 hours ago', color: 'bg-orange-500' },
]

export default function AdminDashboard() {
  const { data } = useQuery({ queryKey: ['admin-stats'], queryFn: adminGetDashboardStats })
  const stats = data?.data || mockStats

  const cards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'bg-blue-50 text-blue-700', change: '+12 this month' },
    { label: 'Revenue Collected', value: `₦${(stats.totalRevenue / 1000000).toFixed(1)}M`, icon: CreditCard, color: 'bg-green-50 text-green-700', change: '₦840K this month' },
    { label: 'Pending Payments', value: stats.pendingPayments, icon: AlertCircle, color: 'bg-orange-50 text-orange-700', change: 'Needs attention' },
    { label: 'Active Exams', value: stats.activeExams, icon: ClipboardList, color: 'bg-purple-50 text-purple-700', change: '3 in progress' },
    { label: 'Active Students', value: stats.activeStudents, icon: TrendingUp, color: 'bg-teal-50 text-teal-700', change: '94% of enrolled' },
    { label: 'New Admissions', value: stats.newAdmissions, icon: BookOpen, color: 'bg-red-50 text-red-700', change: 'This week' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1a1a2e]">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm mt-1">2025/2026 Academic Session</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                <Icon size={20} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#1a1a2e] mb-1">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
            <div className="text-xs text-gray-400 mt-1">{change}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-[#1a1a2e]">Recent Activity</h3>
          </div>
          <div className="p-5 space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 ${item.color} rounded-full mt-2 shrink-0`} />
                <div>
                  <p className="text-sm text-gray-700">{item.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-[#1a1a2e]">Quick Actions</h3>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {[
              { label: 'Add Student', icon: Users, to: '/admin/students' },
              { label: 'Upload Results', icon: TrendingUp, to: '/admin/results' },
              { label: 'Create Exam', icon: ClipboardList, to: '/admin/exams' },
              { label: 'View Payments', icon: CreditCard, to: '/admin/payments' },
              { label: 'Manage Courses', icon: BookOpen, to: '/admin/courses' },
              { label: 'Post Announcement', icon: AlertCircle, to: '/admin/content' },
            ].map(({ label, icon: Icon, to }) => (
              <a
                key={label}
                href={to}
                className="flex items-center gap-2 p-3 bg-[#f7f9fc] rounded-xl text-sm font-medium text-[#1a1a2e] hover:bg-[#0f3460] hover:text-white transition-all group"
              >
                <Icon size={16} className="text-[#e94560] group-hover:text-white" /> {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
