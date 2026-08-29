import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, User, BookOpen, FileText, ClipboardList,
  CreditCard, Bell, LogOut, Menu, X, GraduationCap
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const sidebarLinks = [
  { label: 'Dashboard', to: '/portal/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', to: '/portal/profile', icon: User },
  { label: 'My Courses', to: '/portal/courses', icon: BookOpen },
  { label: 'Results', to: '/portal/results', icon: FileText },
  { label: 'Examinations', to: '/portal/exams', icon: ClipboardList },
  { label: 'Payments', to: '/portal/payments', icon: CreditCard },
]

export default function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/portal/login')
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f3460] text-white flex flex-col transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#0f3460] font-bold text-sm">AG</span>
            </div>
            <div>
              <div className="font-bold text-sm">AGDNBC</div>
              <div className="text-[#e94560] text-xs">Student Portal</div>
            </div>
          </Link>
        </div>

        {/* Student info */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e94560] rounded-full flex items-center justify-center">
              <GraduationCap size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold">{user?.name || 'Student'}</div>
              <div className="text-xs text-blue-300">{user?.schoolId}</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive ? 'bg-[#e94560] text-white' : 'text-blue-200 hover:bg-white/10 hover:text-white'}`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-blue-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu size={20} />
            </button>
            <h1 className="text-base font-bold text-[#0f3460]">Student Portal</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#e94560] rounded-full" />
            </button>
            <button onClick={handleLogout} className="hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-red-500">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
