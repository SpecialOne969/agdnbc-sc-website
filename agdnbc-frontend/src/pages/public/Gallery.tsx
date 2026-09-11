import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react'

import img1 from '../../assets/Images/IMG_3782.jpg'
import img2 from '../../assets/Images/IMG_3783.jpg'
import img3 from '../../assets/Images/IMG_3791.jpg'
import img4 from '../../assets/Images/IMG_3798.jpg'
import img5 from '../../assets/Images/IMG_3804.jpg'
import img6 from '../../assets/Images/_EWC0214.jpg'
import img7 from '../../assets/Images/_EWC0225.jpg'
import img8 from '../../assets/Images/_EWC0240.jpg'
import img9 from '../../assets/Images/_EWC0263.jpg'
import img10 from '../../assets/Images/_EWC0270.jpg'
import img11 from '../../assets/Images/_EWC0276.jpg'

const photos = [
  { src: img8, caption: 'Graduation Ceremony', desc: 'Graduating students take their oaths on stage' },
  { src: img9, caption: 'Class Group Photo', desc: 'The graduating class with faculty and dignitaries' },
  { src: img11, caption: 'Class of 2025', desc: 'A milestone celebration at AGDNBC Satellite Campus' },
  { src: img2, caption: 'The Mace Bearer', desc: 'Leading the convocation procession with honour' },
  { src: img1, caption: 'Convocation Procession', desc: 'Graduates march into the ceremony in academic regalia' },
  { src: img5, caption: 'Graduating Class', desc: 'Students in their blue and gold academic gowns' },
  { src: img3, caption: 'Academic Leadership', desc: 'Senior faculty at the convocation ceremony' },
  { src: img6, caption: 'Distinguished Faculty', desc: 'Faculty members in academic regalia' },
  { src: img4, caption: 'Faculty Procession', desc: 'Academic staff leading the ceremonial procession' },
  { src: img7, caption: 'Convocation Highlights', desc: 'Memorable moments from the graduation ceremony' },
  { src: img10, caption: 'Ceremony Moments', desc: 'Celebrating academic achievement at AGDNBC' },
]

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const prev = () => setLightbox((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null))
  const next = () => setLightbox((i) => (i !== null ? (i + 1) % photos.length : null))

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
    if (e.key === 'Escape') setLightbox(null)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f3460] to-[#16213e] text-white py-24 px-4 text-center">
        <p className="section-subtitle text-[#e94560]">Life at AGDNBC</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Photo Gallery</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Moments of faith, excellence, and celebration from the Apostle Geoffrey Dabibi Numbere Bible College, Satellite Campus.
        </p>
      </section>

      {/* Event Label */}
      <section className="bg-white border-b border-gray-100 py-5 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Images size={20} className="text-[#e94560]" />
          <span className="font-bold text-[#0f3460]">Convocation Ceremony</span>
          <span className="text-gray-400 text-sm">· Class of 2025 · {photos.length} photos</span>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-[#f7f9fc]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {photos.map((photo, i) => (
              <div
                key={i}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl shadow-sm"
                onClick={() => setLightbox(i)}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <p className="text-white font-bold text-sm">{photo.caption}</p>
                    <p className="text-white/70 text-xs mt-0.5">{photo.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          onKeyDown={handleKey}
          tabIndex={0}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-2"
            onClick={() => setLightbox(null)}
          >
            <X size={22} />
          </button>

          {/* Prev */}
          <button
            className="absolute left-4 text-white/70 hover:text-white bg-white/10 rounded-full p-3"
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Image */}
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[lightbox].src}
              alt={photos[lightbox].caption}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <div className="text-center mt-4">
              <p className="text-white font-bold">{photos[lightbox].caption}</p>
              <p className="text-white/60 text-sm mt-1">{photos[lightbox].desc}</p>
              <p className="text-white/40 text-xs mt-2">{lightbox + 1} / {photos.length}</p>
            </div>
          </div>

          {/* Next */}
          <button
            className="absolute right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-3"
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  )
}
