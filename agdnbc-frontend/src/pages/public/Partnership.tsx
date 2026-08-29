import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Heart, Users, BookOpen, Globe, CheckCircle, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitPartnershipForm } from '../../services/api'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  organisation: z.string().optional(),
  partnershipType: z.string().min(1, 'Please select a type'),
  intendedAmount: z.string().optional(),
  message: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const bankDetails = [
  { bank: 'First Bank Nigeria', accountName: 'AGDNBC Satellite Campus', accountNumber: '0000000000' },
  { bank: 'Zenith Bank', accountName: 'AGDNBC Satellite Campus', accountNumber: '0000000000' },
]

export default function Partnership() {
  const [done, setDone] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const onSubmit = async (data: FormData) => {
    try {
      await submitPartnershipForm(data)
      setDone(true)
      toast.success('Partnership form submitted!')
    } catch {
      toast.error('Submission failed. Please try again.')
    }
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-[#0f3460] to-[#16213e] text-white py-24 px-4 text-center">
        <p className="section-subtitle text-[#e94560]">Support the Vision</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Financial Partnership</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Partner with us in raising godly ministers for the harvest. Your investment is an investment in eternity.
        </p>
      </section>

      {/* Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-subtitle">The Vision</p>
              <h2 className="section-title">Why Partner With Us?</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                AGDNBC exists to raise Kingdom ambassadors who will transform Nigeria and the nations. Your
                partnership makes quality biblical education accessible to students who cannot afford the full cost.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Every naira given goes directly toward scholarships, faculty development, facility improvement,
                and expanding our reach to more campuses.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BookOpen, label: 'Student Scholarships' },
                  { icon: Users, label: 'Faculty Development' },
                  { icon: Globe, label: 'Campus Expansion' },
                  { icon: Heart, label: 'Ministry Support' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-8 h-8 bg-[#e94560]/10 rounded-lg flex items-center justify-center">
                      <Icon size={14} className="text-[#e94560]" />
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-[#0f3460] text-white rounded-2xl p-6">
                <h4 className="font-bold mb-4 text-[#e94560]">Partnership Account Details</h4>
                {bankDetails.map(({ bank, accountName, accountNumber }) => (
                  <div key={bank} className="bg-white/10 rounded-xl p-4 mb-3">
                    <div className="text-xs text-blue-300 mb-1">{bank}</div>
                    <div className="font-semibold">{accountName}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-lg font-bold tracking-wider">{accountNumber}</span>
                      <button
                        onClick={() => copyToClipboard(accountNumber)}
                        className="text-xs bg-[#e94560] px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-[#c73550]"
                      >
                        <Copy size={11} /> Copy
                      </button>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-blue-300 mt-3">
                  Please send proof of payment to: finance@agdnbcsc.edu.ng
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 bg-[#f7f9fc]">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="section-subtitle">Get Involved</p>
            <h2 className="section-title">Partnership Form</h2>
          </div>
          {done ? (
            <div className="bg-white rounded-xl p-10 text-center shadow-sm">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-[#0f3460] mb-2">Thank You for Your Partnership!</h3>
              <p className="text-sm text-gray-500">Our team will reach out to you shortly to confirm your partnership.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input {...register('name')} className="input-field" placeholder="Your name" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label">Email</label>
                  <input {...register('email')} type="email" className="input-field" placeholder="you@email.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone (Optional)</label>
                  <input {...register('phone')} className="input-field" placeholder="08XXXXXXXXX" />
                </div>
                <div>
                  <label className="label">Organisation (Optional)</label>
                  <input {...register('organisation')} className="input-field" placeholder="Church / Company" />
                </div>
              </div>
              <div>
                <label className="label">Partnership Type</label>
                <select {...register('partnershipType')} className="input-field">
                  <option value="">Select type</option>
                  <option>One-time Donation</option>
                  <option>Monthly Partnership</option>
                  <option>Scholarship Sponsor</option>
                  <option>Infrastructure Support</option>
                  <option>Faculty Support</option>
                </select>
                {errors.partnershipType && <p className="text-red-500 text-xs mt-1">{errors.partnershipType.message}</p>}
              </div>
              <div>
                <label className="label">Intended Amount (Optional)</label>
                <input {...register('intendedAmount')} className="input-field" placeholder="e.g. ₦50,000" />
              </div>
              <div>
                <label className="label">Message / Questions</label>
                <textarea {...register('message')} className="input-field" rows={3} placeholder="Tell us about your interest in partnering..." />
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-accent w-full justify-center py-3.5">
                {isSubmitting ? 'Submitting...' : <><Heart size={16} /> Submit Partnership Form</>}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
