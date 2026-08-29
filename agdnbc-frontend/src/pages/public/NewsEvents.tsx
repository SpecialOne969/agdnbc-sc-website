import { Calendar, Tag } from 'lucide-react'

const news = [
  { date: 'July 15, 2026', category: 'Admissions', title: '2026/2027 Admission Forms Now Available', body: 'Applications for the new academic session are now open. Prospective students can apply online via the admissions page or visit the college in person.' },
  { date: 'July 10, 2026', category: 'Events', title: 'Convocation Ceremony – Class of 2026', body: 'The annual convocation ceremony to celebrate graduating students will hold at the college auditorium. Family and friends are welcome.' },
  { date: 'June 28, 2026', category: 'Academics', title: 'New Academic Materials Now Available in Shop', body: 'Updated course textbooks and study guides for the new session are now available. Students can purchase soft or hard copies from the school shop.' },
  { date: 'June 15, 2026', category: 'Ministry', title: 'Annual Revival Programme – Save the Date', body: 'Join us for our annual college revival programme. Guest ministers from across the country will minister the Word over three days.' },
  { date: 'June 5, 2026', category: 'Partnerships', title: 'New Financial Partnership Drive Launched', body: 'AGDNBC is reaching out to Kingdom-minded partners to support the expansion of the college and its scholarship programme.' },
]

const events = [
  { date: 'Aug 10, 2026', title: 'New Student Orientation', time: '9:00 AM', location: 'College Auditorium' },
  { date: 'Aug 20, 2026', title: 'Academic Session Begins', time: '8:00 AM', location: 'All Departments' },
  { date: 'Sep 5, 2026', title: 'Chapel Service & Prayer Week', time: '7:00 AM', location: 'Chapel' },
  { date: 'Sep 20, 2026', title: 'First Semester Examinations', time: '8:00 AM', location: 'Examination Hall' },
]

const categoryColors: Record<string, string> = {
  Admissions: 'bg-blue-100 text-blue-700',
  Events: 'bg-purple-100 text-purple-700',
  Academics: 'bg-green-100 text-green-700',
  Ministry: 'bg-orange-100 text-orange-700',
  Partnerships: 'bg-red-100 text-red-700',
}

export default function NewsEvents() {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#0f3460] to-[#16213e] text-white py-24 px-4 text-center">
        <p className="section-subtitle text-[#e94560]">Stay Informed</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">News & Events</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">Latest updates, announcements, and upcoming events from the college.</p>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-10">
          {/* News Feed */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#0f3460] mb-6">Latest News</h2>
            <div className="space-y-6">
              {news.map(({ date, category, title, body }) => (
                <div key={title} className="card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${categoryColors[category] || 'bg-gray-100 text-gray-600'}`}>
                      <Tag size={10} /> {category}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={11} /> {date}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0f3460] text-lg mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Events Sidebar */}
          <div>
            <h2 className="text-2xl font-bold text-[#0f3460] mb-6">Upcoming Events</h2>
            <div className="space-y-4">
              {events.map(({ date, title, time, location }) => (
                <div key={title} className="bg-[#f7f9fc] rounded-xl p-4 border-l-4 border-[#e94560]">
                  <div className="text-xs font-bold text-[#e94560] mb-1">{date}</div>
                  <h4 className="font-bold text-[#0f3460] text-sm mb-2">{title}</h4>
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <div>⏰ {time}</div>
                    <div>📍 {location}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-[#0f3460] rounded-xl p-6 text-white">
              <h4 className="font-bold mb-2">Get Notifications</h4>
              <p className="text-blue-200 text-sm mb-4">Students receive announcements directly in the student portal.</p>
              <a href="/portal/login" className="btn-accent text-sm py-2 w-full justify-center">
                Go to Portal
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
