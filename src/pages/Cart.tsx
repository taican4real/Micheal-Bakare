import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import ResponsiveImage from '../components/ResponsiveImage';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-32 text-center">
        <h1 className="font-serif text-4xl text-ink mb-6">Your Cart is Empty</h1>
        <p className="text-ink-muted mb-8">Browse the store to discover digital products and scores.</p>
        <Link to="/store" className="bg-ink text-canvas px-8 py-3 rounded-full font-medium inline-block hover:bg-zinc-800 transition-colors">
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-32">
      <h1 className="font-serif text-4xl text-ink mb-12 border-b border-border-subtle pb-8">Your Cart</h1>
      
      <div className="grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-8">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-6 items-start border-b border-border-subtle pb-8">
              {item.product.coverImageUrl ? (
                <ResponsiveImage loading="lazy" src={item.product.coverImageUrl} alt={item.product.title} className="w-24 h-32 object-cover rounded-xl" />
              ) : (
                <div className="w-24 h-32 bg-zinc-100 rounded-xl" />
              )}
              
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium text-lg text-ink">
                    <Link to={`/store/${item.product.id}`} className="hover:underline">{item.product.title}</Link>
                  </h3>
                  <p className="font-medium text-ink">
                    {item.product.currency === 'USD' ? '$' : item.product.currency === 'GBP' ? '£' : item.product.currency === 'EUR' ? '€' : '₦'}
                    {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <p className="text-sm text-ink-muted mb-4">{item.product.category}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 border border-border-subtle rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.product.id!, item.quantity - 1)}
                      className="p-1 hover:bg-zinc-100 rounded-md transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id!, item.quantity + 1)}
                      className="p-1 hover:bg-zinc-100 rounded-md transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.product.id!)}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-4">
          <div className="bg-surface p-8 rounded-2xl border border-border-subtle sticky top-32">
            <h2 className="font-serif text-2xl mb-6 border-b border-border-subtle pb-4">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-ink-muted">
                <span>Subtotal</span>
                <span>{items[0].product.currency === 'USD' ? '$' : ''}{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg text-ink pt-4 border-t border-border-subtle">
                <span>Total</span>
                <span>{items[0].product.currency === 'USD' ? '$' : ''}{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-ink text-canvas py-4 rounded-full font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
