import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CheckCircle, User, Phone, Mail, MapPin, Calendar, BookOpen,
  Church, CreditCard, Copy, X, AlertCircle, FileText
} from 'lucide-react'
import toast from 'react-hot-toast'
import { submitContactForm } from '../../services/api'

const schema = z.object({
  email: z.string().email('Valid email required'),
  name: z.string().min(3, 'Full name is required'),
  sex: z.enum(['M', 'F'], { required_error: 'Please select your sex' }),
  phone: z.string().min(10, 'Valid phone number required'),
  address: z.string().min(5, 'House address is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  bornAgain: z.enum(['Yes', 'No'], { required_error: 'This field is required' }),
  education: z.string().min(1, 'Please enter your highest level of education'),
  baptized: z.enum(['Yes', 'No'], { required_error: 'This field is required' }),
  church: z.string().min(2, 'Church name is required'),
  pastorName: z.string().min(2, "Pastor's name is required"),
  district: z.string().min(1, 'Please select a district'),
  pastorPhone: z.string().min(10, "Pastor's phone number is required"),
  campus: z.string().min(1, 'Please select a campus'),
  agreeToRules: z.literal('Yes', { errorMap: () => ({ message: 'You must agree to the rules' }) }),
})

type FormData = z.infer<typeof schema>

const BANK = {
  name: 'Greater Evangelical',
  bank: 'Access Bank',
  account: '0054970243',
  amount: '₦10,000',
  whatsapp: '08183771136',
}

const steps = [
  { step: '01', title: 'Fill Application', desc: 'Complete all fields in the registration form below.' },
  { step: '02', title: 'Pay Registration Fee', desc: 'Pay the non-refundable ₦10,000 registration fee.' },
  { step: '03', title: 'Submit & Confirm', desc: 'Submit your form and send your receipt via WhatsApp.' },
  { step: '04', title: 'Document Submission', desc: 'Bring required documents (certificates, passport photo).' },
  { step: '05', title: 'Admission Letter', desc: 'Receive your official admission letter and begin.' },
]

export default function Admissions() {
  const [showPayment, setShowPayment] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [pendingData, setPendingData] = useState<FormData | null>(null)
  const [copied, setCopied] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    setPendingData(data)
    setShowPayment(true)
  }

  const handleConfirmPayment = async () => {
    if (!pendingData) return
    setConfirming(true)
    try {
      await submitContactForm({ ...pendingData, type: 'admission_application' })
      setShowPayment(false)
      setSubmitted(true)
      toast.success('Application submitted successfully!')
    } catch {
      toast.error('Submission failed. Please try again.')
    } finally {
      setConfirming(false)
    }
  }

  const copyAccount = () => {
    navigator.clipboard.writeText(BANK.account)
    setCopied(true)
    toast.success('Account number copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const label = (text: string) => (
    <label className="label mb-1 block">{text} <span className="text-red-500">*</span></label>
  )

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f3460] to-[#16213e] text-white py-24 px-4 text-center">
        <p className="section-subtitle text-[#e94560]">Join Our Community</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Student Registration</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Begin your journey at AGDNBC Satellite Campus. Complete the form below — all fields are required.
        </p>
      </section>

      {/* Steps */}
      <section className="py-16 bg-[#f7f9fc]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="section-subtitle">How It Works</p>
            <h2 className="section-title">Registration Process</h2>
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

      {/* Fee notice */}
      <div className="bg-amber-50 border-y border-amber-200 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <AlertCircle size={20} className="text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Registration Fee:</strong> A non-refundable fee of <strong>₦10,000</strong> is required to process your application.
            Payment details will appear after you complete the form.
          </p>
        </div>
      </div>

      {/* Form */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
              <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-green-800 text-2xl mb-3">Application Submitted!</h3>
              <p className="text-green-700 mb-4">
                Thank you for registering with AGDNBC Satellite Campus. Our admissions team will review
                your application and contact you within 3–5 working days.
              </p>
              <div className="bg-green-100 rounded-xl p-4 text-sm text-green-800 text-left">
                <p className="font-semibold mb-1">Next Step — Send Payment Receipt</p>
                <p>Send your ₦10,000 payment receipt to <strong>{BANK.whatsapp}</strong> on WhatsApp to confirm your registration.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="section-subtitle">AGDNBC Satellite Campus</p>
                <h2 className="section-title text-2xl">Registration Form</h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Email */}
                <div>
                  {label('Email')}
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input {...register('email')} type="email" className="input-field pl-9" placeholder="yourname@email.com" />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Name */}
                <div>
                  {label('Name')}
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input {...register('name')} className="input-field pl-9" placeholder="Full name" />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Sex */}
                <div>
                  {label('Sex')}
                  <div className="flex gap-6 mt-2">
                    {(['M', 'F'] as const).map((s) => (
                      <label key={s} className="flex items-center gap-2 cursor-pointer">
                        <input {...register('sex')} type="radio" value={s} className="accent-[#0f3460]" />
                        <span className="text-sm font-medium text-gray-700">{s === 'M' ? 'Male (M)' : 'Female (F)'}</span>
                      </label>
                    ))}
                  </div>
                  {errors.sex && <p className="text-red-500 text-xs mt-1">{errors.sex.message}</p>}
                </div>

                {/* Phone + DOB */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    {label('Phone Number')}
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input {...register('phone')} className="input-field pl-9" placeholder="08XXXXXXXXX" />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    {label('Date of Birth')}
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input {...register('dateOfBirth')} type="date" className="input-field pl-9" />
                    </div>
                    {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>}
                  </div>
                </div>

                {/* Address */}
                <div>
                  {label('House Address')}
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-3 text-gray-400" />
                    <textarea {...register('address')} className="input-field pl-9" rows={2} placeholder="Your residential address" />
                  </div>
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>

                {/* Born Again */}
                <div>
                  {label('Are you Born Again?')}
                  <div className="flex gap-6 mt-2">
                    {(['Yes', 'No'] as const).map((v) => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input {...register('bornAgain')} type="radio" value={v} className="accent-[#0f3460]" />
                        <span className="text-sm font-medium text-gray-700">{v}</span>
                      </label>
                    ))}
                  </div>
                  {errors.bornAgain && <p className="text-red-500 text-xs mt-1">{errors.bornAgain.message}</p>}
                </div>

                {/* Education */}
                <div>
                  {label('What is your highest level of education?')}
                  <div className="relative">
                    <BookOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input {...register('education')} className="input-field pl-9" placeholder="e.g. WAEC, OND, B.Sc, M.Sc" />
                  </div>
                  {errors.education && <p className="text-red-500 text-xs mt-1">{errors.education.message}</p>}
                </div>

                {/* Baptized */}
                <div>
                  {label('Are you Baptized by immersion?')}
                  <div className="flex gap-6 mt-2">
                    {(['Yes', 'No'] as const).map((v) => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input {...register('baptized')} type="radio" value={v} className="accent-[#0f3460]" />
                        <span className="text-sm font-medium text-gray-700">{v}</span>
                      </label>
                    ))}
                  </div>
                  {errors.baptized && <p className="text-red-500 text-xs mt-1">{errors.baptized.message}</p>}
                </div>

                {/* Church + Pastor name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    {label('Which church do you attend?')}
                    <div className="relative">
                      <Church size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input {...register('church')} className="input-field pl-9" placeholder="Church name" />
                    </div>
                    {errors.church && <p className="text-red-500 text-xs mt-1">{errors.church.message}</p>}
                  </div>
                  <div>
                    {label("What is the name of your Pastor?")}
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input {...register('pastorName')} className="input-field pl-9" placeholder="Pastor's full name" />
                    </div>
                    {errors.pastorName && <p className="text-red-500 text-xs mt-1">{errors.pastorName.message}</p>}
                  </div>
                </div>

                {/* District */}
                <div>
                  {label('Which district are you of?')}
                  <select {...register('district')} className="input-field">
                    <option value="">Select a district</option>
                    <option>Rivers District 1</option>
                    <option>Rivers District 2</option>
                    <option>Rivers District 3</option>
                    <option>Rivers District 4</option>
                    <option>Bayelsa District</option>
                    <option>Other</option>
                  </select>
                  {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
                </div>

                {/* Pastor phone */}
                <div>
                  {label("Kindly share your Pastor's phone number")}
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input {...register('pastorPhone')} className="input-field pl-9" placeholder="Pastor's phone number" />
                  </div>
                  {errors.pastorPhone && <p className="text-red-500 text-xs mt-1">{errors.pastorPhone.message}</p>}
                </div>

                {/* Campus */}
                <div>
                  {label('Which Campus do you want to enrol in?')}
                  <select {...register('campus')} className="input-field">
                    <option value="">Select a campus</option>
                    <option>Port Harcourt, Rivers State</option>
                    <option>Yenagoa, Bayelsa State</option>
                  </select>
                  {errors.campus && <p className="text-red-500 text-xs mt-1">{errors.campus.message}</p>}
                </div>

                {/* Agree to rules */}
                <div className="bg-[#f7f9fc] rounded-xl p-4 border border-gray-200">
                  {label('Do you agree to abide by the rules governing the Bible College?')}
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input {...register('agreeToRules')} type="radio" value="Yes" className="accent-[#0f3460]" />
                      <span className="text-sm font-medium text-gray-700">Yes, I agree</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input {...register('agreeToRules')} type="radio" value="No" className="accent-red-500" />
                      <span className="text-sm font-medium text-gray-700">No</span>
                    </label>
                  </div>
                  {errors.agreeToRules && <p className="text-red-500 text-xs mt-1">{errors.agreeToRules.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-accent w-full justify-center text-base py-4 mt-2"
                >
                  <FileText size={18} />
                  {isSubmitting ? 'Processing...' : 'Register — Proceed to Payment'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      {/* ── Payment Modal ── */}
      {showPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-[#0f3460] text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard size={22} />
                <div>
                  <h3 className="font-bold text-lg">Pay Registration Fee</h3>
                  <p className="text-blue-300 text-xs">Complete payment to submit your application</p>
                </div>
              </div>
              <button onClick={() => setShowPayment(false)} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Amount banner */}
              <div className="bg-[#e94560]/10 border border-[#e94560]/30 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Amount Due</p>
                <p className="text-4xl font-extrabold text-[#e94560]">₦10,000</p>
                <p className="text-xs text-gray-400 mt-1">Non-refundable registration fee</p>
              </div>

              {/* Bank transfer details */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Bank Transfer Details</p>
                <div className="bg-[#f7f9fc] rounded-xl divide-y divide-gray-100 border border-gray-100">
                  <div className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-gray-500">Account Name</span>
                    <span className="font-semibold text-[#0f3460]">{BANK.name}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-gray-500">Bank</span>
                    <span className="font-semibold text-[#0f3460]">{BANK.bank}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-gray-500">Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0f3460] font-mono text-base">{BANK.account}</span>
                      <button
                        onClick={copyAccount}
                        className={`p-1.5 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp notice */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                <p className="font-semibold mb-1">After Payment</p>
                <p>Send your payment receipt to <strong>{BANK.whatsapp}</strong> on WhatsApp to confirm your registration.</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowPayment(false)} className="btn-outline flex-1 justify-center py-3">
                  Go Back
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={confirming}
                  className="btn-accent flex-1 justify-center py-3"
                >
                  <CheckCircle size={16} />
                  {confirming ? 'Submitting...' : "I've Paid — Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
