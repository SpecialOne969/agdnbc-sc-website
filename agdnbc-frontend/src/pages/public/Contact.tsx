import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitContactForm } from '../../services/api'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})
type FormData = z.infer<typeof schema>

export default function Contact() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await submitContactForm(data)
      setSent(true)
      toast.success('Message sent!')
    } catch {
      toast.error('Failed to send. Please try again.')
    }
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-[#0f3460] to-[#16213e] text-white py-24 px-4 text-center">
        <p className="section-subtitle text-[#e94560]">Get in Touch</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Contact Us</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Have a question? We would love to hear from you. Send us a message and we will respond within 24 hours.
        </p>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <p className="section-subtitle">Find Us</p>
            <h2 className="section-title text-2xl">Contact Information</h2>
            <p className="text-gray-500 mb-8 text-sm">
              We are here to help with admissions enquiries, academic information, partnership opportunities,
              and general questions about the college.
            </p>
            <div className="space-y-5">
              {[
                { icon: MapPin, title: 'Address', content: 'AGDNBC Satellite Campus, Nigeria' },
                { icon: Phone, title: 'Phone', content: '+234 XXX XXX XXXX' },
                { icon: Mail, title: 'Email', content: 'info@agdnbcsc.edu.ng' },
                { icon: Clock, title: 'Office Hours', content: 'Mon – Fri: 8am – 5pm\nSat: 9am – 1pm' },
              ].map(({ icon: Icon, title, content }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-11 h-11 bg-[#0f3460]/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#0f3460]" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#0f3460]">{title}</div>
                    <div className="text-sm text-gray-500 whitespace-pre-line">{content}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="mt-8 bg-[#f7f9fc] rounded-xl h-52 flex items-center justify-center border border-gray-200">
              <div className="text-center text-gray-400">
                <MapPin size={32} className="mx-auto mb-2 text-[#0f3460]" />
                <p className="text-sm">Google Maps will appear here</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <p className="section-subtitle">Send a Message</p>
            <h2 className="section-title text-2xl">Write to Us</h2>
            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-10 text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-green-800 text-lg mb-2">Message Sent!</h3>
                <p className="text-sm text-green-700">We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Your Name</label>
                    <input {...register('name')} className="input-field" placeholder="Full name" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <input {...register('email')} type="email" className="input-field" placeholder="you@example.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="label">Phone (Optional)</label>
                  <input {...register('phone')} className="input-field" placeholder="08XXXXXXXXX" />
                </div>
                <div>
                  <label className="label">Subject</label>
                  <input {...register('subject')} className="input-field" placeholder="What is this about?" />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea {...register('message')} className="input-field" rows={5} placeholder="Write your message here..." />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3.5">
                  {isSubmitting ? 'Sending...' : (<><Send size={16} /> Send Message</>)}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
