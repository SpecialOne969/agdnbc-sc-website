import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, BookOpen, GraduationCap } from 'lucide-react'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  {
    label: 'Academics',
    children: [
      { label: 'Programmes', to: '/programmes' },
      { label: 'Admissions', to: '/admissions' },
    ],
  },
  { label: 'Meet the Team', to: '/team' },
  { label: 'News & Events', to: '/news-events' },
  {
    label: 'Community',
    children: [
      { label: 'Alumni Community', to: '/alumni' },
      { label: 'Financial Partnership', to: '/partnership' },
    ],
  },
  { label: 'Shop', to: '/shop' },
  { label: 'Contact Us', to: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setDropdown(null)
  }, [location])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      {/* Top bar */}
      <div className="bg-[#0f3460] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>Apostle Geoffrey Dabibi Numbere Bible College – Satellite Campus</span>
          <div className="hidden md:flex gap-4 items-center">
            <Link to="/portal/login" className="flex items-center gap-1 hover:text-[#e94560] transition-colors">
              <BookOpen size={12} /> Student Portal
            </Link>
            <Link to="/admin/login" className="flex items-center gap-1 hover:text-[#e94560] transition-colors">
              <GraduationCap size={12} /> Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0f3460] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">AG</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-[#0f3460] font-bold text-sm leading-tight">AGDNBC</div>
            <div className="text-[#e94560] text-xs font-medium">Satellite Campus</div>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <li
                key={link.label}
                className="relative"
                onMouseEnter={() => setDropdown(link.label)}
                onMouseLeave={() => setDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#0f3460] rounded-lg hover:bg-gray-50 transition-all">
                  {link.label} <ChevronDown size={14} />
                </button>
                {dropdown === link.label && (
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-xl border border-gray-100 py-2 min-w-[180px] z-50">
                    {link.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f7f9fc] hover:text-[#0f3460] transition-colors"
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </li>
            ) : (
              <li key={link.to}>
                <NavLink
                  to={link.to!}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? 'text-[#e94560] bg-red-50'
                        : 'text-gray-700 hover:text-[#0f3460] hover:bg-gray-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            )
          )}
        </ul>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link to="/admissions" className="hidden md:inline-flex btn-accent text-sm py-2 px-4">
            Apply Now
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <div className="px-3 py-2 text-xs font-bold text-[#e94560] uppercase tracking-wider">
                  {link.label}
                </div>
                {link.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    className="block pl-6 pr-3 py-2 text-sm text-gray-700 hover:text-[#0f3460] rounded-lg"
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            ) : (
              <NavLink
                key={link.to}
                to={link.to!}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm font-medium rounded-lg ${
                    isActive ? 'text-[#e94560] bg-red-50' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Link to="/portal/login" className="btn-outline text-sm py-2 justify-center">
              Student Portal
            </Link>
            <Link to="/admissions" className="btn-accent text-sm py-2 justify-center">
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
