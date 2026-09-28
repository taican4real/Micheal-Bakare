import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ExternalLink, Search } from 'lucide-react';
import { QuoteRequest, QUOTE_STATUSES, QuoteStatus } from '../../types';

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<QuoteStatus | 'ALL'>('ALL');

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as QuoteRequest[];
      setQuotes(data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleStatusChange = async (id: string, newStatus: QuoteStatus) => {
    try {
      const docRef = doc(db, 'quotes', id);
      await updateDoc(docRef, { status: newStatus });
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesFilter = activeFilter === 'ALL' || quote.status === activeFilter;
    const matchesSearch = !searchQuery || 
      quote.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      quote.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.organisation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'REVIEWING': return 'bg-purple-100 text-purple-800';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800';
      case 'QUOTED': return 'bg-indigo-100 text-indigo-800';
      case 'ACCEPTED': return 'bg-emerald-100 text-emerald-800';
      case 'DECLINED': return 'bg-zinc-100 text-zinc-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-zinc-100 text-zinc-800';
    }
  };

  return (
    <div className="pb-32">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Quote Requests</h1>
        <p className="text-ink-muted text-sm mt-1">Manage incoming service inquiries and track their status.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
          <input 
            type="text"
            placeholder="Search by name, email, or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-surface border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none text-sm"
          />
        </div>
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value as QuoteStatus | 'ALL')}
          className="px-4 py-3 bg-surface border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none text-sm"
        >
          <option value="ALL">All Statuses</option>
          {QUOTE_STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-ink-muted">Loading quotes...</div>
        ) : filteredQuotes.length === 0 ? (
          <div className="p-12 text-center text-ink-muted">
            No quote requests found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-zinc-50">
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold text-ink-muted">Date</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold text-ink-muted">Client</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold text-ink-muted">Service</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold text-ink-muted">Status</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold text-ink-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-ink-muted">
                      {quote.createdAt ? new Date(quote.createdAt.toMillis()).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-ink">{quote.name}</div>
                      <div className="text-xs text-ink-muted mt-1">{quote.organisation || quote.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-muted">{quote.service}</td>
                    <td className="px-6 py-4">
                      <select
                        value={quote.status}
                        onChange={(e) => handleStatusChange(quote.id!, e.target.value as QuoteStatus)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest appearance-none outline-none cursor-pointer ${getStatusColor(quote.status)}`}
                      >
                        {QUOTE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/admin/quotes/${quote.id}`} className="text-ink-muted hover:text-ink transition-colors inline-block" title="View Details">
                        <ExternalLink size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
