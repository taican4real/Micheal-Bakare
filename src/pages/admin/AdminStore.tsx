import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Product } from '../../types';

export default function AdminStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Product[];

        data.sort((a, b) => {
          const tA = (a as any).createdAt?.toMillis ? (a as any).createdAt.toMillis() : 0;
          const tB = (b as any).createdAt?.toMillis ? (b as any).createdAt.toMillis() : 0;
          return tB - tA;
        });

        setProducts(data);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.'))
      return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ink">Store Management</h1>
          <p className="text-ink-muted text-sm mt-1">
            Manage digital products, masterclasses, and publications.
          </p>
        </div>
        <Link
          to="/admin/store/new"
          className="bg-ink text-canvas px-6 py-3 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Product
        </Link>
      </div>

      <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-ink-muted">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-ink-muted mb-4">No products have been added yet.</p>
            <Link to="/admin/store/new" className="text-sm font-medium border-b border-ink pb-1">
              Create your first product
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
                    Price
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
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-ink flex items-center gap-3">
                        {product.coverImageUrl && (
                          <img
                            src={product.coverImageUrl}
                            alt=""
                            className="w-10 h-10 object-cover rounded-md bg-zinc-100 border border-border-subtle"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        )}
                        <span>{product.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-muted">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-medium text-ink">
                      {product.currency} {(product.price || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {product.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        to={`/store/${product.id}`}
                        target="_blank"
                        className="text-ink-muted hover:text-ink transition-colors inline-block"
                        title="View Public Page"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <Link
                        to={`/admin/store/${product.id}/edit`}
                        className="text-ink-muted hover:text-ink transition-colors inline-block"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() => product.id && handleDelete(product.id)}
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
