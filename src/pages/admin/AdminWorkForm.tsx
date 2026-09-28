import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, doc, getDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { WORK_CATEGORIES, PortfolioWork, WorkLink } from '../../types';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileUpload from '../../components/FileUpload';

export default function AdminWorkForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<PortfolioWork>>({
    title: '',
    description: '',
    year: new Date().getFullYear().toString(),
    category: WORK_CATEGORIES[0],
    role: '',
    collaborators: '',
    coverImageUrl: '',
    gallery: [],
    videoUrl: '',
    audioMetadata: '',
    externalLinks: [],
    relatedWorks: [],
    seoTitle: '',
    seoDescription: '',
    status: 'published', // Defaults to published so it appears on the website immediately
  });

  useEffect(() => {
    if (isEditing && id) {
      const fetchWork = async () => {
        try {
          const docRef = doc(db, 'portfolio', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              ...data,
              category: data.category || data.type || WORK_CATEGORIES[0],
              gallery: data.gallery || [],
              externalLinks: data.externalLinks || [],
              status: data.status || 'published',
            });
          } else {
            setError('Work not found');
          }
        } catch (err: any) {
          setError('Error fetching work details: ' + (err.message || ''));
        } finally {
          setIsLoading(false);
        }
      };
      fetchWork();
    }
  }, [id, isEditing]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLink = () => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: [...(prev.externalLinks || []), { title: '', url: '' }],
    }));
  };

  const handleUpdateLink = (index: number, field: keyof WorkLink, value: string) => {
    setFormData((prev) => {
      const links = [...(prev.externalLinks || [])];
      links[index] = { ...links[index], [field]: value };
      return { ...prev, externalLinks: links };
    });
  };

  const handleRemoveLink = (index: number) => {
    setFormData((prev) => {
      const links = [...(prev.externalLinks || [])];
      links.splice(index, 1);
      return { ...prev, externalLinks: links };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (isEditing && id) {
        const docRef = doc(db, 'portfolio', id);
        await updateDoc(docRef, {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'portfolio'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      navigate('/admin/works');
    } catch (err: any) {
      console.error('Error saving work:', err);
      setError(err.message || 'An error occurred saving the work');
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/admin/works"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-4"
        >
          <ArrowLeft size={16} /> Back to Works
        </Link>
        <h1 className="font-serif text-3xl text-ink">
          {isEditing ? 'Edit Work' : 'Add New Work'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border-subtle space-y-6">
          <h2 className="font-serif text-xl border-b border-border-subtle pb-4 mb-4">
            Basic Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-ink mb-2">Title *</label>
              <input
                required
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Category *</label>
              <select
                name="category"
                value={formData.category || WORK_CATEGORIES[0]}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
              >
                {WORK_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Year / Date</label>
              <input
                name="year"
                value={formData.year || ''}
                onChange={handleInputChange}
                placeholder="e.g. 2024"
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Role</label>
              <input
                name="role"
                value={formData.role || ''}
                onChange={handleInputChange}
                placeholder="e.g. Composer, Creative Director"
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Collaborators</label>
              <input
                name="collaborators"
                value={formData.collaborators || ''}
                onChange={handleInputChange}
                placeholder="e.g. London Symphony Orchestra"
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
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

        <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border-subtle space-y-6">
          <h2 className="font-serif text-xl border-b border-border-subtle pb-4 mb-4">
            Media & Links
          </h2>

          <div>
            <FileUpload
              label="Cover Image"
              value={formData.coverImageUrl || ''}
              onChange={(url) => setFormData((prev) => ({ ...prev, coverImageUrl: url }))}
              folder="public/works"
              placeholder="https://... or upload image"
              helpText="Upload an image from your device or paste an image URL. Visible on homepage and archive."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Video Embed URL</label>
            <input
              name="videoUrl"
              value={formData.videoUrl || ''}
              onChange={handleInputChange}
              placeholder="YouTube or Vimeo Embed URL"
              className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Audio Metadata / Stream</label>
            <input
              name="audioMetadata"
              value={formData.audioMetadata || ''}
              onChange={handleInputChange}
              placeholder="Duration, format, or stream link"
              className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-ink">External Links</label>
              <button
                type="button"
                onClick={handleAddLink}
                className="text-xs font-semibold uppercase tracking-widest text-ink hover:text-ink-muted flex items-center gap-1"
              >
                <Plus size={14} /> Add Link
              </button>
            </div>
            {formData.externalLinks?.map((link, idx) => (
              <div key={idx} className="flex gap-4 mb-4 items-start">
                <input
                  placeholder="Link Title (e.g. Read Article)"
                  value={link.title}
                  onChange={(e) => handleUpdateLink(idx, 'title', e.target.value)}
                  className="flex-1 px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none text-sm"
                />
                <input
                  placeholder="URL (https://...)"
                  value={link.url}
                  onChange={(e) => handleUpdateLink(idx, 'url', e.target.value)}
                  className="flex-2 w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveLink(idx)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border-subtle space-y-6">
          <h2 className="font-serif text-xl border-b border-border-subtle pb-4 mb-4">
            Publication Status
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Status</label>
              <select
                name="status"
                value={formData.status || 'published'}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
              >
                <option value="published">Published (Visible on site)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            to="/admin/works"
            className="px-6 py-3 rounded-full font-medium text-ink hover:bg-zinc-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-ink text-canvas px-8 py-3 rounded-full font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Work'}
          </button>
        </div>
      </form>
    </div>
  );
}
