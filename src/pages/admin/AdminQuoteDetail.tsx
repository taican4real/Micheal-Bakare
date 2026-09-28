import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { QuoteRequest, QUOTE_STATUSES, QuoteStatus } from '../../types';
import { ArrowLeft, Download, Mail, Phone, Building, MapPin, Calendar, DollarSign, FileText } from 'lucide-react';

export default function AdminQuoteDetail() {
  const { id } = useParams();
  const [quote, setQuote] = useState<QuoteRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, 'quotes', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQuote({ id: docSnap.id, ...docSnap.data() } as QuoteRequest);
        } else {
          setError('Quote not found');
        }
      } catch (err) {
        setError('Error loading quote details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuote();
  }, [id]);

  const handleStatusChange = async (newStatus: QuoteStatus) => {
    if (!id || !quote) return;
    try {
      const docRef = doc(db, 'quotes', id);
      await updateDoc(docRef, { status: newStatus });
      setQuote({ ...quote, status: newStatus });
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error || !quote) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="pb-32">
      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <Link to="/admin/quotes" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-4">
            <ArrowLeft size={16} /> Back to Quotes
          </Link>
          <h1 className="font-serif text-3xl text-ink">Quote Request</h1>
          <p className="text-ink-muted text-sm mt-1">Submitted on {quote.createdAt ? new Date(quote.createdAt.toMillis()).toLocaleDateString() : 'Unknown'}</p>
        </div>
        
        <div className="flex items-center gap-3 bg-surface border border-border-subtle p-2 rounded-xl">
          <span className="text-xs uppercase tracking-widest font-semibold text-ink-muted pl-2">Status:</span>
          <select
            value={quote.status}
            onChange={(e) => handleStatusChange(e.target.value as QuoteStatus)}
            className="px-3 py-1.5 bg-zinc-100 rounded-lg text-sm font-semibold outline-none cursor-pointer"
          >
            {QUOTE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface p-6 rounded-2xl border border-border-subtle">
            <h3 className="font-serif text-xl mb-4 border-b border-border-subtle pb-4">Client Details</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="text-ink-muted mt-0.5"><Building size={16} /></div>
                <div>
                  <div className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-1">Name / Org</div>
                  <div className="font-medium text-ink">{quote.name}</div>
                  {quote.organisation && <div className="text-sm text-ink-muted">{quote.organisation}</div>}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="text-ink-muted mt-0.5"><Mail size={16} /></div>
                <div>
                  <div className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-1">Email</div>
                  <a href={`mailto:${quote.email}`} className="text-sm font-medium text-ink hover:underline">{quote.email}</a>
                </div>
              </li>
              {quote.phone && (
                <li className="flex items-start gap-3">
                  <div className="text-ink-muted mt-0.5"><Phone size={16} /></div>
                  <div>
                    <div className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-1">Phone</div>
                    <a href={`tel:${quote.phone}`} className="text-sm font-medium text-ink hover:underline">{quote.phone}</a>
                  </div>
                </li>
              )}
              {quote.location && (
                <li className="flex items-start gap-3">
                  <div className="text-ink-muted mt-0.5"><MapPin size={16} /></div>
                  <div>
                    <div className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-1">Location</div>
                    <div className="text-sm font-medium text-ink">{quote.location}</div>
                  </div>
                </li>
              )}
            </ul>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-border-subtle">
            <h3 className="font-serif text-xl mb-4 border-b border-border-subtle pb-4">Project Scope</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="text-ink-muted mt-0.5"><FileText size={16} /></div>
                <div>
                  <div className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-1">Service</div>
                  <div className="text-sm font-medium text-ink">{quote.service}</div>
                </div>
              </li>
              {quote.budgetRange && (
                <li className="flex items-start gap-3">
                  <div className="text-ink-muted mt-0.5"><DollarSign size={16} /></div>
                  <div>
                    <div className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-1">Budget</div>
                    <div className="text-sm font-medium text-ink">{quote.budgetRange}</div>
                  </div>
                </li>
              )}
              {quote.preferredDate && (
                <li className="flex items-start gap-3">
                  <div className="text-ink-muted mt-0.5"><Calendar size={16} /></div>
                  <div>
                    <div className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-1">Timeline</div>
                    <div className="text-sm font-medium text-ink">{quote.preferredDate}</div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border-subtle">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-4">Project Description</h3>
            <div className="prose prose-sm md:prose-base font-light text-ink-muted whitespace-pre-wrap leading-relaxed max-w-none">
              {quote.projectDescription}
            </div>
          </div>

          {quote.additionalRequirements && (
            <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border-subtle">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-4">Additional Requirements</h3>
              <div className="prose prose-sm md:prose-base font-light text-ink-muted whitespace-pre-wrap leading-relaxed max-w-none">
                {quote.additionalRequirements}
              </div>
            </div>
          )}

          {quote.fileUploadUrl && (
            <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border-subtle flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl text-ink">Supporting Document</h3>
                <p className="text-sm text-ink-muted mt-1 font-light">The client attached a brief or asset file.</p>
              </div>
              <a 
                href={quote.fileUploadUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-zinc-100 text-ink px-6 py-3 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
