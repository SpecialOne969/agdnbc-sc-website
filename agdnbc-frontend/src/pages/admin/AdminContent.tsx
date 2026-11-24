import { useState, useEffect, useCallback } from 'react'
import { Plus, Bell, Newspaper, Calendar, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  adminCreateAnnouncement,
  adminGetAnnouncements,
  adminUpdateAnnouncement,
  adminDeleteAnnouncement,
} from '../../services/api'

type TabType = 'announcements' | 'news' | 'events'

interface Announcement {
  id: string
  title: string
  body: string
  target?: string
  createdAt: string
}

export default function AdminContent() {
  const [tab, setTab] = useState<TabType>('announcements')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', target: 'All Students', category: 'General', date: '', location: '' })
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const loadAnnouncements = useCallback(async () => {
    try {
      const res = await adminGetAnnouncements()
      setAnnouncements(res.data)
    } catch {
      /* not logged in yet or request failed */
    }
  }, [])

  useEffect(() => { loadAnnouncements() }, [loadAnnouncements])

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...form, title: '', body: '', target: 'All Students' })
    setShowModal(true)
  }

  const openEdit = (a: Announcement) => {
    setTab('announcements')
    setEditingId(a.id)
    setForm({ ...form, title: a.title, body: a.body, target: a.target || 'All Students' })
    setShowModal(true)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    try {
      await adminDeleteAnnouncement(id)
      toast.success('Announcement deleted')
      loadAnnouncements()
    } catch {
      toast.error('Failed to delete announcement')
    }
  }

  const handlePost = async () => {
    if (tab === 'announcements') {
      if (!form.title.trim() || !form.body.trim()) {
        toast.error('Title and content are required')
        return
      }
      setSaving(true)
      try {
        if (editingId) {
          await adminUpdateAnnouncement(editingId, { title: form.title, body: form.body, target: form.target })
          toast.success('Announcement updated!')
        } else {
          await adminCreateAnnouncement({ title: form.title, body: form.body, target: form.target })
          toast.success('Announcement published!')
        }
        setForm({ ...form, title: '', body: '' })
        setEditingId(null)
        setShowModal(false)
        loadAnnouncements()
      } catch {
        toast.error('Failed to save announcement')
      } finally {
        setSaving(false)
      }
      return
    }
    toast(`${tab === 'news' ? 'News' : 'Events'} management is coming soon.`)
    setShowModal(false)
  }

  const closeModal = () => { setShowModal(false); setEditingId(null) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-[#1a1a2e]">Content Management</h2>
        <button onClick={openCreate} className="btn-accent text-sm py-2.5">
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
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${tab === key ? 'bg-[#1b2473] text-white' : 'bg-white text-gray-500 border border-gray-200'}`}
          >
            <Icon size={14} /> {key}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {tab === 'announcements' && (
          announcements.length === 0 ? (
            <div className="bg-[#f7f9fc] rounded-xl p-10 text-center text-gray-400">
              <Bell size={40} className="mx-auto mb-3 opacity-30" />
              <p>No announcements yet. Click "Add New" to publish one to students.</p>
            </div>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-[#c49a1a]/10 rounded-xl flex items-center justify-center shrink-0">
                    <Bell size={18} className="text-[#c49a1a]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1a2e]">{a.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{a.body}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-400">
                      <span>Target: {a.target || 'All Students'}</span>
                      <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(a)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#1b2473] transition-colors" title="Edit">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => remove(a.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )
        )}

        {tab === 'news' && (
          <div className="bg-[#f7f9fc] rounded-xl p-10 text-center text-gray-400">
            <Newspaper size={40} className="mx-auto mb-3 opacity-30" />
            <p>News management is coming soon.</p>
          </div>
        )}

        {tab === 'events' && (
          <div className="bg-[#f7f9fc] rounded-xl p-10 text-center text-gray-400">
            <Calendar size={40} className="mx-auto mb-3 opacity-30" />
            <p>Events management is coming soon.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6 capitalize">
              {editingId ? 'Edit Announcement' : `New ${tab.replace('s', '')}`}
            </h3>
            <div className="space-y-4">
              <div><label className="label">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" /></div>
              <div><label className="label">Content</label><textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="input-field" rows={4} /></div>
              {tab === 'announcements' && (
                <div>
                  <label className="label">Target Audience</label>
                  <select value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className="input-field">
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
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                    <option>General</option><option>Admissions</option><option>Academics</option><option>Events</option><option>Ministry</option>
                  </select>
                </div>
              )}
              {tab === 'events' && (
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label">Date</label><input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} type="date" className="input-field" /></div>
                  <div><label className="label">Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="Venue" /></div>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={handlePost} disabled={saving} className="btn-primary flex-1 justify-center">
                {saving ? 'Saving…' : editingId ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
