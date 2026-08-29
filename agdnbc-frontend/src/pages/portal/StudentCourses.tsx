import { useQuery } from '@tanstack/react-query'
import { BookOpen, Clock, User } from 'lucide-react'
import { getMyCourses } from '../../services/api'

const mockCourses = [
  { id: '1', code: 'TH101', name: 'Introduction to the Bible', lecturer: 'Rev. Dr. A. Numbere', credit: 3, semester: '1st Semester', status: 'Active' },
  { id: '2', code: 'TH102', name: 'Old Testament Survey', lecturer: 'Rev. D. Adeyemi', credit: 3, semester: '1st Semester', status: 'Active' },
  { id: '3', code: 'TH103', name: 'New Testament Survey', lecturer: 'Pastor B. Okafor', credit: 3, semester: '1st Semester', status: 'Active' },
  { id: '4', code: 'TH104', name: 'Christian Doctrine', lecturer: 'Pastor E. Johnson', credit: 2, semester: '1st Semester', status: 'Active' },
  { id: '5', code: 'TH105', name: 'Church History', lecturer: 'Rev. G. Peters', credit: 2, semester: '1st Semester', status: 'Active' },
  { id: '6', code: 'TH106', name: 'Homiletics', lecturer: 'Rev. D. Adeyemi', credit: 3, semester: '2nd Semester', status: 'Upcoming' },
]

export default function StudentCourses() {
  const { data, isLoading } = useQuery({ queryKey: ['my-courses'], queryFn: getMyCourses })
  const courses = data?.data?.length ? data.data : mockCourses

  const semesters = [...new Set(courses.map((c: typeof mockCourses[0]) => c.semester))]

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading courses...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0f3460]">My Registered Courses</h2>
        <span className="text-sm text-gray-500">{courses.length} courses · 2025/2026 Session</span>
      </div>

      {semesters.map((sem) => (
        <div key={sem as string}>
          <h3 className="font-semibold text-[#e94560] text-sm uppercase tracking-wider mb-3">{sem as string}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {courses
              .filter((c: typeof mockCourses[0]) => c.semester === sem)
              .map((course: typeof mockCourses[0]) => (
                <div key={course.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#0f3460]/10 rounded-xl flex items-center justify-center">
                        <BookOpen size={18} className="text-[#0f3460]" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#e94560]">{course.code}</span>
                        <h4 className="font-bold text-[#0f3460] text-sm">{course.name}</h4>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      course.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><User size={11} /> {course.lecturer}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {course.credit} Credits</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      <div className="bg-[#f7f9fc] rounded-xl p-4 flex items-center justify-between">
        <span className="text-sm text-gray-600">Total Credit Units</span>
        <span className="font-bold text-[#0f3460] text-lg">
          {courses.reduce((sum: number, c: typeof mockCourses[0]) => sum + c.credit, 0)} Units
        </span>
      </div>
    </div>
  )
}
