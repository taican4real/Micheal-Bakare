import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, doc, getDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Product, PRODUCT_CATEGORIES } from '../../types';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import FileUpload from '../../components/FileUpload';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    description: '',
    price: 0,
    currency: 'USD',
    category: PRODUCT_CATEGORIES[0],
    coverImageUrl: '',
    features: [],
    previewUrl: '',
    metadata: {},
    storagePath: '',
    selarPaymentUrl: '',
    status: 'active', // Default to active so products are immediately visible on the store
  });

  const [metadataEntries, setMetadataEntries] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    if (isEditing && id) {
      const fetchProduct = async () => {
        try {
          const docRef = doc(db, 'products', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Product;
            setFormData({
              ...data,
              features: data.features || [],
              previewUrl: data.previewUrl || '',
              status: data.status || 'active',
            });
            if (data.metadata) {
              setMetadataEntries(
                Object.entries(data.metadata).map(([k, v]) => ({ key: k, value: v as string }))
              );
            }
          } else {
            setError('Product not found');
          }
        } catch (err: any) {
          setError('Error fetching product details: ' + (err.message || ''));
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...(prev.features || []), ''] }));
  };

  const handleUpdateFeature = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures.splice(index, 1);
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleAddMetadata = () => {
    setMetadataEntries((prev) => [...prev, { key: '', value: '' }]);
  };

  const handleUpdateMetadata = (index: number, field: 'key' | 'value', val: string) => {
    const newEntries = [...metadataEntries];
    newEntries[index][field] = val;
    setMetadataEntries(newEntries);
  };

  const handleRemoveMetadata = (index: number) => {
    const newEntries = [...metadataEntries];
    newEntries.splice(index, 1);
    setMetadataEntries(newEntries);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const metadataObj: Record<string, string> = {};
      metadataEntries.forEach((entry) => {
        if (entry.key.trim() && entry.value.trim()) {
          metadataObj[entry.key.trim()] = entry.value.trim();
        }
      });

      const cleanData = {
        ...formData,
        price: Number(formData.price),
        features: formData.features?.filter((f) => f.trim() !== '') || [],
        metadata: metadataObj,
      };

      if (isEditing && id) {
        const docRef = doc(db, 'products', id);
        await updateDoc(docRef, {
          ...cleanData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'products'), {
          ...cleanData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      navigate('/admin/store');
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError(err.message || 'An error occurred saving the product');
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/admin/store"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-4"
        >
          <ArrowLeft size={16} /> Back to Store
        </Link>
        <h1 className="font-serif text-3xl text-ink">
          {isEditing ? 'Edit Product' : 'Add New Product'}
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
            Basic Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-ink mb-2">Product Title *</label>
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
              <select
                name="category"
                value={formData.category || PRODUCT_CATEGORIES[0]}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <FileUpload
                label="Cover Image"
                value={formData.coverImageUrl || ''}
                onChange={(url) => setFormData((prev) => ({ ...prev, coverImageUrl: url }))}
                folder="public/products"
                placeholder="https://... or upload product cover"
                helpText="Upload an image from your device or paste an image URL. Visible on store catalog."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-ink mb-2">Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border-subtle space-y-6">
          <h2 className="font-serif text-xl border-b border-border-subtle pb-4 mb-4">
            Pricing & Digital Delivery
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Price *</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price !== undefined ? formData.price : 0}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">Currency</label>
              <select
                name="currency"
                value={formData.currency || 'USD'}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
                <option value="NGN">NGN (₦)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-ink mb-2">Preview URL (Optional)</label>
              <p className="text-xs text-ink-muted mb-2 font-light">
                A link to a preview audio snippet or sample PDF.
              </p>
              <input
                name="previewUrl"
                value={formData.previewUrl || ''}
                onChange={handleInputChange}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-ink mb-2">Selar Payment URL</label>
              <p className="text-xs text-ink-muted mb-2 font-light">
                Direct checkout link for this product on Selar (e.g., https://selar.co/m/product-name)
              </p>
              <input
                name="selarPaymentUrl"
                value={formData.selarPaymentUrl || ''}
                onChange={handleInputChange}
                placeholder="https://selar.co/m/..."
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <FileUpload
                label="Secure Digital Asset File (PDF, ZIP, Audio, Stems)"
                value={formData.storagePath || ''}
                onChange={(url) => setFormData((prev) => ({ ...prev, storagePath: url }))}
                folder="digital_products"
                accept="*"
                placeholder="digital_products/... or upload master file"
                helpText="Upload the deliverable digital product file to cloud storage or specify path."
              />
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
            <h2 className="font-serif text-xl">Metadata (Specs)</h2>
            <button
              type="button"
              onClick={handleAddMetadata}
              className="text-xs font-semibold uppercase tracking-widest text-ink hover:text-ink-muted flex items-center gap-1"
            >
              <Plus size={14} /> Add Stat
            </button>
          </div>

          <div className="space-y-3">
            {metadataEntries.length === 0 && (
              <p className="text-sm text-ink-muted font-light italic">
                No metadata added yet. (e.g. Format: PDF, Pages: 42)
              </p>
            )}
            {metadataEntries.map((entry, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <input
                  placeholder="Key (e.g. Format)"
                  value={entry.key}
                  onChange={(e) => handleUpdateMetadata(idx, 'key', e.target.value)}
                  className="w-1/3 px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none text-sm"
                />
                <input
                  placeholder="Value (e.g. MP3 / 320kbps)"
                  value={entry.value}
                  onChange={(e) => handleUpdateMetadata(idx, 'value', e.target.value)}
                  className="flex-1 px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMetadata(idx)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
            <h2 className="font-serif text-xl">Key Features / Table of Contents</h2>
            <button
              type="button"
              onClick={handleAddFeature}
              className="text-xs font-semibold uppercase tracking-widest text-ink hover:text-ink-muted flex items-center gap-1"
            >
              <Plus size={14} /> Add Feature
            </button>
          </div>

          <div className="space-y-3">
            {formData.features?.length === 0 && (
              <p className="text-sm text-ink-muted font-light italic">No features added yet.</p>
            )}
            {formData.features?.map((feature, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <input
                  placeholder="e.g. 50+ Pages of advanced theory"
                  value={feature}
                  onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                  className="flex-1 px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
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
                value={formData.status || 'active'}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-50 border border-border-subtle rounded-xl focus:ring-2 focus:ring-ink outline-none"
              >
                <option value="active">Active (Visible in Store)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            to="/admin/store"
            className="px-6 py-3 rounded-full font-medium text-ink hover:bg-zinc-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-ink text-canvas px-8 py-3 rounded-full font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
