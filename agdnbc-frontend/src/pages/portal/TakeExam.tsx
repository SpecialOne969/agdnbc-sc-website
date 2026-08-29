import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, AlertTriangle, ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getExam, submitExam } from '../../services/api'

const mockExam = {
  id: '1',
  title: 'Introduction to the Bible – Final Exam',
  duration: 60,
  questions: [
    { id: 'q1', text: 'How many books are in the Old Testament?', type: 'mcq', options: ['39', '27', '66', '50'], answer: '' },
    { id: 'q2', text: 'Who wrote the book of Romans?', type: 'mcq', options: ['Peter', 'Paul', 'John', 'Luke'], answer: '' },
    { id: 'q3', text: 'What is the first book of the Bible?', type: 'mcq', options: ['Genesis', 'Exodus', 'Leviticus', 'Numbers'], answer: '' },
    { id: 'q4', text: 'Briefly explain the significance of the New Testament in Christian faith.', type: 'essay', options: [], answer: '' },
    { id: 'q5', text: 'Which of the following is NOT one of the four Gospels?', type: 'mcq', options: ['Matthew', 'Mark', 'Acts', 'John'], answer: '' },
  ],
}

export default function TakeExam() {
  const { examId } = useParams<{ examId: string }>()
  const navigate = useNavigate()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(60 * 60)
  const [submitted, setSubmitted] = useState(false)

  const { data } = useQuery({ queryKey: ['exam', examId], queryFn: () => getExam(examId!), retry: false })
  const exam = data?.data || mockExam
  const questions = exam.questions || []

  const handleSubmit = useCallback(async () => {
    try {
      await submitExam(examId!, answers)
      setSubmitted(true)
      toast.success('Exam submitted successfully!')
    } catch {
      toast.error('Submission failed. Please try again.')
    }
  }, [examId, answers])

  useEffect(() => {
    if (submitted) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); handleSubmit(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [submitted, handleSubmit])

  // Prevent leaving
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    if (!submitted) window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [submitted])

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const secs = (timeLeft % 60).toString().padStart(2, '0')
  const isLow = timeLeft < 300
  const progress = Math.round((Object.keys(answers).length / questions.length) * 100)

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#0f3460] mb-3">Exam Submitted!</h2>
          <p className="text-gray-500 mb-8">Your answers have been recorded. Results will be available after grading.</p>
          <button onClick={() => navigate('/portal/exams')} className="btn-primary">
            Back to Exams
          </button>
        </div>
      </div>
    )
  }

  const q = questions[currentQ]

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Exam header */}
      <header className="bg-[#0f3460] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="font-bold">{exam.title}</h1>
          <p className="text-blue-300 text-xs">{questions.length} Questions</p>
        </div>
        <div className={`flex items-center gap-2 font-mono text-2xl font-bold px-5 py-2 rounded-xl ${isLow ? 'bg-[#e94560] animate-pulse' : 'bg-white/20'}`}>
          <Clock size={20} /> {mins}:{secs}
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Progress */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {Object.keys(answers).length}/{questions.length} answered</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-[#e94560] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex gap-2 flex-wrap mt-3">
            {questions.map((_: unknown, i: number) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  i === currentQ ? 'bg-[#0f3460] text-white' :
                  answers[questions[i]?.id] ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question */}
        {q && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {isLow && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2 text-red-600 text-sm">
                <AlertTriangle size={16} /> Less than 5 minutes remaining!
              </div>
            )}
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 bg-[#0f3460] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                {currentQ + 1}
              </span>
              <p className="font-semibold text-[#0f3460] text-base leading-relaxed">{q.text}</p>
            </div>

            {q.type === 'mcq' ? (
              <div className="space-y-3">
                {q.options.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                    className={`w-full text-left px-5 py-3.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      answers[q.id] === opt
                        ? 'border-[#0f3460] bg-[#0f3460]/5 text-[#0f3460]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                className="input-field min-h-[150px]"
                placeholder="Write your answer here..."
                value={answers[q.id] || ''}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
              />
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
            disabled={currentQ === 0}
            className="btn-outline disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          {currentQ < questions.length - 1 ? (
            <button onClick={() => setCurrentQ((p) => p + 1)} className="btn-primary">
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => {
                const unanswered = questions.length - Object.keys(answers).length
                if (unanswered > 0 && !confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return
                handleSubmit()
              }}
              className="btn-accent"
            >
              <Send size={16} /> Submit Exam
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
