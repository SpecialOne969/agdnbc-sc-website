import { useState } from 'react'
import { ShoppingCart, Package, Download, Truck, X, Plus, Minus } from 'lucide-react'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  category: string
  price: number
  type: 'physical' | 'digital'
  description: string
}

const products: Product[] = [
  { id: '1', name: 'Theology Foundation Textbook', category: 'Academic', price: 3500, type: 'digital', description: 'Core textbook for Certificate in Theology students. Instant download.' },
  { id: '2', name: 'Biblical Studies Workbook', category: 'Academic', price: 4200, type: 'digital', description: 'Comprehensive workbook for Diploma in Biblical Studies.' },
  { id: '3', name: 'AGDNBC Branded T-Shirt', category: 'Merchandise', price: 5000, type: 'physical', description: 'Official college branded T-shirt. Available in multiple sizes.' },
  { id: '4', name: 'Ministry Leadership Guide (Hardcopy)', category: 'Academic', price: 2800, type: 'physical', description: 'Physical copy of the Ministry Leadership Guide for classroom use.' },
  { id: '5', name: 'AGDNBC Pen & Notebook Set', category: 'Merchandise', price: 1500, type: 'physical', description: 'Official college-branded stationery set.' },
  { id: '6', name: 'Missions & Evangelism Manual', category: 'Academic', price: 3000, type: 'digital', description: 'Complete manual for Mission & Evangelism students. Instant download.' },
]

interface CartItem extends Product { qty: number; deliveryType?: 'pickup' | 'delivery' }

export default function Shop() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [filter, setFilter] = useState('All')

  const categories = ['All', 'Academic', 'Merchandise']

  const filtered = filter === 'All' ? products : products.filter((p) => p.category === filter)

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1, deliveryType: product.type === 'physical' ? 'pickup' : undefined }]
    })
    toast.success(`${product.name} added to cart!`)
  }

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id))
  const updateQty = (id: string, delta: number) => setCart((prev) =>
    prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
  )
  const setDelivery = (id: string, type: 'pickup' | 'delivery') =>
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, deliveryType: type } : i))

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const deliveryFee = cart.filter((i) => i.deliveryType === 'delivery').length * 2000
  const total = subtotal + deliveryFee
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div>
      <section className="bg-gradient-to-br from-[#0f3460] to-[#16213e] text-white py-24 px-4 text-center">
        <p className="section-subtitle text-[#e94560]">Official College Store</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Shop</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Purchase academic materials, merchandise, and more. Digital items are available for instant download.
        </p>
      </section>

      <section className="py-20 bg-[#f7f9fc]">
        <div className="max-w-7xl mx-auto px-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    filter === cat ? 'bg-[#0f3460] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className="relative btn-primary py-2.5"
            >
              <ShoppingCart size={18} /> Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#e94560] rounded-full text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Products */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <div key={product.id} className="card overflow-hidden">
                <div className="bg-[#0f3460] h-2" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#e94560] uppercase tracking-wider">{product.category}</span>
                    <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      product.type === 'digital' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {product.type === 'digital' ? <Download size={10} /> : <Package size={10} />}
                      {product.type === 'digital' ? 'Soft Copy' : 'Hard Copy'}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0f3460] text-lg mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-extrabold text-[#0f3460]">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <button onClick={() => addToCart(product)} className="btn-accent text-sm py-2">
                      <ShoppingCart size={15} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-md bg-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-[#0f3460] text-lg">Your Cart ({cartCount})</h2>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-gray-400 py-10">Your cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex justify-between mb-2">
                      <div className="font-semibold text-[#0f3460] text-sm">{item.name}</div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-bold">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-bold text-[#0f3460]">₦{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                    {item.type === 'physical' && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Delivery option:</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDelivery(item.id, 'pickup')}
                            className={`flex-1 text-xs py-1.5 rounded-lg border font-medium transition-all ${
                              item.deliveryType === 'pickup' ? 'bg-[#0f3460] text-white border-[#0f3460]' : 'bg-white text-gray-600 border-gray-200'
                            }`}
                          >
                            <Package size={10} className="inline mr-1" /> Pickup (Free)
                          </button>
                          <button
                            onClick={() => setDelivery(item.id, 'delivery')}
                            className={`flex-1 text-xs py-1.5 rounded-lg border font-medium transition-all ${
                              item.deliveryType === 'delivery' ? 'bg-[#0f3460] text-white border-[#0f3460]' : 'bg-white text-gray-600 border-gray-200'
                            }`}
                          >
                            <Truck size={10} className="inline mr-1" /> Delivery (₦2,000)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t p-5 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span><span>₦{deliveryFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-[#0f3460] text-lg pt-2 border-t">
                  <span>Total</span><span>₦{total.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => { setCartOpen(false); toast('Redirecting to payment...') }}
                  className="btn-accent w-full justify-center py-3.5 mt-2"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
