import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      await addDoc(collection(db, 'subscribers'), {
        email: email.trim(),
        subscribedAt: serverTimestamp()
      });
      setStatus('success');
      setEmail('');
    } catch (error: any) {
      console.error('Newsletter error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'An error occurred. Please try again later.');
    }
  };

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-canvas"
          >
            <CheckCircle2 className="text-green-400" size={24} />
            <div>
              <p className="font-medium text-sm text-white">Subscribed successfully.</p>
              <p className="text-xs text-zinc-400 font-light mt-0.5">Thank you for joining the archive.</p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="relative flex flex-col gap-3"
          >
            <div className="relative flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address for newsletter subscription"
                disabled={status === 'loading'}
                required
                className="w-full bg-zinc-900 border border-zinc-800 text-canvas px-6 py-4 rounded-full outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all placeholder:text-zinc-600 disabled:opacity-70"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                disabled={status === 'loading' || !email}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-canvas text-ink p-2.5 rounded-full hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center group"
              >
                {status === 'loading' ? (
                  <Loader2 size={18} className="animate-spin text-ink-muted" />
                ) : (
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                )}
              </button>
            </div>
            
            <AnimatePresence>
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="flex items-center gap-2 text-red-400 text-xs px-4"
                >
                  <AlertCircle size={14} />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
