import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { PortfolioWork } from '../../types';

export default function AdminWorks() {
  const [works, setWorks] = useState<PortfolioWork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'portfolio'),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as PortfolioWork[];

        // Sort descending by release year or creation time
        data.sort((a, b) => {
          const tA = (a as any).createdAt?.toMillis ? (a as any).createdAt.toMillis() : 0;
          const tB = (b as any).createdAt?.toMillis ? (b as any).createdAt.toMillis() : 0;
          if (tB !== tA) return tB - tA;
          return Number(b.year || 0) - Number(a.year || 0);
        });

        setWorks(data);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching works:', error);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this work? This action cannot be undone.'))
      return;
    try {
      await deleteDoc(doc(db, 'portfolio', id));
    } catch (error) {
      console.error('Error deleting work:', error);
      alert('Failed to delete work.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ink">Works & Legacy</h1>
          <p className="text-ink-muted text-sm mt-1">
            Manage portfolio projects, compositions, and publications.
          </p>
        </div>
        <Link
          to="/admin/works/new"
          className="bg-ink text-canvas px-6 py-3 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Work
        </Link>
      </div>

      <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-ink-muted">Loading works...</div>
        ) : works.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-ink-muted mb-4">No works have been added yet.</p>
            <Link to="/admin/works/new" className="text-sm font-medium border-b border-ink pb-1">
              Create the first work
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-zinc-50">
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold text-ink-muted">
                    Title
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold text-ink-muted">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold text-ink-muted">
                    Year
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold text-ink-muted">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold text-ink-muted text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {works.map((work) => (
                  <tr key={work.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-ink flex items-center gap-3">
                        {work.coverImageUrl && (
                          <img
                            src={work.coverImageUrl}
                            alt=""
                            className="w-10 h-10 object-cover rounded-md bg-zinc-100 border border-border-subtle"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div>{work.title}</div>
                          {work.role && (
                            <div className="text-xs text-ink-muted font-light">{work.role}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-muted">
                      {work.category || work.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-muted">{work.year}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          work.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {work.status || 'published'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        to={`/works/${work.id}`}
                        target="_blank"
                        className="text-ink-muted hover:text-ink transition-colors inline-block"
                        title="View Public Page"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <Link
                        to={`/admin/works/${work.id}/edit`}
                        className="text-ink-muted hover:text-ink transition-colors inline-block"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() => work.id && handleDelete(work.id)}
                        className="text-ink-muted hover:text-red-600 transition-colors inline-block"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
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
