import { Mail } from 'lucide-react'

const team = [
  { name: 'Rev. Dr. A. Numbere', role: 'Principal / Provost', dept: 'Leadership', bio: 'A seasoned theologian with over 20 years in Christian ministry and biblical education.' },
  { name: 'Pastor B. Okafor', role: 'Academic Dean', dept: 'Academics', bio: 'Specialist in hermeneutics and systematic theology with a passion for equipping ministers.' },
  { name: 'Deacon C. Eze', role: 'Registrar', dept: 'Administration', bio: 'Oversees student admissions, records, and academic registry with over 15 years of experience.' },
  { name: 'Rev. D. Adeyemi', role: 'Head of Theology', dept: 'Faculty', bio: 'Expert in Old and New Testament studies, serving the college with dedication and insight.' },
  { name: 'Pastor E. Johnson', role: 'Head of Ministry Studies', dept: 'Faculty', bio: 'Passionate about practical ministry and leadership development for the next generation.' },
  { name: 'Sister F. Ibrahim', role: 'Finance Officer', dept: 'Finance', bio: 'Manages college finances and student payment records with excellence and integrity.' },
  { name: 'Rev. G. Peters', role: 'Chaplain', dept: 'Spiritual', bio: 'Dedicated to the spiritual growth and welfare of every student at the college.' },
  { name: 'Bro. H. Nduka', role: 'IT & Portal Administrator', dept: 'Technology', bio: 'Oversees the college digital infrastructure, student portal, and online systems.' },
]

const deptColors: Record<string, string> = {
  Leadership: 'bg-purple-100 text-purple-700',
  Academics: 'bg-blue-100 text-blue-700',
  Administration: 'bg-green-100 text-green-700',
  Faculty: 'bg-orange-100 text-orange-700',
  Finance: 'bg-yellow-100 text-yellow-700',
  Spiritual: 'bg-red-100 text-red-700',
  Technology: 'bg-teal-100 text-teal-700',
}

function initials(name: string) {
  return name.split(' ').slice(-2).map((n) => n[0]).join('')
}

export default function Team() {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#0f3460] to-[#16213e] text-white py-24 px-4 text-center">
        <p className="section-subtitle text-[#e94560]">Our People</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Meet the Team</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Dedicated servants of God committed to academic excellence and Kingdom ministry.
        </p>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(({ name, role, dept, bio }) => (
              <div key={name} className="card p-6 text-center group">
                <div className="w-20 h-20 bg-[#0f3460] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  {initials(name)}
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${deptColors[dept] || 'bg-gray-100 text-gray-600'}`}>
                  {dept}
                </span>
                <h3 className="font-bold text-[#0f3460] mt-3 mb-1">{name}</h3>
                <p className="text-xs text-[#e94560] font-semibold mb-3">{role}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{bio}</p>
                <a
                  href="mailto:info@agdnbcsc.edu.ng"
                  className="inline-flex items-center gap-1 text-xs text-[#0f3460] hover:text-[#e94560] transition-colors"
                >
                  <Mail size={12} /> Contact
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#f7f9fc] text-center px-4">
        <p className="text-gray-500 text-sm">
          Want to partner with us or join our faculty?{' '}
          <a href="/contact" className="text-[#e94560] font-semibold hover:underline">Contact us today</a>.
        </p>
      </section>
    </div>
  )
}
