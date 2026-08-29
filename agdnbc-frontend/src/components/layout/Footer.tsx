import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0f3460] text-white">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#0f3460] font-bold">AG</span>
              </div>
              <div>
                <div className="font-bold text-sm">AGDNBC</div>
                <div className="text-[#e94560] text-xs">Satellite Campus</div>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-4">
              Apostle Geoffrey Dabibi Numbere Bible College — Equipping believers for Kingdom impact
              through sound biblical education and spiritual formation.
            </p>
            <div className="flex gap-3">
              {['Facebook', 'YouTube', 'Instagram', 'X'].map((name) => (
                <a
                  key={name}
                  href="#"
                  title={name}
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#e94560] transition-colors text-xs font-bold"
                >
                  {name.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#e94560]">Quick Links</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              {[
                ['About Us', '/about'],
                ['Academic Programmes', '/programmes'],
                ['Admissions', '/admissions'],
                ['Meet the Team', '/team'],
                ['News & Events', '/news-events'],
                ['Shop', '/shop'],
                ['Contact Us', '/contact'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white hover:underline transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Student */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#e94560]">Student</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              {[
                ['Student Portal', '/portal/login'],
                ['Online Examinations', '/portal/exams'],
                ['View Results', '/portal/results'],
                ['Make Payments', '/portal/payments'],
                ['Alumni Community', '/alumni'],
                ['Financial Partnership', '/partnership'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white hover:underline transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#e94560]">Contact Us</h4>
            <ul className="space-y-3 text-sm text-blue-200">
              <li className="flex gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#e94560]" />
                <span>AGDNBC Satellite Campus, Nigeria</span>
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="shrink-0 text-[#e94560]" />
                <a href="tel:+234XXXXXXXXXX" className="hover:text-white">+234 XXX XXX XXXX</a>
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="shrink-0 text-[#e94560]" />
                <a href="mailto:info@agdnbcsc.edu.ng" className="hover:text-white">info@agdnbcsc.edu.ng</a>
              </li>
            </ul>
            <div className="mt-5">
              <Link
                to="/admissions"
                className="inline-block bg-[#e94560] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#c73550] transition-colors"
              >
                Apply for Admission
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-blue-300">
          <span>© {new Date().getFullYear()} Apostle Geoffrey Dabibi Numbere Bible College, Satellite Campus. All rights reserved.</span>
          <span>www.agdnbcsc.edu.ng</span>
        </div>
      </div>
    </footer>
  )
}
