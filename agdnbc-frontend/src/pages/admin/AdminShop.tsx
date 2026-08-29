import { useState } from 'react'
import { Plus, Package, Download, Truck, Edit } from 'lucide-react'
import toast from 'react-hot-toast'

const mockProducts = [
  { id: '1', name: 'Theology Foundation Textbook', category: 'Academic', type: 'digital', price: 3500, stock: null },
  { id: '2', name: 'AGDNBC Branded T-Shirt', category: 'Merchandise', type: 'physical', price: 5000, stock: 45 },
  { id: '3', name: 'Biblical Studies Workbook', category: 'Academic', type: 'digital', price: 4200, stock: null },
  { id: '4', name: 'Pen & Notebook Set', category: 'Merchandise', type: 'physical', price: 1500, stock: 120 },
]

const mockOrders = [
  { id: '1', student: 'Emmanuel Okafor', product: 'Theology Textbook', type: 'digital', amount: 3500, status: 'completed', date: '2026-07-20' },
  { id: '2', student: 'Mary Johnson', product: 'AGDNBC T-Shirt', type: 'physical', delivery: 'pickup', amount: 5000, status: 'pending', date: '2026-07-22' },
  { id: '3', student: 'James Adeyemi', product: 'Pen & Notebook Set', type: 'physical', delivery: 'delivery', amount: 7500, status: 'processing', date: '2026-07-23' },
]

export default function AdminShop() {
  const [tab, setTab] = useState<'products' | 'orders'>('products')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'Academic', type: 'digital', price: '', stock: '' })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-[#1a1a2e]">Shop Management</h2>
        <button onClick={() => setShowModal(true)} className="btn-accent text-sm py-2.5">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="flex gap-2">
        {(['products', 'orders'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-[#0f3460] text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>{t}</button>
        ))}
      </div>

      {tab === 'products' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${p.type === 'digital' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {p.type === 'digital' ? <Download size={10} /> : <Package size={10} />} {p.type}
                </span>
                <button className="p-1 hover:bg-gray-100 rounded"><Edit size={14} className="text-gray-400" /></button>
              </div>
              <h4 className="font-bold text-[#0f3460] text-sm mb-1">{p.name}</h4>
              <p className="text-xs text-gray-400 mb-3">{p.category}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0f3460]">₦{p.price.toLocaleString()}</span>
                {p.stock !== null && <span className="text-xs text-gray-400">{p.stock} in stock</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'orders' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f7f9fc] text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left px-6 py-3">Student</th>
                  <th className="text-left px-6 py-3">Product</th>
                  <th className="text-center px-6 py-3">Type</th>
                  <th className="text-right px-6 py-3">Amount</th>
                  <th className="text-center px-6 py-3">Date</th>
                  <th className="text-center px-6 py-3">Status</th>
                  <th className="text-center px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-[#f7f9fc]">
                    <td className="px-6 py-4 text-sm font-medium text-[#1a1a2e]">{order.student}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit mx-auto ${order.type === 'digital' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {order.type === 'digital' ? <Download size={10} /> : <Truck size={10} />}
                        {order.type === 'digital' ? 'Digital' : (order as { delivery?: string }).delivery || 'Physical'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-[#0f3460]">₦{order.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-700'
                      }`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {order.status === 'pending' && (
                        <button onClick={() => toast.success('Order marked as fulfilled!')} className="text-xs bg-[#0f3460] text-white px-3 py-1 rounded-lg">
                          Mark Fulfilled
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6">Add Product</h3>
            <div className="space-y-4">
              <div><label className="label">Product Name</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input-field" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Category</label><select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="input-field"><option>Academic</option><option>Merchandise</option></select></div>
                <div><label className="label">Type</label><select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="input-field"><option value="digital">Digital (Soft Copy)</option><option value="physical">Physical (Hard Copy)</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Price (₦)</label><input value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} type="number" className="input-field" /></div>
                {form.type === 'physical' && <div><label className="label">Stock Qty</label><input value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} type="number" className="input-field" /></div>}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={() => { toast.success('Product added!'); setShowModal(false) }} className="btn-primary flex-1 justify-center">Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
