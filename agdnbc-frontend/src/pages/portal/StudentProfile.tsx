import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { User, Mail, Phone, BookOpen, Hash, Calendar, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { getMyProfile, updateMyProfile } from '../../services/api'
import { useAuthStore } from '../../store/authStore'

export default function StudentProfile() {
  const { user } = useAuthStore()
  const { data, isLoading } = useQuery({ queryKey: ['my-profile'], queryFn: getMyProfile })
  const profile = data?.data || {}

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { phone: profile.phone || '', address: profile.address || '' },
  })

  const onSubmit = async (formData: Record<string, string>) => {
    try {
      await updateMyProfile(formData)
      toast.success('Profile updated!')
    } catch {
      toast.error('Update failed.')
    }
  }

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading profile...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#0f3460]">My Profile</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Avatar card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="w-24 h-24 bg-[#0f3460] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <h3 className="font-bold text-[#0f3460] text-lg">{user?.name}</h3>
          <p className="text-[#e94560] text-sm">{user?.schoolId}</p>
          <div className="mt-4 space-y-2 text-left">
            {[
              { label: 'Level', value: profile.level || user?.level || 'Year 1' },
              { label: 'Programme', value: profile.programme || user?.programme || 'Biblical Studies' },
              { label: 'Status', value: profile.status || 'Active' },
              { label: 'Session', value: profile.session || '2025/2026' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-[#0f3460]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-5">
          {/* Read-only info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h4 className="font-bold text-[#0f3460] mb-4">Academic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Hash, label: 'School ID', value: user?.schoolId },
                { icon: BookOpen, label: 'Programme', value: profile.programme || 'Diploma in Biblical Studies' },
                { icon: Calendar, label: 'Admission Year', value: profile.admissionYear || '2024' },
                { icon: User, label: 'Current Level', value: profile.level || 'Year 1' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-[#f7f9fc] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <Icon size={12} /> {label}
                  </div>
                  <div className="font-semibold text-[#0f3460] text-sm">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Editable info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h4 className="font-bold text-[#0f3460] mb-4">Contact Information <span className="text-xs font-normal text-gray-400">(editable)</span></h4>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-1"><Mail size={12} /> Email</label>
                  <input defaultValue={profile.email || ''} className="input-field bg-gray-50" disabled />
                  <p className="text-xs text-gray-400 mt-1">Contact registrar to update email</p>
                </div>
                <div>
                  <label className="label flex items-center gap-1"><Phone size={12} /> Phone</label>
                  <input {...register('phone')} className="input-field" placeholder="08XXXXXXXXX" />
                </div>
              </div>
              <div>
                <label className="label">Home Address</label>
                <textarea {...register('address')} className="input-field" rows={2} placeholder="Your residential address" />
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
