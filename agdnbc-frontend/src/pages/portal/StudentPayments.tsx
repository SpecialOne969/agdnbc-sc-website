import { useState, useEffect, useCallback } from 'react'
import { Building2, Copy, CheckCircle, Clock, XCircle, Plus, Send, Banknote, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../../services/api'

const BANK_DETAILS = {
  bankName: 'Guaranty Trust Bank (GTBank)',
  accountName: 'AGDN Bible College SC',
  accountNumber: '0123456789',
}

const paymentCategories = [
  { label: 'Registration Fee', amount: 10000 },
  { label: 'School Fees – Year 1 (1st Installment)', amount: 52500 },
  { label: 'School Fees – Year 1 (2nd Installment)', amount: 52500 },
  { label: 'School Fees – Year 2 (1st Installment)', amount: 77500 },
  { label: 'School Fees – Year 2 (2nd Installment)', amount: 77500 },
  { label: 'Graduation Fee', amount: 10000 },
]

interface PaymentClaim {
  id: string
  category: string
  amount: number
  transactionRef: string
  submittedAt: string
  status: 'awaiting_approval' | 'approved' | 'rejected'
  adminNote?: string | null
}

const statusConfig = {
  approved: { icon: CheckCircle, color: 'text-green-600 bg-green-100', label: 'Approved' },
  awaiting_approval: { icon: Clock, color: 'text-orange-600 bg-orange-100', label: 'Awaiting Approval' },
  rejected: { icon: XCircle, color: 'text-red-600 bg-red-100', label: 'Rejected' },
}

export default function StudentPayments() {
  const [claims, setClaims] = useState<PaymentClaim[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(paymentCategories[0])
  const [transRef, setTransRef] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  const fetchClaims = useCallback(async () => {
    try {
      const res = await api.get('/payments/claims/mine')
      setClaims(res.data)
    } catch {
      // silently fail — student may just have no claims yet
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchClaims() }, [fetchClaims])

  const handleCopy = () => {
    navigator.clipboard.writeText(BANK_DETAILS.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async () => {
    if (!transRef.trim()) { toast.error('Please enter your transaction reference'); return }
    setSubmitting(true)
    try {
      await api.post('/payments/claims', {
        category: selected.label,
        amount: selected.amount,
        transactionRef: transRef.trim(),
      })
      await fetchClaims()
      setShowModal(false)
      setTransRef('')
      toast.success('Submitted! Admin will verify and approve shortly. You will be notified by email.')
    } catch {
      toast.error('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const totalApproved = claims.filter(c => c.status === 'approved').reduce((s, c) => s + c.amount, 0)
  const pendingCount = claims.filter(c => c.status === 'awaiting_approval').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0f3460]">Payments</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm py-2.5">
          <Plus size={16} /> I've Made a Payment
        </button>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="text-xs text-green-600 font-semibold mb-1">Total Approved</div>
          <div className="text-2xl font-bold text-green-700">₦{totalApproved.toLocaleString()}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <div className="text-xs text-orange-600 font-semibold mb-1">Awaiting Approval</div>
          <div className="text-2xl font-bold text-orange-700">{pendingCount}</div>
        </div>
        <div className="bg-[#f7f9fc] border border-gray-200 rounded-xl p-5">
          <div className="text-xs text-gray-500 font-semibold mb-1">Total Submissions</div>
          <div className="text-2xl font-bold text-[#0f3460]">{claims.length}</div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-[#0f3460] text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Building2 size={22} />
          <h3 className="font-bold text-lg">Bank Transfer Details</h3>
        </div>
        <p className="text-blue-100 text-sm mb-5">
          Transfer the exact amount for your payment category to the account below, then click{' '}
          <strong>"I've Made a Payment"</strong> with your transaction reference so admin can verify.
        </p>
        <div className="bg-white/10 rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-blue-200 text-sm">Bank</span>
            <span className="font-semibold">{BANK_DETAILS.bankName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-200 text-sm">Account Name</span>
            <span className="font-semibold">{BANK_DETAILS.accountName}</span>
          </div>
          <div className="flex justify-between items-center border-t border-white/20 pt-3">
            <span className="text-blue-200 text-sm">Account Number</span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-xl tracking-widest">{BANK_DETAILS.accountNumber}</span>
              <button
                onClick={handleCopy}
                className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fee schedule */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-[#0f3460]">Fee Schedule</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {paymentCategories.map(cat => (
            <div key={cat.label} className="flex justify-between items-center px-6 py-4">
              <span className="text-sm text-gray-700">{cat.label}</span>
              <span className="font-bold text-[#0f3460]">₦{cat.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Submissions history */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 size={24} className="animate-spin text-[#0f3460]" />
        </div>
      ) : claims.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-[#0f3460]">My Payment Submissions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f7f9fc] text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left px-6 py-3">Category</th>
                  <th className="text-left px-6 py-3">Transaction Ref</th>
                  <th className="text-left px-6 py-3">Submitted</th>
                  <th className="text-right px-6 py-3">Amount</th>
                  <th className="text-center px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {claims.map(claim => {
                  const cfg = statusConfig[claim.status]
                  const Icon = cfg.icon
                  return (
                    <tr key={claim.id} className="border-b border-gray-50 hover:bg-[#f7f9fc]">
                      <td className="px-6 py-4 text-sm font-semibold text-[#0f3460]">{claim.category}</td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-500">{claim.transactionRef}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(claim.submittedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-[#0f3460]">₦{claim.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                          <Icon size={11} /> {cfg.label}
                        </span>
                        {claim.status === 'rejected' && claim.adminNote && (
                          <p className="text-xs text-red-500 mt-1">{claim.adminNote}</p>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <Banknote size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm">No submissions yet. Make a transfer and click "I've Made a Payment".</p>
        </div>
      )}

      {/* Submit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-6">
              <Send size={22} className="text-[#0f3460]" />
              <h3 className="text-xl font-bold text-[#0f3460]">Notify Admin of Payment</h3>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 text-sm text-blue-700">
              Make sure you've already transferred to <strong>{BANK_DETAILS.accountName}</strong>{' '}
              (<span className="font-mono">{BANK_DETAILS.accountNumber}</span>) before submitting.
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Payment Category</label>
                <select
                  className="input-field"
                  value={selected.label}
                  onChange={e => setSelected(paymentCategories.find(c => c.label === e.target.value)!)}
                >
                  {paymentCategories.map(c => (
                    <option key={c.label} value={c.label}>{c.label} — ₦{c.amount.toLocaleString()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Transaction Reference / Narration</label>
                <input
                  className="input-field"
                  placeholder="e.g. TRF250916ABC1234 or bank SMS narration"
                  value={transRef}
                  onChange={e => setTransRef(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">Copy the reference from your bank app or debit SMS alert.</p>
              </div>
              <div className="bg-[#f7f9fc] rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="text-xl font-extrabold text-[#0f3460]">₦{selected.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setTransRef('') }} className="btn-outline flex-1 justify-center">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1 justify-center">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {submitting ? 'Sending...' : "I've Paid — Notify Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
