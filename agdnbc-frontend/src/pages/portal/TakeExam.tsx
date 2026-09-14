import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, AlertTriangle, ChevronLeft, ChevronRight, Send, CheckCircle, XCircle, Award, BookOpen } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getExam, submitExam } from '../../services/api'

const mockExam = {
  id: '1',
  title: 'Introduction to the Bible – Final Exam',
  duration: 60,
  questions: [
    { id: 'q1', text: 'How many books are in the Old Testament?', type: 'mcq', options: ['39', '27', '66', '50'], correctAnswer: '39' },
    { id: 'q2', text: 'Who wrote the book of Romans?', type: 'mcq', options: ['Peter', 'Paul', 'John', 'Luke'], correctAnswer: 'Paul' },
    { id: 'q3', text: 'What is the first book of the Bible?', type: 'mcq', options: ['Genesis', 'Exodus', 'Leviticus', 'Numbers'], correctAnswer: 'Genesis' },
    { id: 'q4', text: 'Briefly explain the significance of the New Testament in Christian faith.', type: 'essay', options: [], correctAnswer: '' },
    { id: 'q5', text: 'Which of the following is NOT one of the four Gospels?', type: 'mcq', options: ['Matthew', 'Mark', 'Acts', 'John'], correctAnswer: 'Acts' },
  ],
}

function getGrade(pct: number) {
  if (pct >= 75) return { grade: 'A', label: 'Distinction', color: 'text-green-600', bg: 'bg-green-50' }
  if (pct >= 65) return { grade: 'B', label: 'Credit', color: 'text-blue-600', bg: 'bg-blue-50' }
  if (pct >= 55) return { grade: 'C', label: 'Merit', color: 'text-yellow-600', bg: 'bg-yellow-50' }
  if (pct >= 45) return { grade: 'D', label: 'Pass', color: 'text-orange-500', bg: 'bg-orange-50' }
  return { grade: 'F', label: 'Fail', color: 'text-red-600', bg: 'bg-red-50' }
}

export default function TakeExam() {
  const { examId } = useParams<{ examId: string }>()
  const navigate = useNavigate()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(60 * 60)
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<{ score: number; total: number; mcqTotal: number } | null>(null)

  const { data } = useQuery({ queryKey: ['exam', examId], queryFn: () => getExam(examId!), retry: false })
  const exam = data?.data || mockExam
  const questions = exam.questions || []

  const handleSubmit = useCallback(async () => {
    try {
      await submitExam(examId!, answers)
    } catch {
      // Non-fatal — still show results from local calculation
    }

    // Calculate instant results from MCQ answers
    const mcqQuestions = questions.filter((q: typeof questions[0]) => q.type === 'mcq')
    const mcqTotal = mcqQuestions.length
    const score = mcqQuestions.reduce((acc: number, q: typeof questions[0]) => {
      return acc + (answers[q.id] === q.correctAnswer ? 1 : 0)
    }, 0)

    setResults({ score, total: questions.length, mcqTotal })
    setSubmitted(true)
    toast.success('Exam submitted!')
  }, [examId, answers, questions])

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

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    if (!submitted) window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [submitted])

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const secs = (timeLeft % 60).toString().padStart(2, '0')
  const isLow = timeLeft < 300
  const progress = Math.round((Object.keys(answers).length / questions.length) * 100)

  // ── Results Screen ─────────────────────────────────────────
  if (submitted && results) {
    const pct = results.mcqTotal > 0 ? Math.round((results.score / results.mcqTotal) * 100) : 0
    const { grade, label, color, bg } = getGrade(pct)

    return (
      <div className="min-h-screen bg-[#f7f9fc] py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Score card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className={`w-24 h-24 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <span className={`text-4xl font-black ${color}`}>{grade}</span>
            </div>
            <h2 className="text-2xl font-bold text-[#0f3460] mb-1">Exam Submitted!</h2>
            <p className="text-gray-500 text-sm mb-6">{exam.title}</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-[#f7f9fc] rounded-xl p-4">
                <div className="text-3xl font-black text-[#0f3460]">{results.score}<span className="text-lg text-gray-400">/{results.mcqTotal}</span></div>
                <div className="text-xs text-gray-500 mt-1">MCQ Score</div>
              </div>
              <div className="bg-[#f7f9fc] rounded-xl p-4">
                <div className={`text-3xl font-black ${color}`}>{pct}%</div>
                <div className="text-xs text-gray-500 mt-1">Percentage</div>
              </div>
              <div className={`${bg} rounded-xl p-4`}>
                <div className={`text-3xl font-black ${color}`}>{grade}</div>
                <div className={`text-xs mt-1 ${color}`}>{label}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-center text-xs text-amber-600 bg-amber-50 rounded-xl px-4 py-2.5">
              <BookOpen size={13} />
              {results.total - results.mcqTotal} essay question{results.total - results.mcqTotal !== 1 ? 's' : ''} will be graded by your instructor separately.
            </div>
          </div>

          {/* Per-question breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-[#0f3460] mb-4 flex items-center gap-2">
              <Award size={18} /> Question Review
            </h3>
            <div className="space-y-3">
              {questions.map((q: typeof questions[0], i: number) => {
                const studentAnswer = answers[q.id] || ''
                const isCorrect = q.type === 'mcq' && studentAnswer === q.correctAnswer
                const isWrong = q.type === 'mcq' && studentAnswer && studentAnswer !== q.correctAnswer
                const noAnswer = !studentAnswer

                return (
                  <div key={q.id} className={`rounded-xl p-4 border ${
                    q.type === 'essay' ? 'border-gray-100 bg-gray-50' :
                    isCorrect ? 'border-green-200 bg-green-50' :
                    isWrong ? 'border-red-200 bg-red-50' :
                    'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      {q.type === 'essay' ? (
                        <BookOpen size={16} className="text-gray-400 shrink-0 mt-0.5" />
                      ) : isCorrect ? (
                        <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1a1a2e] mb-1">
                          <span className="text-gray-400">Q{i + 1}.</span> {q.text}
                        </p>
                        {q.type === 'mcq' ? (
                          <div className="text-xs space-y-0.5">
                            {noAnswer ? (
                              <span className="text-gray-400 italic">Not answered</span>
                            ) : (
                              <>
                                <span className={`block ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                                  Your answer: <strong>{studentAnswer}</strong>
                                </span>
                                {!isCorrect && (
                                  <span className="block text-green-700">
                                    Correct answer: <strong>{q.correctAnswer}</strong>
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">Pending instructor review</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button onClick={() => navigate('/portal/exams')} className="btn-primary w-full justify-center py-3.5">
            Back to Exams
          </button>
        </div>
      </div>
    )
  }

  // ── Exam Taking View ───────────────────────────────────────
  const q = questions[currentQ]

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
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

        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentQ((p) => Math.max(0, p - 1))} disabled={currentQ === 0} className="btn-outline disabled:opacity-40">
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
