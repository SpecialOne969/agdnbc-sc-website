import { useState, useEffect, useCallback } from 'react'
import { Search, CheckCircle, Clock, XCircle, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../../services/api'

interface PaymentClaim {
  id: string
  studentName: string
  category: string
  amount: number
  transactionRef: string
  submittedAt: string
  status: 'awaiting_approval' | 'approved' | 'rejected'
  adminNote?: string | null
  student?: { schoolId: string; email?: string }
}

const statusConfig = {
  approved: { icon: CheckCircle, color: 'text-green-600 bg-green-100', label: 'Approved' },
  awaiting_approval: { icon: Clock, color: 'text-orange-600 bg-orange-100', label: 'Pending Review' },
  rejected: { icon: XCircle, color: 'text-red-600 bg-red-100', label: 'Rejected' },
}

export default function AdminPayments() {
  const [claims, setClaims] = useState<PaymentClaim[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'pending' | 'all'>('pending')
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectNote, setRejectNote] = useState('')
  const [acting, setActing] = useState<string | null>(null)

  const fetchClaims = useCallback(async () => {
    try {
      const res = await api.get('/payments/claims')
      setClaims(res.data)
    } catch {
      toast.error('Failed to load payment claims')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchClaims() }, [fetchClaims])

  const approve = async (id: string) => {
    setActing(id)
    try {
      await api.patch(`/payments/claims/${id}/approve`)
      await fetchClaims()
      toast.success('Payment approved — student notified by email')
    } catch {
      toast.error('Failed to approve')
    } finally {
      setActing(null)
    }
  }

  const reject = async (id: string) => {
    setActing(id)
    try {
      await api.patch(`/payments/claims/${id}/reject`, { adminNote: rejectNote.trim() || undefined })
      await fetchClaims()
      setRejectId(null)
      setRejectNote('')
      toast.success('Payment rejected — student notified by email')
    } catch {
      toast.error('Failed to reject')
    } finally {
      setActing(null)
    }
  }

  const pending = claims.filter(c => c.status === 'awaiting_approval')
  const displayed = (tab === 'pending' ? pending : claims).filter(c => {
    const q = search.toLowerCase()
    return (
      c.studentName.toLowerCase().includes(q) ||
      (c.student?.schoolId || '').toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    )
  })

  const totalApproved = claims.filter(c => c.status === 'approved').reduce((s, c) => s + c.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-[#1a1a2e]">Payment Records</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="text-xs text-green-600 font-semibold">Total Approved</div>
          <div className="text-2xl font-bold text-green-700 mt-1">₦{totalApproved.toLocaleString()}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <div className="text-xs text-orange-600 font-semibold">Pending Review</div>
          <div className="text-2xl font-bold text-orange-700 mt-1">{pending.length}</div>
        </div>
        <div className="bg-[#f7f9fc] border border-gray-200 rounded-xl p-5">
          <div className="text-xs text-gray-500 font-semibold">Total Submissions</div>
          <div className="text-2xl font-bold text-[#0f3460] mt-1">{claims.length}</div>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex bg-[#f7f9fc] rounded-xl p-1 gap-1">
          <button
            onClick={() => setTab('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
              ${tab === 'pending' ? 'bg-white text-[#0f3460] shadow-sm' : 'text-gray-500 hover:text-[#0f3460]'}`}
          >
            Pending Review
            {pending.length > 0 && (
              <span className="bg-[#e94560] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {pending.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${tab === 'all' ? 'bg-white text-[#0f3460] shadow-sm' : 'text-gray-500 hover:text-[#0f3460]'}`}
          >
            All Records
          </button>
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
            placeholder="Search by name, ID, or category..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={24} className="animate-spin text-[#0f3460]" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            {tab === 'pending' ? 'No pending payment approvals.' : 'No payment records found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f7f9fc] text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left px-6 py-3">Student</th>
                  <th className="text-left px-6 py-3">Category</th>
                  <th className="text-left px-6 py-3">Transaction Ref</th>
                  <th className="text-left px-6 py-3">Submitted</th>
                  <th className="text-right px-6 py-3">Amount</th>
                  <th className="text-center px-6 py-3">Status</th>
                  <th className="text-center px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(claim => {
                  const cfg = statusConfig[claim.status]
                  const Icon = cfg.icon
                  return (
                    <tr key={claim.id} className="border-b border-gray-50 hover:bg-[#f7f9fc]">
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm text-[#1a1a2e]">{claim.studentName}</div>
                        <div className="text-xs font-mono text-gray-400">{claim.student?.schoolId}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{claim.category}</td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{claim.transactionRef}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(claim.submittedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-[#0f3460]">₦{claim.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                          <Icon size={11} /> {cfg.label}
                        </span>
                        {claim.adminNote && (
                          <p className="text-xs text-red-500 mt-1 max-w-[140px] mx-auto">{claim.adminNote}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {claim.status === 'awaiting_approval' ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => approve(claim.id)}
                              disabled={acting === claim.id}
                              title="Approve"
                              className="bg-green-100 text-green-700 hover:bg-green-200 p-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {acting === claim.id ? <Loader2 size={15} className="animate-spin" /> : <ThumbsUp size={15} />}
                            </button>
                            <button
                              onClick={() => setRejectId(claim.id)}
                              disabled={acting === claim.id}
                              title="Reject"
                              className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <ThumbsDown size={15} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject modal */}
      {rejectId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-[#0f3460] mb-1">Reject Payment</h3>
            <p className="text-sm text-gray-400 mb-4">Optionally provide a reason — it will be emailed to the student.</p>
            <textarea
              className="input-field resize-none h-24"
              placeholder="e.g. Could not verify this transaction reference"
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setRejectId(null); setRejectNote('') }}
                className="btn-outline flex-1 justify-center"
              >
                Cancel
              </button>
              <button
                onClick={() => reject(rejectId)}
                disabled={!!acting}
                className="flex-1 bg-[#e94560] text-white py-2.5 rounded-xl font-semibold hover:bg-[#c73550] text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {acting ? <Loader2 size={15} className="animate-spin" /> : null}
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
