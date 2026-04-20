'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import UploadField from '@/components/admin/UploadField';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

type AdminProduct = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
  addToHome: boolean;
};

type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  products: AdminProduct[];
};

type ProductForm = {
  id?: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
};

const emptyForm: ProductForm = {
  categoryId: '',
  name: '',
  description: '',
  imageUrl: '',
};

export default function ProductManagementAdmin() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productForm, setProductForm] = useState<ProductForm>(emptyForm);
  const [pendingDelete, setPendingDelete] = useState<
    | { kind: 'product'; id: string }
    | { kind: 'category'; id: string }
    | null
  >(null);

  const editingProduct = useMemo(() => Boolean(productForm.id), [productForm.id]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/products');
      if (!response.ok) {
        throw new Error('Failed to load products');
      }
      const data = (await response.json()) as AdminCategory[];
      setCategories(data || []);
    } catch {
      setError('Failed to load product categories.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateProduct = (categoryId: string) => {
    setProductForm({ ...emptyForm, categoryId });
    setIsModalOpen(true);
  };

  const openEditProduct = (product: AdminProduct) => {
    setProductForm({
      id: product.id,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductForm(emptyForm);
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      setError('Category name is required.');
      return;
    }

    setError('');
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'createCategory', name }),
    });

    if (!response.ok) {
      setError('Failed to create category.');
      return;
    }

    setNewCategoryName('');
    loadData();
  };

  const handleSaveProduct = async () => {
    if (!productForm.categoryId || !productForm.name.trim() || !productForm.description.trim() || !productForm.imageUrl.trim()) {
      setError('Please provide image, name and description.');
      return;
    }

    setIsSavingProduct(true);
    setError('');

    const method = editingProduct ? 'PUT' : 'POST';
    const body = editingProduct
      ? {
          id: productForm.id,
          categoryId: productForm.categoryId,
          name: productForm.name,
          description: productForm.description,
          imageUrl: productForm.imageUrl,
        }
      : {
          action: 'createProduct',
          categoryId: productForm.categoryId,
          name: productForm.name,
          description: productForm.description,
          imageUrl: productForm.imageUrl,
        };

    const response = await fetch('/api/admin/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setIsSavingProduct(false);

    if (!response.ok) {
      setError(editingProduct ? 'Failed to update product.' : 'Failed to create product.');
      return;
    }

    closeModal();
    loadData();
  };

  const handleToggleHome = async (product: AdminProduct) => {
    const response = await fetch('/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'toggleHome',
        id: product.id,
        addToHome: !product.addToHome,
      }),
    });

    if (!response.ok) {
      setError('Failed to update homepage status.');
      return;
    }

    loadData();
  };

  const handleDeleteProduct = async (productId: string) => {
    const response = await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: productId }),
    });

    if (!response.ok) {
      setError('Failed to delete product.');
      return;
    }

    loadData();
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const response = await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteCategory', id: categoryId }),
    });

    if (!response.ok) {
      setError('Failed to delete category.');
      return;
    }

    loadData();
  };

  const requestDeleteProduct = (productId: string) => {
    setPendingDelete({ kind: 'product', id: productId });
  };

  const requestDeleteCategory = (categoryId: string) => {
    setPendingDelete({ kind: 'category', id: categoryId });
  };

  const cancelDelete = () => {
    setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    if (pendingDelete.kind === 'category') {
      await handleDeleteCategory(pendingDelete.id);
    } else {
      await handleDeleteProduct(pendingDelete.id);
    }

    setPendingDelete(null);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Product Management"
        description="Create categories, add products inside each category, and control homepage visibility."
      />

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            placeholder="Category name"
            className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleCreateCategory}
            className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Add New Category
          </button>
        </div>
      </div>

      {isLoading && <p className="text-sm text-gray-600">Loading categories...</p>}

      {!isLoading && categories.length === 0 && (
        <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-gray-600">
          No categories yet. Use Add New Category to start.
        </p>
      )}

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-playfair font-semibold text-primary">{category.name}</h2>
                <p className="text-xs text-slate-500">{category.products.length} product(s)</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openCreateProduct(category.id)}
                  disabled={category.id === 'uncategorized'}
                  className="rounded-sm bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add New Product
                </button>
                <button
                  type="button"
                  onClick={() => requestDeleteCategory(category.id)}
                  disabled={category.id === 'uncategorized'}
                  className="rounded-sm border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete Category
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {category.products.map((product) => (
                <div key={product.id} className="rounded-md border border-slate-200 p-2">
                  <div className="relative mb-2 h-28 overflow-hidden rounded-sm bg-slate-100">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-primary">{product.name}</h3>
                  <p className="mt-1 text-xs text-slate-600">{product.description}</p>

                  <button
                    type="button"
                    onClick={() => handleToggleHome(product)}
                    className={`mt-2 w-full rounded-sm px-2 py-1.5 text-[11px] font-medium text-white ${
                      product.addToHome ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {product.addToHome ? 'Delete From Home' : 'Add To Home'}
                  </button>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditProduct(product)}
                      className="flex-1 rounded-sm border border-slate-300 px-2 py-1.5 text-[11px] font-medium text-primary hover:border-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => requestDeleteProduct(product.id)}
                      className="flex-1 rounded-sm border border-red-200 px-2 py-1.5 text-[11px] font-medium text-red-600 hover:border-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-lg bg-white p-5 shadow-xl">
            <h2 className="text-xl font-playfair font-semibold text-primary">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary">Category</label>
                <select
                  value={productForm.categoryId}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      categoryId: event.target.value,
                    }))
                  }
                  className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <UploadField
                label="Product Photo"
                value={productForm.imageUrl}
                folder="products"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={(url) =>
                  setProductForm((prev) => ({
                    ...prev,
                    imageUrl: url,
                  }))
                }
              />

              {productForm.imageUrl && (
                <div className="relative h-28 w-40 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                  <Image
                    src={productForm.imageUrl}
                    alt="Product preview"
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary">Product Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-medium text-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProduct}
                disabled={isSavingProduct}
                className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60"
              >
                {isSavingProduct ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title={pendingDelete?.kind === 'category' ? 'Delete Category' : 'Delete Product'}
        message={
          pendingDelete?.kind === 'category'
            ? 'Are you sure you want to delete this category and all products inside it?'
            : 'Are you sure you want to delete this product?'
        }
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
