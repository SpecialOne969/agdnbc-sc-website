import { Link } from 'react-router-dom'
import { ArrowRight, Target, Eye, Heart } from 'lucide-react'

const values = [
  { title: 'Biblical Authority', desc: 'All teaching is rooted in the inerrancy and sufficiency of the Holy Scriptures.' },
  { title: 'Spiritual Excellence', desc: 'We nurture authentic spiritual growth alongside academic achievement.' },
  { title: 'Kingdom Focus', desc: 'Every programme is designed to produce effective Kingdom ambassadors.' },
  { title: 'Community & Integrity', desc: 'We build a culture of accountability, love, and mutual respect.' },
]

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f3460] to-[#16213e] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-subtitle text-[#e94560]">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">About AGDNBC</h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Founded on the vision of Apostle Geoffrey Dabibi Numbere, our college stands as a beacon
            of biblical truth and Kingdom training in Nigeria.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-subtitle">Our Heritage</p>
            <h2 className="section-title">Our History & Foundation</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Apostle Geoffrey Dabibi Numbere Bible College was established to carry forward the
              legacy of one of Nigeria's foremost apostles — a man whose life was marked by unwavering
              faith, sacrificial service, and an unquenchable passion for souls.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Satellite Campus was established to extend this transformative education to a wider
              community of believers, making quality theological training accessible to more students
              across the region.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Today, the college continues to produce ministers, evangelists, teachers, and Kingdom
              workers who carry the fire of God's Word into every sphere of society.
            </p>
          </div>
          <div className="bg-[#f7f9fc] rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-6">
              {[
                { year: '2010+', label: 'Founded' },
                { value: '500+', label: 'Graduates' },
                { value: '12+', label: 'Programmes' },
                { value: '10+', label: 'Faculty Members' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-3xl font-extrabold text-[#0f3460] mb-1">{item.year || item.value}</div>
                  <div className="text-sm text-gray-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-[#f7f9fc]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Target,
                title: 'Our Mission',
                text: 'To raise up a generation of Kingdom ambassadors who are grounded in the Word, filled with the Spirit, and committed to transforming their world for Christ.',
              },
              {
                icon: Eye,
                title: 'Our Vision',
                text: 'A Nigeria and Africa where every believer is equipped, empowered, and deployed for effective Kingdom service in every sphere of society.',
              },
              {
                icon: Heart,
                title: 'Our Calling',
                text: 'To honour the legacy of Apostle G.D. Numbere by continuing his mandate of raising leaders who will disciple nations for the glory of God.',
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 bg-[#0f3460] rounded-full flex items-center justify-center mx-auto mb-5">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#0f3460] mb-4">{title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{text}</p>
              </div>
            ))}
          </div>

          {/* Core Values */}
          <div className="text-center mb-10">
            <p className="section-subtitle">What We Stand For</p>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 border-l-4 border-[#e94560] shadow-sm">
                <h4 className="font-bold text-[#0f3460] mb-2">{title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0f3460] text-white text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Be Part of Our Story</h2>
        <p className="text-blue-200 mb-8 max-w-xl mx-auto">
          Join thousands of believers who have been transformed through the ministry of the Word at AGDNBC.
        </p>
        <Link to="/admissions" className="btn-accent">
          Apply for Admission <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}
