import { useState } from 'react'
import { FileEdit, Plus, Bell, Newspaper, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

type TabType = 'announcements' | 'news' | 'events'

const mockAnnouncements = [
  { id: '1', title: 'Portal Maintenance – Saturday', body: 'The student portal will be down for maintenance on Saturday from 12am to 4am.', target: 'All Students', date: '2026-07-25' },
  { id: '2', title: 'Exam Schedule Released', body: 'The 1st semester exam timetable has been uploaded. Check your portal for details.', target: 'All Students', date: '2026-07-22' },
]

export default function AdminContent() {
  const [tab, setTab] = useState<TabType>('announcements')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', target: 'All Students', category: 'General', date: '', location: '' })

  const handlePost = () => {
    toast.success(`${tab === 'announcements' ? 'Announcement' : tab === 'news' ? 'News post' : 'Event'} published!`)
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-[#1a1a2e]">Content Management</h2>
        <button onClick={() => setShowModal(true)} className="btn-accent text-sm py-2.5">
          <Plus size={16} /> Add New
        </button>
      </div>

      <div className="flex gap-2">
        {([
          { key: 'announcements', icon: Bell },
          { key: 'news', icon: Newspaper },
          { key: 'events', icon: Calendar },
        ] as { key: TabType; icon: typeof Bell }[]).map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${tab === key ? 'bg-[#0f3460] text-white' : 'bg-white text-gray-500 border border-gray-200'}`}
          >
            <Icon size={14} /> {key}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {tab === 'announcements' && mockAnnouncements.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-[#e94560]/10 rounded-xl flex items-center justify-center shrink-0">
                <Bell size={18} className="text-[#e94560]" />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a2e]">{a.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{a.body}</p>
                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                  <span>Target: {a.target}</span>
                  <span>{a.date}</span>
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg shrink-0">
              <FileEdit size={15} className="text-gray-400" />
            </button>
          </div>
        ))}

        {tab === 'news' && (
          <div className="bg-[#f7f9fc] rounded-xl p-10 text-center text-gray-400">
            <Newspaper size={40} className="mx-auto mb-3 opacity-30" />
            <p>News posts will appear here. Click "Add New" to create one.</p>
          </div>
        )}

        {tab === 'events' && (
          <div className="bg-[#f7f9fc] rounded-xl p-10 text-center text-gray-400">
            <Calendar size={40} className="mx-auto mb-3 opacity-30" />
            <p>Events will appear here. Click "Add New" to create one.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6 capitalize">New {tab.replace('s', '')}</h3>
            <div className="space-y-4">
              <div><label className="label">Title</label><input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="input-field" /></div>
              <div><label className="label">Content</label><textarea value={form.body} onChange={(e) => setForm({...form, body: e.target.value})} className="input-field" rows={4} /></div>
              {tab === 'announcements' && (
                <div>
                  <label className="label">Target Audience</label>
                  <select value={form.target} onChange={(e) => setForm({...form, target: e.target.value})} className="input-field">
                    <option>All Students</option>
                    <option>Year 1 Students</option>
                    <option>Year 2 Students</option>
                    <option>Certificate Students</option>
                    <option>Diploma Students</option>
                  </select>
                </div>
              )}
              {tab === 'news' && (
                <div>
                  <label className="label">Category</label>
                  <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="input-field">
                    <option>General</option><option>Admissions</option><option>Academics</option><option>Events</option><option>Ministry</option>
                  </select>
                </div>
              )}
              {tab === 'events' && (
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label">Date</label><input value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} type="date" className="input-field" /></div>
                  <div><label className="label">Location</label><input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} className="input-field" placeholder="Venue" /></div>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={handlePost} className="btn-primary flex-1 justify-center">Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
