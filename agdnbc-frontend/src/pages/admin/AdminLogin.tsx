import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { adminLogin } from '../../services/api'
import { useAuthStore } from '../../store/authStore'

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password required'),
})
type FormData = z.infer<typeof schema>

export default function AdminLogin() {
  const [showPwd, setShowPwd] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await adminLogin(data.email, data.password)
      setAuth(res.data.user, res.data.token)
      navigate('/admin/dashboard')
    } catch {
      toast.error('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#e94560] rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-400 text-sm">AGDNBC Control Panel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label"><Mail size={14} className="inline mr-1" /> Admin Email</label>
              <input {...register('email')} type="email" className="input-field" placeholder="admin@agdnbcsc.edu.ng" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label"><Lock size={14} className="inline mr-1" /> Password</label>
              <div className="relative">
                <input {...register('password')} type={showPwd ? 'text' : 'password'} className="input-field pr-12" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-accent w-full justify-center py-3.5">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="text-center mt-5">
            <Link to="/" className="text-xs text-gray-400 hover:text-[#0f3460]">← Back to Website</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
