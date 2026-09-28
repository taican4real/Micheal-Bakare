import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const currency = items[0].product.currency;
  const currencySymbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '₦';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const orderData = {
        customerName,
        customerEmail,
        items: items.map(item => ({
          product: {
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            currency: item.product.currency,
            selarPaymentUrl: item.product.selarPaymentUrl || null
          },
          quantity: item.quantity
        })),
        totalAmount: cartTotal,
        currency: currency,
        status: 'PENDING',
        accessKey: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      // Navigate to order confirmation
      navigate(`/order-status/${docRef.id}`);
    } catch (err: any) {
      console.error("Order error", err);
      setError(err.message || "Failed to create order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-12 pt-32 pb-32">
      <h1 className="font-serif text-4xl text-ink mb-12 border-b border-border-subtle pb-8">Checkout</h1>
      
      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-surface p-8 rounded-2xl border border-border-subtle space-y-6">
          <h2 className="font-serif text-2xl border-b border-border-subtle pb-4">Customer Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Full Name *</label>
              <input
                required
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Email Address *</label>
              <input
                required
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
              />
              <p className="text-xs text-ink-muted mt-2">Digital products will be sent to this email address once payment is configured.</p>
            </div>
          </div>
        </div>

        <div className="bg-surface p-8 rounded-2xl border border-border-subtle">
          <h2 className="font-serif text-2xl border-b border-border-subtle pb-4 mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map(item => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-ink-muted">{item.quantity}x {item.product.title}</span>
                <span className="text-ink">{currencySymbol}{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-medium text-lg text-ink pt-4 border-t border-border-subtle">
            <span>Total to Pay</span>
            <span>{currencySymbol}{cartTotal.toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-ink text-canvas py-4 rounded-full font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
