import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Hash, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { studentLogin } from '../../services/api'
import { useAuthStore } from '../../store/authStore'

const schema = z.object({
  schoolId: z.string().min(3, 'School ID is required'),
  password: z.string().length(8, 'Password must be exactly 8 characters'),
})
type FormData = z.infer<typeof schema>

export default function StudentLogin() {
  const [showPwd, setShowPwd] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await studentLogin(data.schoolId, data.password)
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
          {/* Portal access notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-700">
              <strong>Portal Access:</strong> Portal access is included in your school fees (₦105,000 – Year 1 /
              ₦155,000 – Year 2). Ensure your fees are paid to retain full access.
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label flex items-center gap-2">
                <Hash size={14} /> School ID Number
              </label>
              <input
                {...register('schoolId')}
                className="input-field font-mono tracking-wider"
                placeholder="e.g. AGDNBC/2024/001"
                autoComplete="username"
              />
              {errors.schoolId && <p className="text-red-500 text-xs mt-1">{errors.schoolId.message}</p>}
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <Lock size={14} /> Password (8 characters)
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center py-3.5 text-base"
            >
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

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-[#0f3460]">
            ← Back to College Website
          </Link>
        </div>
      </div>
    </div>
  )
}
