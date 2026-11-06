import { ExternalLink } from 'lucide-react'

// Self-hosted attendance app (public/attendance/), backed by our own NestJS API.
// The API base is passed through so the Firestore shim knows where to send requests.
const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000/api'
const ATTENDANCE_URL = `/attendance/admin.html?api=${encodeURIComponent(API_BASE)}`

export default function AdminAttendance() {
  return (
    <div className="flex flex-col h-[calc(100vh-130px)] bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header bar */}
      <div className="bg-[#1b2473] text-white px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold">Attendance Portal</h1>
          <p className="text-blue-200 text-xs">AGDNBC Satellite Campus — Student Attendance</p>
        </div>
        <a
          href={ATTENDANCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg transition-colors"
        >
          <ExternalLink size={13} /> Open in New Tab
        </a>
      </div>

      {/* Self-hosted attendance app (camera allowed for QR sign-in) */}
      <iframe
        src={ATTENDANCE_URL}
        title="AGDNBC Attendance Portal"
        className="flex-1 w-full border-0"
        allow="camera; fullscreen"
      />
    </div>
  )
}
