import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { Plus, Edit2, Trash2, Search, X, Check, AlertCircle } from 'lucide-react';
import FileUpload from '../../components/FileUpload';

export interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'status';
  required?: boolean;
}

interface GenericAdminListProps {
  collectionName: string;
  title: string;
  description: string;
  fields: FieldDef[];
}

export default function GenericAdminList({
  collectionName,
  title,
  description,
  fields,
}: GenericAdminListProps) {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to real-time updates from Firestore
  useEffect(() => {
    setIsLoading(true);
    const unsub = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const liveItems = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Sort descending by createdAt or updatedAt if available
        liveItems.sort((a: any, b: any) => {
          const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return tB - tA;
        });
        setItems(liveItems);
        setIsLoading(false);
      },
      (err: any) => {
        console.error(`Error subscribing to ${collectionName}:`, err);
        setError(err.message || 'Failed to fetch items');
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, [collectionName]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.'))
      return;
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error: any) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item: ' + error.message);
    }
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        ...item,
        status: item.status || 'Active',
      });
    } else {
      setEditingId(null);
      const initialData: any = {};
      fields.forEach((f) => {
        if (f.type === 'boolean') initialData[f.name] = false;
        else if (f.type === 'number') initialData[f.name] = 0;
        else if (f.type === 'status') initialData[f.name] = 'Active';
        else initialData[f.name] = '';
      });
      setFormData(initialData);
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const cleanData: any = { ...formData };

      // Ensure status has a valid active default if left blank
      fields.forEach((f) => {
        if (f.type === 'status' && !cleanData[f.name]) {
          cleanData[f.name] = 'Active';
        }
      });

      if (editingId) {
        const docRef = doc(db, collectionName, editingId);
        await updateDoc(docRef, {
          ...cleanData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, collectionName), {
          ...cleanData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving:', err);
      setError(err.message || 'Failed to save item.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredItems = items.filter((item) =>
    fields.some((f) =>
      String(item[f.name] || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
  );

  const isMediaField = (fieldName: string) => {
    const lower = fieldName.toLowerCase();
    return (
      lower.includes('url') ||
      lower.includes('image') ||
      lower.includes('cover') ||
      lower.includes('file') ||
      lower.includes('storagepath')
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ink">{title}</h1>
          <p className="text-ink-muted text-sm mt-1">{description}</p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none text-sm"
            />
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="bg-ink text-canvas px-6 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <Plus size={18} />
            Add New
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-border-subtle text-xs uppercase tracking-widest text-ink-muted">
              <tr>
                {fields.slice(0, 4).map((f) => (
                  <th key={f.name} className="px-6 py-4 font-semibold">
                    {f.label}
                  </th>
                ))}
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-ink-muted">
                    Loading records...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-ink-muted mb-4">No records found.</p>
                    <button
                      onClick={() => handleOpenModal()}
                      className="text-sm font-medium border-b border-ink pb-1"
                    >
                      Create the first record
                    </button>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                    {fields.slice(0, 4).map((f) => (
                      <td key={f.name} className="px-6 py-4">
                        {f.type === 'boolean' ? (
                          item[f.name] ? (
                            <Check size={16} className="text-green-600" />
                          ) : (
                            <X size={16} className="text-zinc-300" />
                          )
                        ) : f.type === 'status' ? (
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              item[f.name] === 'Inactive' || item[f.name] === 'Draft'
                                ? 'bg-zinc-200 text-zinc-700'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {item[f.name] || 'Active'}
                          </span>
                        ) : isMediaField(f.name) && item[f.name] && typeof item[f.name] === 'string' && item[f.name].startsWith('http') ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={item[f.name]}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-zinc-100 border border-border-subtle"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <span className="truncate max-w-[180px] text-xs text-ink-muted">
                              {item[f.name]}
                            </span>
                          </div>
                        ) : (
                          <div className="truncate max-w-xs">{String(item[f.name] || '')}</div>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-ink-muted hover:text-ink transition-colors inline-block"
                        title="Edit"
                        aria-label="Edit record"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-ink-muted hover:text-red-600 transition-colors inline-block"
                        title="Delete"
                        aria-label="Delete record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl border border-border-subtle my-8">
            <div className="flex justify-between items-center p-6 border-b border-border-subtle sticky top-0 bg-surface rounded-t-2xl z-10">
              <h2 className="font-serif text-2xl text-ink">
                {editingId ? 'Edit Record' : 'Create Record'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-muted hover:text-ink transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-3">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-6">
                {fields.map((f) => (
                  <div key={f.name}>
                    {isMediaField(f.name) ? (
                      <FileUpload
                        label={f.label + (f.required ? ' *' : '')}
                        value={formData[f.name] || ''}
                        onChange={(url) => setFormData({ ...formData, [f.name]: url })}
                        folder={`public/${collectionName}`}
                        placeholder="https://... or upload file"
                        helpText="Upload a file or image from your computer/device or paste a link."
                      />
                    ) : f.type === 'textarea' ? (
                      <>
                        <label className="block text-sm font-medium text-ink mb-2">
                          {f.label} {f.required && '*'}
                        </label>
                        <textarea
                          required={f.required}
                          value={formData[f.name] || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, [f.name]: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none min-h-[140px]"
                        />
                      </>
                    ) : f.type === 'boolean' ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData[f.name] || false}
                          onChange={(e) =>
                            setFormData({ ...formData, [f.name]: e.target.checked })
                          }
                          className="w-5 h-5 accent-ink"
                        />
                        <label className="text-sm font-medium text-ink">
                          {f.label} {f.required && '*'}
                        </label>
                      </div>
                    ) : f.type === 'status' ? (
                      <>
                        <label className="block text-sm font-medium text-ink mb-2">
                          {f.label} {f.required && '*'}
                        </label>
                        <select
                          required={f.required}
                          value={formData[f.name] || 'Active'}
                          onChange={(e) =>
                            setFormData({ ...formData, [f.name]: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
                        >
                          <option value="Active">Active / Published (Visible on website)</option>
                          <option value="Inactive">Inactive / Hidden</option>
                        </select>
                      </>
                    ) : (
                      <>
                        <label className="block text-sm font-medium text-ink mb-2">
                          {f.label} {f.required && '*'}
                        </label>
                        <input
                          type={f.type}
                          required={f.required}
                          value={formData[f.name] || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [f.name]:
                                f.type === 'number' ? Number(e.target.value) : e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border-subtle flex justify-end gap-3 sticky bottom-0 bg-surface rounded-b-2xl pb-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-full text-sm font-medium text-ink bg-zinc-100 hover:bg-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 rounded-full text-sm font-medium text-canvas bg-ink hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
