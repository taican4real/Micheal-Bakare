import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Service } from '../../types';

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'services'),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Service[];

        data.sort((a, b) => {
          const tA = (a as any).createdAt?.toMillis ? (a as any).createdAt.toMillis() : 0;
          const tB = (b as any).createdAt?.toMillis ? (b as any).createdAt.toMillis() : 0;
          return tB - tA;
        });

        setServices(data);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching services:', error);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ink">Services Management</h1>
          <p className="text-ink-muted text-sm mt-1">
            Manage your professional service offerings.
          </p>
        </div>
        <Link
          to="/admin/services/new"
          className="bg-ink text-canvas px-6 py-3 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Service
        </Link>
      </div>

      <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-ink-muted">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-ink-muted mb-4">No services have been added yet.</p>
            <Link
              to="/admin/services/new"
              className="text-sm font-medium border-b border-ink pb-1"
            >
              Create your first service
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
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-semibold text-ink-muted text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-ink flex items-center gap-3">
                        {service.coverImageUrl && (
                          <img
                            src={service.coverImageUrl}
                            alt=""
                            className="w-10 h-10 object-cover rounded-md bg-zinc-100 border border-border-subtle"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        )}
                        <span>{service.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-muted">{service.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          service.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {service.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        to="/services"
                        target="_blank"
                        className="text-ink-muted hover:text-ink transition-colors inline-block"
                        title="View Public Page"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <Link
                        to={`/admin/services/${service.id}/edit`}
                        className="text-ink-muted hover:text-ink transition-colors inline-block"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() => service.id && handleDelete(service.id)}
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
