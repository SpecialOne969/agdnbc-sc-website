import { useQuery } from '@tanstack/react-query'
import { Download, Printer, FileText, TrendingUp } from 'lucide-react'
import { getMyResults } from '../../services/api'

const mockResults = [
  { id: '1', semester: '1st Semester 2024/2025', courses: [
    { code: 'TH101', name: 'Introduction to the Bible', score: 82, grade: 'A', status: 'Pass' },
    { code: 'TH102', name: 'Old Testament Survey', score: 76, grade: 'B', status: 'Pass' },
    { code: 'TH103', name: 'New Testament Survey', score: 88, grade: 'A', status: 'Pass' },
    { code: 'TH104', name: 'Christian Doctrine', score: 71, grade: 'B', status: 'Pass' },
    { code: 'TH105', name: 'Church History', score: 65, grade: 'C', status: 'Pass' },
  ]},
]

const gradeColor: Record<string, string> = {
  A: 'text-green-700 bg-green-100',
  B: 'text-blue-700 bg-blue-100',
  C: 'text-yellow-700 bg-yellow-100',
  D: 'text-orange-700 bg-orange-100',
  F: 'text-red-700 bg-red-100',
}

function calcGPA(courses: typeof mockResults[0]['courses']) {
  const gradePoints: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, F: 0 }
  const total = courses.reduce((sum, c) => sum + (gradePoints[c.grade] || 0), 0)
  return (total / courses.length).toFixed(2)
}

export default function StudentResults() {
  const { data, isLoading } = useQuery({ queryKey: ['my-results'], queryFn: getMyResults })
  const results = data?.data?.length ? data.data : mockResults

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading results...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0f3460]">Examination Results</h2>
      </div>

      {results.map((semester: typeof mockResults[0]) => {
        const gpa = calcGPA(semester.courses)
        return (
          <div key={semester.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#0f3460] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={18} />
                <h3 className="font-bold">{semester.semester}</h3>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg flex items-center gap-1"
                >
                  <Printer size={12} /> Print
                </button>
                <button className="text-xs bg-[#e94560] hover:bg-[#c73550] px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Download size={12} /> Download PDF
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f7f9fc] text-xs text-gray-500 uppercase tracking-wider">
                    <th className="text-left px-6 py-3">Code</th>
                    <th className="text-left px-6 py-3">Course Name</th>
                    <th className="text-center px-6 py-3">Score</th>
                    <th className="text-center px-6 py-3">Grade</th>
                    <th className="text-center px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {semester.courses.map((course) => (
                    <tr key={course.code} className="border-b border-gray-50 hover:bg-[#f7f9fc] transition-colors">
                      <td className="px-6 py-4 font-mono text-sm font-semibold text-[#0f3460]">{course.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{course.name}</td>
                      <td className="px-6 py-4 text-center font-bold text-[#0f3460]">{course.score}%</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${gradeColor[course.grade]}`}>
                          {course.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-xs font-semibold ${course.status === 'Pass' ? 'text-green-600' : 'text-red-500'}`}>
                          {course.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-[#f7f9fc] flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp size={16} className="text-[#e94560]" /> Semester GPA
              </div>
              <span className="text-xl font-extrabold text-[#0f3460]">{gpa} / 5.0</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
