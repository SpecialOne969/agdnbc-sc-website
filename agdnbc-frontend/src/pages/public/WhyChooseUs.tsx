import { Link } from 'react-router-dom'
import {
  BookOpen, GraduationCap, Church, Target, Users, Calendar,
  FileText, CreditCard, Heart, Shield, ArrowRight, CheckCircle,
} from 'lucide-react'

// Content sourced from the AGDNBC Satellite Campus "10 Key Reasons" brochure.
const reasons = [
  {
    icon: BookOpen,
    title: 'In-Depth Teaching of God’s Word',
    text: 'Experience the living truth of Scripture taught with depth, accuracy, and revelation. Our methodology delves into original languages, historical context, and cultural nuances—employing rigorous exegesis and systematic theology to ground you in sound doctrine and strengthen your walk with Christ.',
  },
  {
    icon: GraduationCap,
    title: 'Balanced Theological Education',
    text: 'A well-rounded foundation across every discipline of ministry, equipping you to teach, lead, and serve with confidence.',
    points: [
      ['Biblical Studies', 'Deep exploration of Scripture and doctrine'],
      ['Church History', 'Understanding faith’s heritage and development'],
      ['Christian Leadership', 'Developing effective ministry leaders'],
      ['Ministry Development', 'Practical training for kingdom service'],
    ],
  },
  {
    icon: Church,
    title: 'Prayer & Spiritual Growth',
    text: 'Central to our training is learning to live Scripture, not just know it. Daily prayer, spiritual disciplines, and walking in the Spirit equip you to hear God’s voice and live under His direction with power and purpose.',
  },
  {
    icon: Target,
    title: 'Focus on Service in God’s Kingdom',
    text: 'Everything we do points toward effective, fruitful Kingdom service.',
    points: [
      ['Knowledge', 'Grounded in Scripture'],
      ['Transformation', 'Heart changed by truth'],
      ['Usefulness', 'Equipped for effective ministry'],
      ['Impact', 'Making a lasting difference for Christ'],
    ],
  },
  {
    icon: Users,
    title: 'Experienced & Passionate Instructors',
    text: 'Our faculty brings extensive ministry experience and an authentic passion for teaching God’s Word. Each instructor holds advanced theological degrees and has served across diverse ministry capacities—seasoned pastors, missionaries, church planters, and youth leaders—walking alongside you as mentors who inspire your spiritual and intellectual growth.',
  },
  {
    icon: Calendar,
    title: 'Flexible Learning Options',
    text: 'Learn the way that fits your calling and schedule. A modern curriculum with interactive teaching, multimedia tools, and practical assignments prepares you for real-world ministry impact—not just theory.',
    points: [
      ['On-Campus', 'Immersive community experience'],
      ['Online', 'Learn at your own pace'],
    ],
  },
  {
    icon: FileText,
    title: 'Modern Teaching Aids & Up-to-Date Curriculum',
    text: 'Our curriculum is crafted to meet today’s dynamic ministry needs—interactive discussions, collaborative projects, and real-world case studies. We leverage modern multimedia tools, digital libraries, and online platforms, with hands-on assignments that prepare graduates for 21st-century ministry.',
  },
  {
    icon: CreditCard,
    title: 'Affordable & Accessible Education',
    text: 'We believe finances should never hinder your pursuit of God’s call. Our intentionally affordable fees make transformative spiritual education accessible to everyone committed to serving Christ.',
  },
  {
    icon: Heart,
    title: 'Spirit-Filled Community of Believers',
    text: 'You won’t study alone. Join a vibrant family of believers sharing your passion for God’s Word. Together we worship, pray, and grow in an atmosphere charged with love, faith, and the Holy Spirit’s presence.',
  },
  {
    icon: Shield,
    title: 'Preparation for a Lifetime of Impact',
    text: 'Our graduates don’t just earn certificates—they become God’s instruments for profound and lasting impact in their generation.',
    points: [
      ['Catalysts for Revival', 'Igniting spiritual awakenings and leading souls to Christ'],
      ['Empowered Leaders', 'Pastoring churches, planting ministries, mentoring others'],
      ['Agents of Transformation', 'Bringing Kingdom values to communities and society'],
    ],
  },
]

const destiny = [
  { title: 'Answer God’s Call', text: 'Respond to His invitation to deeper learning.' },
  { title: 'Be Transformed', text: 'Grow in grace, knowledge, and spiritual power.' },
  { title: 'Make Impact', text: 'Become God’s instrument for revival and transformation.' },
]

export default function WhyChooseUs() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1b2473] to-[#16213e] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-subtitle text-[#c49a1a]">Why AGDNBC</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Why Choose AGDNBC</h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Deepen your understanding of God&apos;s Word. Grow in grace, power, and purpose through
            transformative theological education designed for Spirit-filled believers ready to serve
            God&apos;s kingdom.
          </p>
        </div>
      </section>

      {/* Reasons */}
      <section className="py-20 bg-[#f7f9fc]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subtitle">What Sets Us Apart</p>
            <h2 className="section-title">Ten Reasons to Train With Us</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {reasons.map(({ icon: Icon, title, text, points }, i) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 shrink-0 bg-[#1b2473] rounded-full flex items-center justify-center">
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#c49a1a]">
                      REASON {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-lg font-bold text-[#1b2473] leading-tight">{title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">{text}</p>

                {points && (
                  <div className="grid sm:grid-cols-2 gap-3 mt-5">
                    {points.map(([label, desc]) => (
                      <div
                        key={label}
                        className="bg-[#f7f9fc] rounded-xl p-4 border-l-4 border-[#c49a1a]"
                      >
                        <div className="font-semibold text-[#1b2473] text-sm">{label}</div>
                        <div className="text-xs text-gray-500 leading-relaxed mt-0.5">{desc}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Destiny Awaits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subtitle">Your Destiny Awaits</p>
            <h2 className="section-title">Take the Next Step</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {destiny.map(({ title, text }, i) => (
              <div key={title} className="text-center">
                <div className="w-16 h-16 bg-[#c49a1a] rounded-full flex items-center justify-center mx-auto mb-5 text-white text-xl font-extrabold">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-[#1b2473] mb-3 flex items-center justify-center gap-2">
                  <CheckCircle size={18} className="text-[#c49a1a]" /> {title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1b2473] text-white text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Don&apos;t Delay Your Destiny</h2>
        <p className="text-blue-200 mb-8 max-w-xl mx-auto">
          Take the next step today and join Apostle Geoffrey Dabibi Numbere Bible College
          &mdash; Satellite Campus. Equip yourself to learn, grow, and serve for a lifetime of
          kingdom impact.
        </p>
        <Link to="/admissions" className="btn-accent">
          Apply for Admission <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}
