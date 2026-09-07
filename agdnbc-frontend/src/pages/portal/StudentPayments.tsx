import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CreditCard, CheckCircle, Clock, AlertCircle, Download, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { getMyPayments, initializePayment } from '../../services/api'

const mockPayments = [
  { id: '1', category: 'Registration Fee', amount: 10000, status: 'paid', date: '2026-01-10', ref: 'PAY-2026-001' },
  { id: '2', category: 'School Fees (Year 1)', amount: 105000, status: 'pending', date: null, ref: null },
]

const paymentCategories = [
  { label: 'Registration Fee', amount: 10000 },
  { label: 'School Fees (Year 1)', amount: 105000 },
  { label: 'School Fees (Year 2)', amount: 155000 },
  { label: 'Graduation Fee', amount: 10000 },
]

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  paid: { icon: CheckCircle, color: 'text-green-600 bg-green-100', label: 'Paid' },
  pending: { icon: Clock, color: 'text-orange-600 bg-orange-100', label: 'Pending' },
  failed: { icon: AlertCircle, color: 'text-red-600 bg-red-100', label: 'Failed' },
}

export default function StudentPayments() {
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(paymentCategories[0])
  const [paying, setPaying] = useState(false)

  const { data, isLoading } = useQuery({ queryKey: ['my-payments'], queryFn: getMyPayments })
  const payments = data?.data?.length ? data.data : mockPayments

  const pending = payments.filter((p: typeof mockPayments[0]) => p.status === 'pending')
  const totalOutstanding = pending.reduce((s: number, p: typeof mockPayments[0]) => s + p.amount, 0)

  const handlePay = async () => {
    setPaying(true)
    try {
      const res = await initializePayment({ category: selected.label, amount: selected.amount })
      window.location.href = res.data.authorization_url
    } catch {
      toast.error('Payment initialization failed. Please try again.')
      setPaying(false)
    }
  }

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading payments...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0f3460]">Payments</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm py-2.5">
          <Plus size={16} /> Make a Payment
        </button>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="text-xs text-green-600 font-semibold mb-1">Total Paid</div>
          <div className="text-2xl font-bold text-green-700">
            ₦{payments.filter((p: typeof mockPayments[0]) => p.status === 'paid').reduce((s: number, p: typeof mockPayments[0]) => s + p.amount, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <div className="text-xs text-orange-600 font-semibold mb-1">Outstanding</div>
          <div className="text-2xl font-bold text-orange-700">₦{totalOutstanding.toLocaleString()}</div>
        </div>
        <div className="bg-[#f7f9fc] border border-gray-200 rounded-xl p-5">
          <div className="text-xs text-gray-500 font-semibold mb-1">Total Transactions</div>
          <div className="text-2xl font-bold text-[#0f3460]">{payments.length}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-[#0f3460]">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f7f9fc] text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-6 py-3">Category</th>
                <th className="text-left px-6 py-3">Reference</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-right px-6 py-3">Amount</th>
                <th className="text-center px-6 py-3">Status</th>
                <th className="text-center px-6 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment: typeof mockPayments[0]) => {
                const cfg = statusConfig[payment.status]
                const Icon = cfg.icon
                return (
                  <tr key={payment.id} className="border-b border-gray-50 hover:bg-[#f7f9fc] transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-[#0f3460]">{payment.category}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{payment.ref || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{payment.date || '—'}</td>
                    <td className="px-6 py-4 text-right font-bold text-[#0f3460]">₦{payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                        <Icon size={11} /> {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {payment.status === 'paid' ? (
                        <button className="text-[#0f3460] hover:text-[#e94560]">
                          <Download size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const cat = paymentCategories.find((c) => c.label === payment.category) || paymentCategories[0]
                            setSelected(cat)
                            setShowModal(true)
                          }}
                          className="text-xs bg-[#e94560] text-white px-3 py-1 rounded-lg hover:bg-[#c73550]"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard size={24} className="text-[#0f3460]" />
              <h3 className="text-xl font-bold text-[#0f3460]">Make a Payment</h3>
            </div>
            <div className="mb-4">
              <label className="label">Payment Category</label>
              <select
                className="input-field"
                value={selected.label}
                onChange={(e) => {
                  const cat = paymentCategories.find((c) => c.label === e.target.value)!
                  setSelected(cat)
                }}
              >
                {paymentCategories.map((cat) => (
                  <option key={cat.label} value={cat.label}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="bg-[#f7f9fc] rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount</span>
                <span className="text-2xl font-extrabold text-[#0f3460]">₦{selected.amount.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">You will be redirected to Paystack to complete your payment securely.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={handlePay} disabled={paying} className="btn-accent flex-1 justify-center">
                <CreditCard size={16} /> {paying ? 'Redirecting...' : 'Pay with Paystack'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
