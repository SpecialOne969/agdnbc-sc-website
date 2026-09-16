import { useState, useEffect, useRef } from 'react'
import { BookOpen, Search, X, Lock, ChevronLeft, ChevronRight, Library } from 'lucide-react'

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

function loadBooks(): Book[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

// ── PDF Reader Modal ───────────────────────────────────────────────────────────
function PdfReader({ book, books, onClose }: { book: Book; books: Book[]; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Keyboard: Escape to close, arrow keys for prev/next
  const [currentIdx, setCurrentIdx] = useState(books.findIndex(b => b.id === book.id))
  const current = books[currentIdx] ?? book

  const goNext = () => setCurrentIdx(i => Math.min(i + 1, books.length - 1))
  const goPrev = () => setCurrentIdx(i => Math.max(i - 1, 0))

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Build viewer URL — wrap in Google Docs Viewer to disable native download toolbar
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(current.pdfUrl)}&embedded=true`

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Reader header */}
      <div className="bg-[#0f3460] text-white px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <BookOpen size={18} className="shrink-0 text-blue-300" />
          <div className="min-w-0">
            <h3 className="font-bold text-sm truncate">{current.title}</h3>
            <p className="text-xs text-blue-300 truncate">{current.section}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* View-only badge */}
          <div className="hidden sm:flex items-center gap-1 text-xs bg-[#e94560]/20 text-[#e94560] border border-[#e94560]/30 px-3 py-1 rounded-full font-semibold">
            <Lock size={10} /> View Only
          </div>

          {/* Prev / Next across same section */}
          {books.length > 1 && (
            <div className="flex items-center gap-1">
              <button onClick={goPrev} disabled={currentIdx === 0} className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-30 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs text-blue-300">{currentIdx + 1}/{books.length}</span>
              <button onClick={goNext} disabled={currentIdx === books.length - 1} className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-30 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors ml-1">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* PDF area */}
      <div
        ref={overlayRef}
        className="flex-1 relative bg-gray-800 select-none"
        onContextMenu={(e) => e.preventDefault()}
      >
        <iframe
          key={current.id}
          src={viewerUrl}
          className="w-full h-full border-0"
          title={current.title}
          sandbox="allow-scripts allow-same-origin allow-popups"
        />

        {/* Invisible overlay — blocks right-click on the iframe edge,
            intentionally thin to preserve scroll in the iframe body */}
        <div
          className="absolute inset-x-0 top-0 h-10 z-10"
          onContextMenu={(e) => e.preventDefault()}
          style={{ pointerEvents: 'auto' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-10 z-10"
          onContextMenu={(e) => e.preventDefault()}
          style={{ pointerEvents: 'auto' }}
        />
      </div>

      {/* Footer bar */}
      <div className="bg-[#1a1a2e] text-gray-400 text-xs px-5 py-2 flex items-center justify-between shrink-0">
        <span className="flex items-center gap-1.5"><Lock size={10} /> This document is protected — downloading is disabled.</span>
        <span className="text-gray-600">AGDNBC Digital Library</span>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function StudentLibrary() {
  const allBooks = loadBooks().filter(b => b.available)
  const [search, setSearch] = useState('')
  const [activeSection, setActiveSection] = useState('All')
  const [reading, setReading] = useState<Book | null>(null)

  const sections = ['All', ...Array.from(new Set(allBooks.map(b => b.section)))]

  const filtered = allBooks.filter(b => {
    const matchSection = activeSection === 'All' || b.section === activeSection
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.section.toLowerCase().includes(search.toLowerCase())
    return matchSection && matchSearch
  })

  // Books passed to reader for prev/next navigation within the same filtered set
  const readerBooks = allBooks.filter(b => activeSection === 'All' || b.section === activeSection)

  if (reading) {
    return <PdfReader book={reading} books={readerBooks} onClose={() => setReading(null)} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0f3460]">Library</h2>
        <p className="text-sm text-gray-500 mt-0.5">Course materials and resources — view only, downloading is disabled.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
          placeholder="Search books or course..."
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Section tabs */}
      {sections.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {sections.map(s => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
                activeSection === s
                  ? 'bg-[#0f3460] text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-[#0f3460] hover:text-[#0f3460]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Book grid */}
      {allBooks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Library size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400">No books have been added to the library yet.</p>
          <p className="text-sm text-gray-300 mt-1">Check back later or contact your instructor.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Search size={32} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400">No books match your search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-[#0f3460]/20 hover:shadow-md transition-all flex flex-col"
            >
              {/* Book icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-[#0f3460] to-[#1a4a8a] rounded-xl flex items-center justify-center mb-4">
                <BookOpen size={22} className="text-white" />
              </div>

              <div className="flex-1">
                <h4 className="font-bold text-[#1a1a2e] mb-1 leading-snug">{book.title}</h4>
                {book.description && (
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">{book.description}</p>
                )}
                <span className="inline-block text-xs font-semibold bg-[#0f3460]/8 text-[#0f3460] px-2 py-0.5 rounded-lg">
                  {book.section}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Lock size={10} /> View only
                </div>
                <button
                  onClick={() => setReading(book)}
                  className="btn-primary text-xs py-2 px-4"
                >
                  <BookOpen size={13} /> Read
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
