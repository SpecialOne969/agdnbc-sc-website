import { Link } from 'react-router-dom'
import { Clock, BookOpen, Users, Award, Globe, ArrowRight, CheckCircle } from 'lucide-react'

const oneYearFees = [
  { label: 'Registration Fee', amount: '₦10,000', sub: null },
  { label: 'School Fees – Year 1', amount: '₦105,000', sub: ['1st Installment: ₦55,000', '2nd Installment: ₦50,000'] },
]

const twoYearFees = [
  { label: 'Registration Fee', amount: '₦10,000', sub: null },
  { label: 'School Fees – Year 1', amount: '₦105,000', sub: ['1st Installment: ₦55,000', '2nd Installment: ₦50,000'] },
  { label: 'School Fees – Year 2', amount: '₦155,000', sub: ['1st Installment: ₦80,000', '2nd Installment: ₦75,000'] },
]

const programmes = [
  {
    icon: BookOpen,
    level: 'Certificate',
    title: 'Certificate in Theology',
    duration: '1 Academic Year',
    fees: oneYearFees,
    totalAmount: '₦115,000',
    description:
      'An introductory programme providing a solid foundation in theological principles, biblical interpretation, and Christian living.',
    modules: ['Introduction to the Bible', 'Old Testament Survey', 'New Testament Survey', 'Christian Doctrine', 'Church History', 'Homiletics'],
  },
  {
    icon: Award,
    level: 'Diploma',
    title: 'Diploma in Biblical Studies',
    duration: '2 Academic Years',
    fees: twoYearFees,
    totalAmount: '₦270,000',
    description:
      'A comprehensive study of Scripture covering biblical languages, hermeneutics, systematic theology, and practical ministry.',
    modules: ['Biblical Hermeneutics', 'Systematic Theology', 'Biblical Languages (Greek/Hebrew Intro)', 'Pastoral Theology', 'Christian Ethics', 'Counselling'],
  },
  {
    icon: Users,
    level: 'Diploma',
    title: 'Christian Ministry & Leadership',
    duration: '2 Academic Years',
    fees: twoYearFees,
    totalAmount: '₦270,000',
    description:
      'Focused training for those called to church leadership, covering leadership principles, administration, and ministry management.',
    modules: ['Leadership Principles', 'Church Administration', 'Preaching & Teaching', 'Discipleship & Mentoring', 'Conflict Resolution', 'Ministry Practicum'],
  },
  {
    icon: Globe,
    level: 'Certificate',
    title: 'Mission & Evangelism',
    duration: '1 Academic Year',
    fees: oneYearFees,
    totalAmount: '₦115,000',
    description:
      'A specialised programme equipping students for cross-cultural missions, evangelism strategies, and church planting.',
    modules: ['Missiology', 'Cross-Cultural Communication', 'Evangelism Strategies', 'Church Planting', 'World Religions', 'Field Practicum'],
  },
]

export default function Programmes() {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#0f3460] to-[#16213e] text-white py-24 px-4 text-center">
        <p className="section-subtitle text-[#e94560]">Academics</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Academic Programmes</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Discover programmes designed to equip you for effective ministry, leadership, and Kingdom service.
        </p>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 space-y-10">
          {programmes.map(({ icon: Icon, level, title, duration, description, modules, fees, totalAmount }: typeof programmes[0]) => (
            <div key={title} className="card p-8 grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#0f3460] rounded-xl flex items-center justify-center">
                    <Icon size={22} className="text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#e94560] uppercase tracking-wider">{level}</span>
                    <h3 className="text-xl font-bold text-[#0f3460]">{title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">{description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                  <Clock size={14} className="text-[#e94560]" /> {duration}
                </div>

                {/* Fee breakdown */}
                <div className="bg-[#f7f9fc] rounded-xl p-4 mb-5 border border-gray-100">
                  <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Fee Breakdown</h5>
                  <div className="space-y-2">
                    {fees.map((f) => (
                      <div key={f.label}>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{f.label}</span>
                          <span className="font-semibold text-[#0f3460]">{f.amount}</span>
                        </div>
                        {f.sub && (
                          <div className="ml-3 mt-0.5 space-y-0.5">
                            {f.sub.map((s) => (
                              <p key={s} className="text-xs text-gray-400">{s}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
                      <span className="font-bold text-[#0f3460]">Total</span>
                      <span className="font-extrabold text-[#e94560]">{totalAmount}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">* School fees include portal access</p>
                </div>

                <Link to="/admissions" className="btn-accent text-sm py-2.5">
                  Apply for This Programme <ArrowRight size={15} />
                </Link>
              </div>
              <div className="bg-[#f7f9fc] rounded-xl p-5">
                <h4 className="font-bold text-sm text-[#0f3460] mb-3">Key Modules</h4>
                <ul className="space-y-2">
                  {modules.map((mod) => (
                    <li key={mod} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle size={14} className="text-[#e94560] shrink-0" /> {mod}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-[#e94560] text-white text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Start Your Theological Journey Today</h2>
        <p className="text-white/80 mb-8 max-w-xl mx-auto">Applications are open. Choose your programme and apply online in minutes.</p>
        <Link to="/admissions" className="bg-white text-[#e94560] font-bold px-8 py-3.5 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
          Apply Now <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  )
}
