import { Link } from 'react-router-dom'
import {
  ArrowRight, BookOpen, Users, Award, Globe, ChevronRight,
  Star, Quote, Calendar, Clock, FileText, ClipboardList, CreditCard
} from 'lucide-react'

const stats = [
  { value: '100+', label: 'Students Enrolled' },
  { value: '26', label: 'Courses Offered' },
  { value: '2+', label: 'Years of Excellence' },
  { value: '95%', label: 'Graduate Success Rate' },
]

const programmes = [
  { title: 'Certificate in Theology', duration: '1 Year', level: 'Certificate', icon: BookOpen },
  { title: 'Diploma in Biblical Studies', duration: '2 Years', level: 'Diploma', icon: Award },
  { title: 'Christian Ministry & Leadership', duration: '2 Years', level: 'Diploma', icon: Users },
  { title: 'Mission & Evangelism', duration: '1 Year', level: 'Certificate', icon: Globe },
]

const testimonials = [
  {
    name: 'Pastor Emmanuel Obi',
    programme: 'Diploma in Biblical Studies',
    text: 'AGDNBC transformed my understanding of scripture and equipped me for effective ministry. The faculty\'s dedication is unmatched.',
  },
  {
    name: 'Sister Mary Okoro',
    programme: 'Certificate in Theology',
    text: 'The spiritual atmosphere here is remarkable. I gained not just knowledge but genuine spiritual depth for Kingdom work.',
  },
  {
    name: 'Deacon James Adeyemi',
    programme: 'Mission & Evangelism',
    text: 'The missions training programme gave me practical tools for reaching the lost. I have planted three churches since graduating.',
  },
]

const news = [
  {
    date: 'July 15, 2026',
    title: '2026/2027 Admission Forms Now Available',
    excerpt: 'Applications are now open for the new academic session. Apply online today.',
    category: 'Admissions',
  },
  {
    date: 'July 10, 2026',
    title: 'Convocation Ceremony — Class of 2026',
    excerpt: 'Join us as we celebrate our graduating class at this year\'s convocation ceremony.',
    category: 'Events',
  },
  {
    date: 'June 28, 2026',
    title: 'New Academic Materials Now in Shop',
    excerpt: 'Updated course textbooks and study guides are now available in the online shop.',
    category: 'Academics',
  },
]

export default function Home() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-[#0f3460] via-[#16213e] to-[#0f3460] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#e94560] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#e94560]/20 border border-[#e94560]/30 text-[#e94560] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <Star size={12} /> Apostle G.D Numbere Bible College
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Equipping Believers<br />
              <span className="text-[#e94560]">for Kingdom Impact</span>
            </h1>
            <p className="text-blue-200 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              Join a community of faith where sound biblical education, spiritual formation, and practical
              ministry training converge — preparing you to make a lasting impact for God's Kingdom.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/admissions" className="btn-accent text-base py-3.5 px-8">
                Apply for Admission <ArrowRight size={18} />
              </Link>
              <Link to="/programmes" className="border-2 border-white/40 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-all inline-flex items-center gap-2">
                View Programmes <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── Stats ── */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-[#0f3460] mb-1">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About snippet ── */}
      <section className="py-20 bg-[#f7f9fc]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-subtitle">Who We Are</p>
              <h2 className="section-title">A Centre of Biblical Excellence</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                The Apostle Geoffrey Dabibi Numbere Bible College, Satellite Campus (AGDNBC_SC) is a premier
                Christian institution committed to providing quality theological education rooted in the
                Kingdom vision of Apostle G.D. Numbere.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our programmes combine academic rigour with deep spiritual formation, producing graduates who
                are not just learned, but genuinely transformed — ready to serve in churches, missions,
                community development, and beyond.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  'Sound Biblical Teaching',
                  'Practical Ministry Training',
                  'Spiritual Formation',
                  'Community Development',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-5 h-5 bg-[#e94560] rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn-primary">
                Learn More About Us <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-[#0f3460] rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                <p className="text-blue-200 leading-relaxed mb-6">
                  To raise up a generation of Kingdom ambassadors who are grounded in the Word, filled with
                  the Spirit, and committed to transforming their world for Christ.
                </p>
                <h3 className="text-xl font-bold mb-3">Our Vision</h3>
                <p className="text-blue-200 leading-relaxed">
                  A Nigeria and Africa where every believer is equipped, empowered, and deployed for
                  effective Kingdom service.
                </p>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#e94560] rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Programmes ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subtitle">What We Offer</p>
            <h2 className="section-title">Our Academic Programmes</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Choose from a range of biblically grounded programmes designed to equip you for ministry,
              leadership, and Kingdom service.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programmes.map(({ title, duration, level, icon: Icon }) => (
              <div key={title} className="card p-6 group hover:-translate-y-1 transition-transform duration-200">
                <div className="w-12 h-12 bg-[#0f3460]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0f3460] transition-colors">
                  <Icon size={22} className="text-[#0f3460] group-hover:text-white transition-colors" />
                </div>
                <div className="text-xs font-bold text-[#e94560] uppercase tracking-wider mb-2">{level}</div>
                <h3 className="font-bold text-[#0f3460] mb-2 leading-snug">{title}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock size={12} /> {duration}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/programmes" className="btn-outline">
              View All Programmes <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Admissions CTA ── */}
      <section className="py-16 bg-[#e94560]">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Applications for the 2026/2027 academic session are now open. Take the first step toward
            your calling today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/admissions"
              className="bg-white text-[#e94560] font-bold px-8 py-3.5 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              Apply Now <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-[#f7f9fc]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subtitle">Student Voices</p>
            <h2 className="section-title">What Our Alumni Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, programme, text }) => (
              <div key={name} className="card p-6">
                <Quote size={32} className="text-[#e94560]/30 mb-4" />
                <p className="text-gray-600 italic leading-relaxed mb-5">"{text}"</p>
                <div className="border-t border-gray-100 pt-4">
                  <div className="font-bold text-[#0f3460]">{name}</div>
                  <div className="text-xs text-[#e94560]">{programme}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── News & Events ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
            <div>
              <p className="section-subtitle">Stay Updated</p>
              <h2 className="section-title mb-0">Latest News & Events</h2>
            </div>
            <Link to="/news-events" className="btn-outline text-sm py-2.5">
              View All <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {news.map(({ date, title, excerpt, category }) => (
              <div key={title} className="card overflow-hidden group">
                <div className="bg-[#0f3460] h-3" />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-[#e94560]/10 text-[#e94560] font-semibold px-3 py-1 rounded-full">
                      {category}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={11} /> {date}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0f3460] mb-2 group-hover:text-[#e94560] transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500">{excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portal Quick Access ── */}
      <section className="py-16 bg-[#0f3460]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Student Quick Access</h2>
            <p className="text-blue-300">Everything you need, in one place.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Student Portal', icon: Users, to: '/portal/login' },
              { label: 'Check Results', icon: FileText, to: '/portal/results' },
              { label: 'Take Exam', icon: ClipboardList, to: '/portal/exams' },
              { label: 'Make Payment', icon: CreditCard, to: '/portal/payments' },
            ].map(({ label, icon: Icon, to }) => (
              <Link
                key={label}
                to={to}
                className="bg-white/10 hover:bg-[#e94560] border border-white/20 rounded-xl p-5 text-white text-center transition-all group"
              >
                <Icon size={28} className="mx-auto mb-2" />
                <div className="text-sm font-semibold">{label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

