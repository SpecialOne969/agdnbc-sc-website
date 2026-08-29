import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, BookOpen, FileText, ClipboardList,
  CreditCard, ShoppingBag, FileEdit, LogOut, Menu, Shield
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const adminLinks = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Students', to: '/admin/students', icon: Users },
  { label: 'Courses', to: '/admin/courses', icon: BookOpen },
  { label: 'Results', to: '/admin/results', icon: FileText },
  { label: 'Examinations', to: '/admin/exams', icon: ClipboardList },
  { label: 'Payments', to: '/admin/payments', icon: CreditCard },
  { label: 'Shop', to: '/admin/shop', icon: ShoppingBag },
  { label: 'Content', to: '/admin/content', icon: FileEdit },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a2e] text-white flex flex-col transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e94560] rounded-full flex items-center justify-center">
              <Shield size={18} />
            </div>
            <div>
              <div className="font-bold text-sm">AGDNBC Admin</div>
              <div className="text-gray-400 text-xs">Control Panel</div>
            </div>
          </Link>
        </div>

        <div className="p-4 border-b border-white/10">
          <div className="text-xs text-gray-400 mb-1">Logged in as</div>
          <div className="text-sm font-semibold">{user?.name || 'Administrator'}</div>
          <div className="text-xs text-[#e94560] capitalize">{user?.role?.replace('_', ' ')}</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminLinks.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive ? 'bg-[#e94560] text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu size={20} />
            </button>
            <h1 className="text-base font-bold text-[#1a1a2e]">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-[#0f3460] hover:underline">View Website</Link>
            <button onClick={handleLogout} className="hidden md:flex items-center gap-2 text-sm text-gray-500 hover:text-red-500">
              <LogOut size={15} /> Logout
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
