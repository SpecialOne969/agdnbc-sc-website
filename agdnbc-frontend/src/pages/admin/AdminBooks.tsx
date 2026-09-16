import { useState, useEffect } from 'react'
import { BookOpen, Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, Library } from 'lucide-react'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'agdnbc-library-books'

interface Book {
  id: string
  title: string
  description: string
  section: string
  pdfUrl: string
  available: boolean
  addedAt: string
}

const sections = [
  'General Resources',
  // Year 1
  'SPF101 – Spiritual Formation',
  'ESM102 – Essentials of Supportive Ministry',
  'HMT103 – Hermeneutics',
  'PPS104 – Prayer Principles',
  'ECC105 – Ecclesiology',
  'MSG106 – Missiology',
  'BLG107 – Bible Language (Greek)',
  'PTM108 – Practical Theology of Ministry',
  'BLH109 – Bible Language (Hebrew)',
  'MNE110 – Ministerial Ethics/Etiquettes',
  'BBF111 – Biblical Faith',
  'CAL112 – Church Admin/Leadership',
  'FMM113 – Family, Marriage, and Ministry',
  'FOG114 – Fundamentals of GEWC',
  'KDH115 – Kingdom Honour',
  // Year 2
  'PNM201 – Pneumatology',
  'RMG202 – Research Methodology',
  'WRS203 – World Religions',
  'STG204 – Systematic Theology',
  'APG205 – Apologetics',
  'CHT206 – Church History',
  'HML207 – Homiletics',
  'OTL208 – Old Testament Literature',
  'NTL209 – New Testament Literature',
  'APE210 – Apocalypse/Eschatology',
  'ECP211 – Essentials of Christian Perfection',
  'CHC212 – Christian Counselling',
  'IRM213 – Itinerant Ministry',
  'TYM214 – Teens/Youth Ministry',
  'WSM215 – Worship Ministry',
  'PJM216 – Project Management',
  'PNP217 – Pioneering Principles',
  'EFM218 – Excellence in Facilities and Management',
]

const blank: Omit<Book, 'id' | 'addedAt'> = {
  title: '', description: '', section: 'General Resources', pdfUrl: '', available: true,
}

function loadBooks(): Book[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

function saveBooks(books: Book[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
}

export default function AdminBooks() {
  const [books, setBooks] = useState<Book[]>(loadBooks)
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [form, setForm] = useState(blank)
  const [filterSection, setFilterSection] = useState('All')

  useEffect(() => { saveBooks(books) }, [books])

  const openCreate = () => { setEditingBook(null); setForm(blank); setShowModal(true) }

  const openEdit = (b: Book) => {
    setEditingBook(b)
    setForm({ title: b.title, description: b.description, section: b.section, pdfUrl: b.pdfUrl, available: b.available })
    setShowModal(true)
  }

  const save = () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (!form.pdfUrl.trim()) { toast.error('PDF URL is required'); return }
    if (editingBook) {
      const updated = books.map(b => b.id === editingBook.id ? { ...editingBook, ...form } : b)
      setBooks(updated)
      toast.success('Book updated!')
    } else {
      const book: Book = { id: Date.now().toString(), ...form, addedAt: new Date().toISOString() }
      setBooks([book, ...books])
      toast.success('Book added to library!')
    }
    setShowModal(false)
  }

  const remove = (id: string) => {
    if (!confirm('Remove this book from the library?')) return
    setBooks(books.filter(b => b.id !== id))
    toast.success('Book removed')
  }

  const toggle = (id: string) => {
    setBooks(books.map(b => b.id === id ? { ...b, available: !b.available } : b))
  }

  const uniqueSections = ['All', ...Array.from(new Set(books.map(b => b.section)))]
  const filtered = filterSection === 'All' ? books : books.filter(b => b.section === filterSection)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#1a1a2e]">Library Management</h2>
        <button onClick={openCreate} className="btn-accent text-sm py-2.5">
          <Plus size={16} /> Add Book
        </button>
      </div>

      {/* Section filter */}
      {books.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {uniqueSections.map(s => (
            <button
              key={s}
              onClick={() => setFilterSection(s)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                filterSection === s ? 'bg-[#0f3460] text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-[#0f3460]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Books', value: books.length },
          { label: 'Available', value: books.filter(b => b.available).length },
          { label: 'Hidden', value: books.filter(b => !b.available).length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-[#0f3460]">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Book list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <Library size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 mb-4">
            {books.length === 0 ? 'No books yet. Add your first PDF to the library.' : 'No books in this section.'}
          </p>
          {books.length === 0 && (
            <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add First Book</button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f7f9fc] text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-6 py-3">Book</th>
                <th className="text-left px-6 py-3">Section</th>
                <th className="text-center px-6 py-3">Available</th>
                <th className="text-center px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((book) => (
                <tr key={book.id} className="border-b border-gray-50 hover:bg-[#f7f9fc] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#0f3460]/10 rounded-lg flex items-center justify-center shrink-0">
                        <BookOpen size={16} className="text-[#0f3460]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#1a1a2e] text-sm">{book.title}</div>
                        {book.description && (
                          <div className="text-xs text-gray-400 truncate max-w-[280px]">{book.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold bg-[#0f3460]/10 text-[#0f3460] px-2 py-1 rounded-lg">
                      {book.section}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* Toggle switch */}
                    <button
                      onClick={() => toggle(book.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        book.available ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        book.available ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                    <div className={`text-xs mt-1 font-medium ${book.available ? 'text-green-600' : 'text-gray-400'}`}>
                      {book.available ? 'Visible' : 'Hidden'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={book.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0f3460] transition-colors"
                        title="Preview PDF"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => toggle(book.id)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0f3460] transition-colors"
                        title={book.available ? 'Hide from students' : 'Show to students'}
                      >
                        {book.available ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button onClick={() => openEdit(book)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0f3460] transition-colors">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => remove(book.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1a1a2e] flex items-center gap-2">
                <BookOpen size={18} className="text-[#0f3460]" />
                {editingBook ? 'Edit Book' : 'Add Book to Library'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Book Title <span className="text-red-500">*</span></label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. Introduction to Biblical Hermeneutics" />
              </div>
              <div>
                <label className="label">Description <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} placeholder="Brief description of the book..." />
              </div>
              <div>
                <label className="label">Section / Course</label>
                <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className="input-field">
                  {sections.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">PDF URL <span className="text-red-500">*</span></label>
                <input
                  value={form.pdfUrl}
                  onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
                  className="input-field font-mono text-sm"
                  placeholder="https://example.com/book.pdf"
                  type="url"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Use a publicly accessible PDF URL (Google Drive, Dropbox, etc.). Students will read it in a protected viewer — downloading is disabled.
                </p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#f7f9fc] rounded-xl">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, available: !form.available })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.available ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${form.available ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <div>
                  <div className="text-sm font-semibold text-[#1a1a2e]">Make available to students</div>
                  <div className="text-xs text-gray-400">Students can only see and read available books</div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={save} className="btn-primary flex-1 justify-center">
                {editingBook ? 'Update Book' : 'Add to Library'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
