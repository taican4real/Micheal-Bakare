import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CheckCircle2, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { Order } from '../types';

export default function OrderStatus() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, 'orders', id);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
      } else {
        setError("Order not found.");
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching order:", err);
      setError("Failed to load order details.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center pt-32">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-32 px-6">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-serif mb-4">Error</h1>
        <p className="text-ink-muted">{error}</p>
        <Link to="/store" className="mt-8 text-ink underline underline-offset-4">Return to Store</Link>
      </div>
    );
  }

  const currencySymbol = order.currency === 'USD' ? '$' : order.currency === 'GBP' ? '£' : order.currency === 'EUR' ? '€' : '₦';

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-12 pt-32 pb-32">
      
      <div className="text-center mb-12">
        {order.status === 'PAID' || order.status === 'COMPLETED' ? (
          <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-6" />
        ) : order.status === 'PENDING' ? (
          <Clock className="w-16 h-16 mx-auto text-amber-500 mb-6" />
        ) : (
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-6" />
        )}
        
        <h1 className="font-serif text-4xl text-ink mb-4">
          {order.status === 'PAID' || order.status === 'COMPLETED' ? 'Payment Successful' :
           order.status === 'PENDING' ? 'Awaiting Payment' : 'Order Cancelled'}
        </h1>
        <p className="text-ink-muted">Order ID: {order.id}</p>
      </div>

      {order.status === 'PENDING' && (
        <div className="bg-amber-50 border border-amber-200 p-8 rounded-2xl mb-12">
          <h2 className="font-serif text-2xl text-amber-900 mb-4">Complete Your Payment</h2>
          <p className="text-amber-800 mb-6">
            We use Selar to securely process our payments. Please click the payment link(s) below to complete your purchase. Once payment is successful, this page will automatically update.
          </p>
          
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-amber-100 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-ink">{item.product.title}</h3>
                  <p className="text-sm text-ink-muted">{item.quantity}x {currencySymbol}{item.product.price.toFixed(2)}</p>
                </div>
                {(item.product as any).selarPaymentUrl ? (
                  <a 
                    href={(item.product as any).selarPaymentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-ink text-canvas px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors"
                  >
                    Pay on Selar <ExternalLink size={14} />
                  </a>
                ) : (
                  <a
                    href={`https://selar.co/m/michaelbakare?product=${encodeURIComponent(item.product.title)}&amount=${item.product.price}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-ink text-canvas px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors"
                  >
                    Checkout with Selar <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {(order.status === 'PAID' || order.status === 'COMPLETED') && (
        <div className="bg-green-50 border border-green-200 p-8 rounded-2xl mb-12">
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl text-green-900 mb-2">Thank you for your purchase!</h2>
            <p className="text-green-800">
              Your payment has been verified. You can download your digital products below.
            </p>
          </div>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-green-100 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-ink">{item.product.title}</h3>
                </div>
                {order.accessKey ? (
                  <a 
                    href={`/api/download/${order.id}/${item.product.id}?accessKey=${order.accessKey}`}
                    className="flex items-center gap-2 bg-ink text-canvas px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors"
                  >
                    Download <ExternalLink size={14} />
                  </a>
                ) : (
                  <span className="text-xs text-ink-muted">Generating access...</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-surface p-8 rounded-2xl border border-border-subtle">
        <h2 className="font-serif text-2xl border-b border-border-subtle pb-4 mb-6">Order Details</h2>
        
        <div className="grid grid-cols-2 gap-y-4 text-sm mb-8 pb-8 border-b border-border-subtle">
          <div className="text-ink-muted">Customer Name</div>
          <div className="text-right text-ink font-medium">{order.customerName}</div>
          
          <div className="text-ink-muted">Email Address</div>
          <div className="text-right text-ink font-medium">{order.customerEmail}</div>
          
          <div className="text-ink-muted">Date</div>
          <div className="text-right text-ink font-medium">
            {order.createdAt ? new Date(order.createdAt.toMillis ? order.createdAt.toMillis() : Date.now()).toLocaleDateString() : 'Just now'}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-ink-muted">{item.quantity}x {item.product.title}</span>
              <span className="text-ink">{currencySymbol}{(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-medium text-lg text-ink pt-4 border-t border-border-subtle">
          <span>Total</span>
          <span>{currencySymbol}{order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
      
    </div>
  );
}
