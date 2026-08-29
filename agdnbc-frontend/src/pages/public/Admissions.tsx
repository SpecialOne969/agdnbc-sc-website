import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, ArrowRight, FileText, User, Phone, Mail, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitContactForm } from '../../services/api'

const schema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required'),
  programme: z.string().min(1, 'Please select a programme'),
  qualification: z.string().min(1, 'Please enter your qualification'),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const steps = [
  { step: '01', title: 'Submit Application', desc: 'Fill out the online form below or visit our campus.' },
  { step: '02', title: 'Pay Application Fee', desc: 'Pay the application fee online to process your application.' },
  { step: '03', title: 'Document Submission', desc: 'Submit required documents (certificates, passport photo).' },
  { step: '04', title: 'Interview / Review', desc: 'Attend a brief interview session with the admissions team.' },
  { step: '05', title: 'Admission Letter', desc: 'Receive your official admission letter and begin registration.' },
]

const requirements = [
  'Minimum of WAEC/NECO or equivalent',
  'Birth certificate or age declaration',
  'Two recent passport photographs',
  'Letter of recommendation from your pastor/church',
  'Evidence of Christian faith and church membership',
  'Application form (downloadable or online)',
]

export default function Admissions() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await submitContactForm({ ...data, type: 'admission_enquiry' })
      setSubmitted(true)
      toast.success('Application submitted! We will contact you shortly.')
    } catch {
      toast.error('Submission failed. Please try again.')
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f3460] to-[#16213e] text-white py-24 px-4 text-center">
        <p className="section-subtitle text-[#e94560]">Join Our Community</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Admissions</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Begin your journey at AGDNBC. We welcome believers who are hungry for God's Word and called
          to Kingdom service.
        </p>
      </section>

      {/* Steps */}
      <section className="py-20 bg-[#f7f9fc]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subtitle">How It Works</p>
            <h2 className="section-title">Admission Process</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 bg-[#0f3460] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {step}
                </div>
                <h4 className="font-bold text-[#0f3460] mb-2 text-sm">{title}</h4>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements + Form */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          {/* Requirements */}
          <div>
            <p className="section-subtitle">What You Need</p>
            <h2 className="section-title text-2xl">Admission Requirements</h2>
            <ul className="space-y-3 mb-8">
              {requirements.map((req) => (
                <li key={req} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-[#e94560] mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-700">{req}</span>
                </li>
              ))}
            </ul>

            <div className="bg-[#f7f9fc] rounded-xl p-6 border-l-4 border-[#0f3460]">
              <h4 className="font-bold text-[#0f3460] mb-2 flex items-center gap-2">
                <FileText size={16} /> Application Fee
              </h4>
              <p className="text-sm text-gray-600">
                A non-refundable application fee is required to process your admission. Payment can be made
                online through the student portal or at the college finance office.
              </p>
              <Link to="/portal/payments" className="inline-flex items-center gap-2 text-sm text-[#e94560] font-semibold mt-3 hover:underline">
                Pay Online <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Form */}
          <div>
            <p className="section-subtitle">Get Started</p>
            <h2 className="section-title text-2xl">Application Form</h2>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-green-800 text-lg mb-2">Application Received!</h3>
                <p className="text-green-700 text-sm">
                  Thank you for applying to AGDNBC. Our admissions team will contact you within 3–5 working days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="label"><User size={14} className="inline mr-1" /> Full Name</label>
                  <input {...register('fullName')} className="input-field" placeholder="Your full name" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label"><Mail size={14} className="inline mr-1" /> Email</label>
                    <input {...register('email')} type="email" className="input-field" placeholder="you@email.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="label"><Phone size={14} className="inline mr-1" /> Phone</label>
                    <input {...register('phone')} className="input-field" placeholder="08XXXXXXXXX" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="label"><BookOpen size={14} className="inline mr-1" /> Programme of Interest</label>
                  <select {...register('programme')} className="input-field">
                    <option value="">Select a programme</option>
                    <option>Certificate in Theology</option>
                    <option>Diploma in Biblical Studies</option>
                    <option>Christian Ministry & Leadership</option>
                    <option>Mission & Evangelism</option>
                  </select>
                  {errors.programme && <p className="text-red-500 text-xs mt-1">{errors.programme.message}</p>}
                </div>
                <div>
                  <label className="label">Highest Educational Qualification</label>
                  <input {...register('qualification')} className="input-field" placeholder="e.g. WAEC, OND, B.Sc" />
                  {errors.qualification && <p className="text-red-500 text-xs mt-1">{errors.qualification.message}</p>}
                </div>
                <div>
                  <label className="label">Additional Message (Optional)</label>
                  <textarea {...register('message')} className="input-field" rows={3} placeholder="Tell us about yourself..." />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-accent w-full justify-center text-base py-3.5">
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
