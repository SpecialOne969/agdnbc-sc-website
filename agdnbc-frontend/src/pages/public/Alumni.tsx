import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Users, Heart, Briefcase, Calendar, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitAlumniRegistration } from '../../services/api'

const schema = z.object({
  fullName: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Phone required'),
  graduationYear: z.string().min(4, 'Year required'),
  programme: z.string().min(1, 'Programme required'),
  occupation: z.string().min(2, 'Occupation required'),
  location: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function Alumni() {
  const [done, setDone] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await submitAlumniRegistration(data)
      setDone(true)
      toast.success('Registration successful!')
    } catch {
      toast.error('Registration failed. Try again.')
    }
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-[#0f3460] to-[#16213e] text-white py-24 px-4 text-center">
        <p className="section-subtitle text-[#e94560]">Our Community</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Alumni Community</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Stay connected with the AGDNBC family. Our alumni are making Kingdom impact across Nigeria and beyond.
        </p>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subtitle">Why Join</p>
            <h2 className="section-title">Benefits of the Alumni Network</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'Community', desc: 'Stay connected with fellow graduates from across the nation.' },
              { icon: Heart, title: 'Mentorship', desc: 'Mentor upcoming students or find a mentor for your ministry journey.' },
              { icon: Briefcase, title: 'Partnerships', desc: 'Collaborate on Kingdom projects and ministry opportunities.' },
              { icon: Calendar, title: 'Events', desc: 'Join exclusive alumni events, reunions, and leadership summits.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 text-center">
                <div className="w-12 h-12 bg-[#e94560]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-[#e94560]" />
                </div>
                <h4 className="font-bold text-[#0f3460] mb-2">{title}</h4>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="py-20 bg-[#f7f9fc]">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="section-subtitle">Join Today</p>
            <h2 className="section-title">Register as an Alumnus</h2>
          </div>
          {done ? (
            <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-[#0f3460] mb-2">Welcome to the Alumni Network!</h3>
              <p className="text-sm text-gray-500">Your registration has been received. We'll reach out with your alumni membership details soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input {...register('fullName')} className="input-field" placeholder="Your full name" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="label">Email</label>
                  <input {...register('email')} type="email" className="input-field" placeholder="you@email.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone</label>
                  <input {...register('phone')} className="input-field" placeholder="08XXXXXXXXX" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="label">Graduation Year</label>
                  <input {...register('graduationYear')} className="input-field" placeholder="e.g. 2023" />
                  {errors.graduationYear && <p className="text-red-500 text-xs mt-1">{errors.graduationYear.message}</p>}
                </div>
              </div>
              <div>
                <label className="label">Programme Completed</label>
                <select {...register('programme')} className="input-field">
                  <option value="">Select programme</option>
                  <option>Certificate in Theology</option>
                  <option>Diploma in Biblical Studies</option>
                  <option>Christian Ministry & Leadership</option>
                  <option>Mission & Evangelism</option>
                </select>
                {errors.programme && <p className="text-red-500 text-xs mt-1">{errors.programme.message}</p>}
              </div>
              <div>
                <label className="label">Current Occupation / Ministry</label>
                <input {...register('occupation')} className="input-field" placeholder="Pastor, Teacher, Missionary..." />
                {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation.message}</p>}
              </div>
              <div>
                <label className="label">Location (Optional)</label>
                <input {...register('location')} className="input-field" placeholder="City, State" />
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3.5">
                {isSubmitting ? 'Registering...' : 'Register as Alumnus'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
