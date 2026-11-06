// Self-hosted attendance app (public/attendance/), backed by our own NestJS API.
// The API base is passed through so the Firestore shim knows where to send requests.
const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000/api'
const ATTENDANCE_URL = `/attendance/admin.html?api=${encodeURIComponent(API_BASE)}`

export default function AdminAttendance() {
  return (
    <div className="h-[calc(100vh-130px)] bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Self-hosted attendance app (camera allowed for QR sign-in) */}
      <iframe
        src={ATTENDANCE_URL}
        title="AGDNBC Attendance Portal"
        className="w-full h-full border-0"
        allow="camera; fullscreen"
      />
    </div>
  )
}
