import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, doc, getDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Service } from '../../types';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileUpload from '../../components/FileUpload';

export default function AdminServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    category: 'Consulting',
    coverImageUrl: '',
    deliverables: [],
    requirements: [],
    faqs: [],
    seoTitle: '',
    seoDescription: '',
    status: 'active', // Default to active so newly added services appear on the site immediately
  });

  useEffect(() => {
    if (isEditing && id) {
      const fetchService = async () => {
        try {
          const docRef = doc(db, 'services', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData({
              ...docSnap.data(),
              deliverables: docSnap.data().deliverables || [],
              requirements: docSnap.data().requirements || [],
              faqs: docSnap.data().faqs || [],
              status: docSnap.data().status || 'active',
            } as Partial<Service>);
          } else {
            setError('Service not found');
          }
        } catch (err: any) {
          setError('Error fetching service details: ' + (err.message || ''));
        } finally {
          setIsLoading(false);
        }
      };
      fetchService();
    }
  }, [id, isEditing]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    field: 'deliverables' | 'requirements',
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const arr = [...(prev[field] || [])];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field: 'deliverables' | 'requirements') => {
    setFormData((prev) => ({ ...prev, [field]: [...(prev[field] || []), ''] }));
  };

  const removeArrayItem = (field: 'deliverables' | 'requirements', index: number) => {
    setFormData((prev) => {
      const arr = [...(prev[field] || [])];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData((prev) => {
      const faqs = [...(prev.faqs || [])];
      faqs[index] = { ...faqs[index], [field]: value };
      return { ...prev, faqs };
    });
  };

  const addFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: '', answer: '' }],
    }));
  };

  const removeFaq = (index: number) => {
    setFormData((prev) => {
      const faqs = [...(prev.faqs || [])];
      faqs.splice(index, 1);
      return { ...prev, faqs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const cleanData = {
        ...formData,
        deliverables: formData.deliverables?.filter((d) => d.trim() !== '') || [],
        requirements: formData.requirements?.filter((r) => r.trim() !== '') || [],
        faqs: formData.faqs?.filter((f) => f.question.trim() !== '') || [],
      };

      if (isEditing && id) {
        const docRef = doc(db, 'services', id);
        await updateDoc(docRef, {
          ...cleanData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'services'), {
          ...cleanData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      navigate('/admin/services');
    } catch (err: any) {
      console.error('Error saving service:', err);
      setError(err.message || 'An error occurred saving the service');
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/admin/services"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-4"
        >
          <ArrowLeft size={16} /> Back to Services
        </Link>
        <h1 className="font-serif text-3xl text-ink">
          {isEditing ? 'Edit Service' : 'Add New Service'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border-subtle space-y-6">
          <h2 className="font-serif text-xl border-b border-border-subtle pb-4 mb-4">Core Info</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-ink mb-2">Title *</label>
              <input
                required
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Category *</label>
              <input
                required
                name="category"
                value={formData.category || 'Consulting'}
                onChange={handleInputChange}
                placeholder="e.g. Consulting, Composition, Direction"
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <FileUpload
                label="Cover Image"
                value={formData.coverImageUrl || ''}
                onChange={(url) => setFormData((prev) => ({ ...prev, coverImageUrl: url }))}
                folder="public/services"
                placeholder="https://... or upload service banner"
                helpText="Upload a featured image from your device or paste an image link."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-ink mb-2">Description</label>
              <div className="bg-zinc-50 rounded-xl overflow-hidden [&_.ql-container]:min-h-[200px] [&_.ql-container]:text-base [&_.ql-container]:font-sans [&_.ql-editor]:min-h-[200px] [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-border-subtle [&_.ql-container]:border-x-0 [&_.ql-container]:border-b-0 [&_.ql-container]:border-border-subtle border border-border-subtle focus-within:ring-2 focus-within:ring-ink transition-shadow">
                <ReactQuill
                  theme="snow"
                  value={formData.description || ''}
                  onChange={(val) => setFormData({ ...formData, description: val })}
                  modules={{
                    toolbar: [
                      [{ header: [2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link', 'clean'],
                    ],
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Deliverables */}
        <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
            <h2 className="font-serif text-xl">Deliverables</h2>
            <button
              type="button"
              onClick={() => addArrayItem('deliverables')}
              className="text-xs font-semibold uppercase tracking-widest text-ink hover:text-ink-muted flex items-center gap-1"
            >
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {formData.deliverables?.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <input
                  value={item}
                  onChange={(e) => handleArrayChange('deliverables', idx, e.target.value)}
                  className="flex-1 px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none text-sm"
                  placeholder="e.g. 1-hour strategy session"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('deliverables', idx)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
            <h2 className="font-serif text-xl">FAQs</h2>
            <button
              type="button"
              onClick={addFaq}
              className="text-xs font-semibold uppercase tracking-widest text-ink hover:text-ink-muted flex items-center gap-1"
            >
              <Plus size={14} /> Add FAQ
            </button>
          </div>
          <div className="space-y-6">
            {formData.faqs?.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 bg-zinc-50 border border-border-subtle rounded-xl flex gap-4 items-start"
              >
                <div className="flex-1 space-y-3">
                  <input
                    value={faq.question}
                    onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none text-sm font-medium"
                    placeholder="Question"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none text-sm resize-none"
                    placeholder="Answer"
                    rows={2}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFaq(idx)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Publication */}
        <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border-subtle space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Status</label>
              <select
                name="status"
                value={formData.status || 'active'}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            to="/admin/services"
            className="px-6 py-3 rounded-full font-medium text-ink hover:bg-zinc-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-ink text-canvas px-8 py-3 rounded-full font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Service'}
          </button>
        </div>
      </form>
    </div>
  );
}
