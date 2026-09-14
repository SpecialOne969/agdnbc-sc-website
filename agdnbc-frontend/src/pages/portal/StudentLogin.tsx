import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, AlertCircle, MapPin } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { studentLogin } from '../../services/api'
import { useAuthStore } from '../../store/authStore'

// New ID format: AGDNBCSC/YYYY/NNNCC  (e.g. AGDNBCSC/2024/001PH)
const DEMO_ID = 'AGDNBCSC/2024/001PH'
const DEMO_PWD = '0987654'

const schema = z.object({
  password: z.string().min(6, 'Minimum 6 characters').max(8, 'Maximum 8 characters'),
})
type FormData = z.infer<typeof schema>

const campusLabels: Record<string, string> = {
  BY: 'Yenagoa, Bayelsa',
  PH: 'Port Harcourt',
}

export default function StudentLogin() {
  const [showPwd, setShowPwd] = useState(false)
  const [idYear, setIdYear] = useState('2024')
  const [idSuffix, setIdSuffix] = useState('')
  const [idError, setIdError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const fullId = `AGDNBCSC/${idYear}/${idSuffix.toUpperCase()}`
  const campusCode = idSuffix.slice(-2).toUpperCase()
  const campusName = campusLabels[campusCode] || ''

  const onSubmit = async (data: FormData) => {
    // Validate suffix format: 3 digits + BY or PH
    const suffixRegex = /^\d{3}(BY|PH)$/i
    if (!idSuffix.trim() || !suffixRegex.test(idSuffix.trim())) {
      setIdError('Enter your number + campus code, e.g. 001BY or 001PH')
      return
    }
    setIdError('')

    const schoolId = fullId

    // Demo bypass
    if (schoolId === DEMO_ID && data.password === DEMO_PWD) {
      setAuth(
        {
          id: 'demo-001',
          schoolId: DEMO_ID,
          name: 'Demo Student',
          role: 'student',
          portalAccessValid: true,
          level: 'Year 1',
          programme: 'Diploma in Biblical Studies',
        },
        'demo-token',
      )
      navigate('/portal/dashboard')
      return
    }

    try {
      const res = await studentLogin(schoolId, data.password)
      setAuth(res.data.user, res.data.token)
      navigate('/portal/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Invalid credentials'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-[#0f3460] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">AG</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-[#0f3460]">AGDNBC</div>
              <div className="text-xs text-[#e94560]">Student Portal</div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#0f3460] mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Sign in to access your student dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-700">
              <strong>Portal Access</strong> is included in your school fees (₦105,000 – Year 1 / ₦155,000 – Year 2). Ensure your fees are paid to retain full access.
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Split School ID input */}
            <div>
              <label className="label">School ID Number</label>

              {/* Unified input bar */}
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-[#0f3460] focus-within:ring-2 focus-within:ring-[#0f3460]/10 transition-all">
                <span className="bg-gray-100 text-gray-500 text-sm font-mono px-3 py-3 border-r border-gray-200 shrink-0 whitespace-nowrap select-none">
                  AGDNBCSC/
                </span>
                <select
                  value={idYear}
                  onChange={(e) => setIdYear(e.target.value)}
                  className="text-sm font-mono font-semibold text-[#0f3460] px-2 py-3 border-r border-gray-200 bg-white focus:outline-none shrink-0"
                  style={{ width: '84px' }}
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
                <span className="text-gray-400 font-mono text-sm px-2 border-r border-gray-200 py-3 shrink-0 select-none">/</span>
                <input
                  value={idSuffix}
                  onChange={(e) => { setIdSuffix(e.target.value.toUpperCase()); setIdError('') }}
                  className="flex-1 min-w-0 text-sm font-mono tracking-widest uppercase px-3 py-3 bg-white focus:outline-none placeholder:text-gray-300"
                  placeholder="001PH"
                  maxLength={5}
                  autoComplete="username"
                />
                {campusName && (
                  <span className="text-xs text-[#e94560] font-semibold px-3 shrink-0 flex items-center gap-1 whitespace-nowrap">
                    <MapPin size={10} /> {campusName}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-1.5">
                Enter your 3-digit number + campus code: <span className="font-mono font-medium">BY</span> (Yenagoa) or <span className="font-mono font-medium">PH</span> (Port Harcourt)
              </p>
              <p className="text-xs text-gray-400">
                Full ID: <span className="font-mono font-semibold text-[#0f3460]">{fullId}</span>
              </p>
              {idError && <p className="text-red-500 text-xs mt-1">{idError}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label flex items-center gap-2">
                <Lock size={14} /> Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPwd ? 'text' : 'password'}
                  className="input-field pr-12 font-mono tracking-widest"
                  placeholder="••••••••"
                  maxLength={8}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3.5 text-base">
              {isSubmitting ? 'Signing in...' : 'Sign In to Portal'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Forgot your password or School ID?{' '}
              <Link to="/contact" className="text-[#e94560] font-semibold hover:underline">
                Contact the Registrar
              </Link>
            </p>
          </div>
        </div>

        {/* Demo hint */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4 text-xs text-blue-700">
          <p className="font-bold mb-1">Demo Access</p>
          <p>Year: <span className="font-mono font-semibold">2024</span> &nbsp;·&nbsp; Number: <span className="font-mono font-semibold">001PH</span></p>
          <p>Password: <span className="font-mono font-semibold">0987654</span></p>
          <p className="mt-1 text-blue-500">Full ID: <span className="font-mono font-semibold">AGDNBCSC/2024/001PH</span></p>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-400 hover:text-[#0f3460]">
            ← Back to College Website
          </Link>
        </div>
      </div>
    </div>
  )
}
