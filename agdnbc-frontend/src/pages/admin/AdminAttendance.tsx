import { ExternalLink } from 'lucide-react'

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
          href="https://bibleschool-attendance.web.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg transition-colors"
        >
          <ExternalLink size={13} /> Open in New Tab
        </a>
      </div>

      {/* Iframe */}
      <iframe
        src="https://bibleschool-attendance.web.app"
        title="AGDNBC Attendance Portal"
        className="flex-1 w-full border-0"
        allow="fullscreen"
      />
    </div>
  )
}
