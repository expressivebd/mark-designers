'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import UploadField from '@/components/admin/UploadField';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

// ─── Types ───────────────────────────────────────────────────────────────────

type AdminGender = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
};

type AdminProduct = {
  id: string;
  categoryId: string;
  genderId: string;
  name: string;
  description: string;
  imageUrl: string;
  addToHome: boolean;
};

type DetailItem = { photoUrl: string; text: string };
type CategoryDetails = { thumbnailUrl: string; details: DetailItem[] };

type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  products: AdminProduct[];
  categoryDetails?: CategoryDetails | null;
};

type ProductForm = {
  id?: string;
  categoryId: string;
  genderId: string;
  name: string;
  description: string;
  imageUrl: string;
};

type DetailsForm = {
  categoryId: string;
  thumbnailUrl: string;
  details: DetailItem[];
};

type PendingDelete =
  | { kind: 'product'; id: string }
  | { kind: 'category'; id: string }
  | { kind: 'categoryDetails'; categoryId: string }
  | { kind: 'gender'; id: string }
  | null;

// ─── Constants ───────────────────────────────────────────────────────────────

const emptyProductForm: ProductForm = { categoryId: '', genderId: '', name: '', description: '', imageUrl: '' };
const emptyGenderForm = { name: '', imageUrl: '' };
const MAX_DETAILS = 4;

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProductManagementAdmin() {
  // Data
  const [genders, setGenders] = useState<AdminGender[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Gender section
  const [isGenderOpen, setIsGenderOpen] = useState(true);
  const [isGenderModalOpen, setIsGenderModalOpen] = useState(false);
  const [editingGenderId, setEditingGenderId] = useState<string | null>(null);
  const [genderForm, setGenderForm] = useState(emptyGenderForm);
  const [isSavingGender, setIsSavingGender] = useState(false);

  // Category section
  const [newCategoryName, setNewCategoryName] = useState('');

  // Product modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);
  const [productModalCtx, setProductModalCtx] = useState({ categoryName: '', genderName: '' });

  // Category details form
  const [detailsForm, setDetailsForm] = useState<DetailsForm | null>(null);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [editingDetailIndex, setEditingDetailIndex] = useState<number | null>(null);
  const [changingThumbnailFor, setChangingThumbnailFor] = useState<string | null>(null);

  // Delete confirmation
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);

  // Publish
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastPublished, setLastPublished] = useState<string | null>(null);
  const [publishError, setPublishError] = useState('');

  const editingProduct = useMemo(() => Boolean(productForm.id), [productForm.id]);

  // ─── Data loading ──────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [gendersRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/genders'),
        fetch('/api/admin/products'),
      ]);
      if (!gendersRes.ok || !categoriesRes.ok) throw new Error('Failed to load');
      const [gendersData, categoriesData] = await Promise.all([
        gendersRes.json() as Promise<AdminGender[]>,
        categoriesRes.json() as Promise<AdminCategory[]>,
      ]);
      setGenders(gendersData || []);
      setCategories(categoriesData || []);
    } catch {
      setError('Failed to load data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ─── Gender handlers ───────────────────────────────────────────────────────

  const openAddGender = () => {
    setEditingGenderId(null);
    setGenderForm(emptyGenderForm);
    setIsGenderModalOpen(true);
  };

  const openEditGender = (gender: AdminGender) => {
    setEditingGenderId(gender.id);
    setGenderForm({ name: gender.name, imageUrl: gender.imageUrl });
    setIsGenderModalOpen(true);
  };

  const closeGenderModal = () => {
    setIsGenderModalOpen(false);
    setEditingGenderId(null);
    setGenderForm(emptyGenderForm);
  };

  const handleSaveGender = async () => {
    const name = genderForm.name.trim();
    if (!name) { setError('Gender name is required.'); return; }
    setIsSavingGender(true);
    setError('');
    const isEditing = Boolean(editingGenderId);
    const res = await fetch('/api/admin/genders', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        isEditing
          ? { id: editingGenderId, name, imageUrl: genderForm.imageUrl }
          : { name, imageUrl: genderForm.imageUrl }
      ),
    });
    setIsSavingGender(false);
    if (!res.ok) { setError(isEditing ? 'Failed to update gender.' : 'Failed to save gender.'); return; }
    closeGenderModal();
    loadData();
  };

  const handleDeleteGender = async (id: string) => {
    const res = await fetch('/api/admin/genders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) { setError('Failed to delete gender.'); return; }
    loadData();
  };

  // ─── Category handlers ─────────────────────────────────────────────────────

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) { setError('Category name is required.'); return; }
    setError('');
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'createCategory', name }),
    });
    if (!res.ok) { setError('Failed to create category.'); return; }
    setNewCategoryName('');
    loadData();
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const res = await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteCategory', id: categoryId }),
    });
    if (!res.ok) { setError('Failed to delete category.'); return; }
    loadData();
  };

  // ─── Product handlers ──────────────────────────────────────────────────────

  const openCreateProduct = (categoryId: string, genderId: string, categoryName: string, genderName: string) => {
    setProductForm({ ...emptyProductForm, categoryId, genderId });
    setProductModalCtx({ categoryName, genderName });
    setIsProductModalOpen(true);
  };

  const openEditProduct = (product: AdminProduct, categoryName: string, genderName: string) => {
    setProductForm({
      id: product.id,
      categoryId: product.categoryId,
      genderId: product.genderId,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
    });
    setProductModalCtx({ categoryName, genderName });
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setProductForm(emptyProductForm);
    setProductModalCtx({ categoryName: '', genderName: '' });
  };

  const handleSaveProduct = async () => {
    if (!productForm.name.trim() || !productForm.description.trim() || !productForm.imageUrl.trim()) {
      setError('Please provide image, name and description.');
      return;
    }
    setIsSavingProduct(true);
    setError('');
    const method = editingProduct ? 'PUT' : 'POST';
    const body = editingProduct
      ? { id: productForm.id, categoryId: productForm.categoryId, genderId: productForm.genderId, name: productForm.name, description: productForm.description, imageUrl: productForm.imageUrl }
      : { action: 'createProduct', categoryId: productForm.categoryId, genderId: productForm.genderId, name: productForm.name, description: productForm.description, imageUrl: productForm.imageUrl };
    const res = await fetch('/api/admin/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setIsSavingProduct(false);
    if (!res.ok) { setError(editingProduct ? 'Failed to update product.' : 'Failed to create product.'); return; }
    closeProductModal();
    loadData();
  };

  const handleDeleteProduct = async (productId: string) => {
    const res = await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: productId }),
    });
    if (!res.ok) { setError('Failed to delete product.'); return; }
    loadData();
  };

  const handleToggleHome = async (product: AdminProduct) => {
    const res = await fetch('/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggleHome', id: product.id, addToHome: !product.addToHome }),
    });
    if (!res.ok) { setError('Failed to update homepage status.'); return; }
    loadData();
  };

  // ─── Category details handlers ────────────────────────────────────────────

  const openDetailsForm = (category: AdminCategory) => {
    setDetailsForm({
      categoryId: category.id,
      thumbnailUrl: category.categoryDetails?.thumbnailUrl ?? '',
      details: category.categoryDetails?.details ? [...category.categoryDetails.details] : [],
    });
    setEditingDetailIndex(null);
  };

  const closeDetailsForm = () => { setDetailsForm(null); setEditingDetailIndex(null); };

  const addDetailItem = () => {
    if (!detailsForm || detailsForm.details.length >= MAX_DETAILS) return;
    const newIndex = detailsForm.details.length;
    setDetailsForm((prev) => prev ? { ...prev, details: [...prev.details, { photoUrl: '', text: '' }] } : prev);
    setEditingDetailIndex(newIndex);
  };

  const removeDetailItem = (index: number) => {
    setDetailsForm((prev) => prev ? { ...prev, details: prev.details.filter((_, i) => i !== index) } : prev);
    setEditingDetailIndex((prev) => {
      if (prev === null) return null;
      if (prev === index) return null;
      return prev > index ? prev - 1 : prev;
    });
  };

  const updateDetailItem = (index: number, field: keyof DetailItem, value: string) => {
    setDetailsForm((prev) => {
      if (!prev) return prev;
      const updated = [...prev.details];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, details: updated };
    });
  };

  const handleSaveDetails = async () => {
    if (!detailsForm) return;
    if (!detailsForm.thumbnailUrl.trim()) { setError('Thumbnail photo is required.'); return; }
    setIsSavingDetails(true);
    setError('');
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveCategoryDetails', categoryId: detailsForm.categoryId, thumbnailUrl: detailsForm.thumbnailUrl, details: detailsForm.details }),
    });
    setIsSavingDetails(false);
    if (!res.ok) { setError('Failed to save category details.'); return; }
    setDetailsForm(null);
    setEditingDetailIndex(null);
    loadData();
  };

  const handleDeleteCategoryDetails = async (categoryId: string) => {
    const res = await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteCategoryDetails', categoryId }),
    });
    if (!res.ok) { setError('Failed to delete category details.'); return; }
    loadData();
  };

  const handleChangeThumbnail = async (categoryId: string, thumbnailUrl: string, existingDetails: DetailItem[]) => {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveCategoryDetails', categoryId, thumbnailUrl, details: existingDetails }),
    });
    if (!res.ok) { setError('Failed to update thumbnail.'); return; }
    setChangingThumbnailFor(null);
    loadData();
  };

  // ─── Delete confirmation ──────────────────────────────────────────────────

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    if (pendingDelete.kind === 'gender') await handleDeleteGender(pendingDelete.id);
    else if (pendingDelete.kind === 'category') await handleDeleteCategory(pendingDelete.id);
    else if (pendingDelete.kind === 'product') await handleDeleteProduct(pendingDelete.id);
    else if (pendingDelete.kind === 'categoryDetails') await handleDeleteCategoryDetails(pendingDelete.categoryId);
    setPendingDelete(null);
  };

  // ─── Publish handler ──────────────────────────────────────────────────────

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishError('');
    try {
      const res = await fetch('/api/admin/revalidate', { method: 'POST' });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json() as { revalidatedAt?: string };
      setLastPublished(data.revalidatedAt ?? new Date().toISOString());
    } catch {
      setPublishError('Publish failed. Try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <AdminPageHeader
          title="Product Management"
          description="Manage genders, categories, and products."
        />
        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-primary-dark disabled:opacity-60"
          >
            {isPublishing ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Publishing…
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Publish Changes
              </>
            )}
          </button>
          {lastPublished && !publishError && (
            <p className="text-[11px] text-slate-500">
              Last published {new Date(lastPublished).toLocaleTimeString()}
            </p>
          )}
          {publishError && (
            <p className="text-[11px] text-red-500">{publishError}</p>
          )}
        </div>
      </div>

      {error && <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      {/* ── Gender Management ─────────────────────────────────────────────── */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-playfair font-semibold text-primary">Gender Management</h2>
            <p className="text-xs text-slate-500">{genders.length} gender(s) — shown as cards on the products page and in the navbar</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openAddGender}
              className="rounded-sm bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary-dark"
            >
              + Add Gender
            </button>
            <button
              type="button"
              onClick={() => setIsGenderOpen((v) => !v)}
              className="rounded-sm border border-slate-200 p-2 text-slate-500 hover:border-slate-400"
              aria-label={isGenderOpen ? 'Collapse' : 'Expand'}
            >
              <svg className={`h-4 w-4 transition-transform duration-200 ${isGenderOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {isGenderOpen && (
          <div className="p-5">
            {genders.length === 0 ? (
              <p className="text-sm text-slate-500">No genders yet. Click &ldquo;Add Gender&rdquo; to create one.</p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {genders.map((gender) => (
                  <div key={gender.id} className="relative w-36 rounded-lg border border-slate-200 overflow-hidden">
                    <div className="relative aspect-square bg-slate-100">
                      {gender.imageUrl ? (
                        <Image src={gender.imageUrl} alt={gender.name} fill className="object-cover" sizes="144px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No photo</div>
                      )}
                    </div>
                    <div className="p-2 text-center">
                      <p className="text-sm font-semibold text-primary">{gender.name}</p>
                      <p className="text-[10px] text-slate-400 mb-1">/{gender.slug}</p>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEditGender(gender)}
                          className="flex-1 rounded-sm border border-slate-200 px-2 py-1 text-[11px] font-medium text-primary hover:border-primary"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete({ kind: 'gender', id: gender.id })}
                          className="flex-1 rounded-sm border border-red-100 px-2 py-1 text-[11px] font-medium text-red-500 hover:border-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Category Management ───────────────────────────────────────────── */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-playfair font-semibold text-primary">Category Management</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreateCategory(); }}
            placeholder="Category name (e.g. Outerwear)"
            className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleCreateCategory}
            className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Add Category
          </button>
        </div>
      </div>

      {isLoading && <p className="text-sm text-slate-500">Loading...</p>}

      {!isLoading && categories.length === 0 && (
        <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
          No categories yet. Add one above.
        </p>
      )}

      {/* ── Category Cards ────────────────────────────────────────────────── */}
      <div className="space-y-6">
        {categories.map((category) => {
          const isEditingDetails = detailsForm?.categoryId === category.id;
          const hasDetails = Boolean(category.categoryDetails?.thumbnailUrl);

          return (
            <div key={category.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">

              {/* Category header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div>
                  <h3 className="text-xl font-playfair font-semibold text-primary">{category.name}</h3>
                  <p className="text-xs text-slate-500">{category.products.length} product(s)</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {!isEditingDetails && (
                    <button
                      type="button"
                      onClick={() => openDetailsForm(category)}
                      disabled={category.id === 'uncategorized'}
                      className="rounded-sm border border-slate-300 px-3 py-2 text-xs font-medium text-primary hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {hasDetails ? 'Edit Category Details' : 'Add Category Details'}
                    </button>
                  )}
                  {hasDetails && !isEditingDetails && (
                    <button
                      type="button"
                      onClick={() => setPendingDelete({ kind: 'categoryDetails', categoryId: category.id })}
                      className="rounded-sm border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:border-red-400"
                    >
                      Delete Details
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setPendingDelete({ kind: 'category', id: category.id })}
                    disabled={category.id === 'uncategorized'}
                    className="rounded-sm border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete Category
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Category Details inline form */}
                {isEditingDetails && detailsForm && (
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-4 text-sm font-semibold text-primary">Category Details</h4>
                    <UploadField
                      label="Thumbnail Photo"
                      value={detailsForm.thumbnailUrl}
                      folder="category-details"
                      onChange={(url) => setDetailsForm((prev) => prev ? { ...prev, thumbnailUrl: url } : prev)}
                    />
                    {detailsForm.thumbnailUrl && (
                      <div className="relative mt-2 h-16 w-24 overflow-hidden rounded-sm border border-slate-200 bg-slate-100">
                        <Image src={detailsForm.thumbnailUrl} alt="Thumbnail preview" fill className="object-cover" sizes="96px" />
                      </div>
                    )}
                    {detailsForm.details.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {detailsForm.details.map((item, index) =>
                          editingDetailIndex === index ? (
                            <div key={index} className="rounded-md border border-primary/30 bg-white p-3">
                              <div className="mb-3 flex items-center justify-between">
                                <span className="text-xs font-semibold text-primary">Detail {index + 1}</span>
                                <button type="button" onClick={() => setEditingDetailIndex(null)} className="rounded-sm bg-primary px-2 py-1 text-xs font-medium text-white hover:bg-primary-dark">Done</button>
                              </div>
                              <UploadField label="Photo" value={item.photoUrl} folder="category-details" onChange={(url) => updateDetailItem(index, 'photoUrl', url)} />
                              {item.photoUrl && (
                                <div className="relative mt-1 h-14 w-20 overflow-hidden rounded-sm border border-slate-200 bg-slate-100">
                                  <Image src={item.photoUrl} alt={`Detail ${index + 1}`} fill className="object-cover" sizes="80px" />
                                </div>
                              )}
                              <div className="mt-2 space-y-1">
                                <label className="block text-sm font-medium text-primary">Details Text</label>
                                <textarea value={item.text} onChange={(e) => updateDetailItem(index, 'text', e.target.value)} rows={3} placeholder="Enter detail text..." className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm" />
                              </div>
                            </div>
                          ) : (
                            <div key={index} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-2">
                              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-sm bg-slate-100">
                                {item.photoUrl ? <Image src={item.photoUrl} alt="" fill className="object-cover" sizes="48px" /> : <div className="flex h-full w-full items-center justify-center"><span className="text-[10px] text-slate-400">No photo</span></div>}
                              </div>
                              <p className="line-clamp-2 flex-1 text-xs text-slate-600">{item.text || '(no text)'}</p>
                              <div className="flex gap-1">
                                <button type="button" onClick={() => setEditingDetailIndex(index)} className="rounded-sm border border-slate-200 px-2 py-1 text-[11px] font-medium text-primary hover:border-primary">Edit</button>
                                <button type="button" onClick={() => removeDetailItem(index)} className="rounded-sm border border-red-100 px-2 py-1 text-[11px] font-medium text-red-500 hover:border-red-300">Remove</button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                    {detailsForm.details.length < MAX_DETAILS ? (
                      <button type="button" onClick={addDetailItem} className="mt-3 w-full rounded-sm border border-dashed border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 hover:border-primary hover:text-primary">+ Add Details</button>
                    ) : (
                      <p className="mt-3 text-center text-xs text-slate-500">Maximum {MAX_DETAILS} detail items reached.</p>
                    )}
                    <div className="mt-4 flex justify-end gap-2">
                      <button type="button" onClick={closeDetailsForm} className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-medium text-primary">Cancel</button>
                      <button type="button" onClick={handleSaveDetails} disabled={isSavingDetails} className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60">{isSavingDetails ? 'Saving...' : 'Save Details'}</button>
                    </div>
                  </div>
                )}

                {/* Details preview */}
                {!isEditingDetails && hasDetails && category.categoryDetails && (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Category Details Preview</p>
                    <div className="w-48 rounded-md border border-slate-200 p-2">
                      <div className="relative mb-2 h-28 overflow-hidden rounded-sm bg-slate-100">
                        <Image src={category.categoryDetails.thumbnailUrl} alt="Category thumbnail" fill className="object-cover" sizes="192px" />
                      </div>
                      <button type="button" onClick={() => setChangingThumbnailFor(changingThumbnailFor === category.id ? null : category.id)} className="mb-1 w-full rounded-sm border border-slate-200 px-2 py-1 text-[11px] font-medium text-primary hover:border-primary">
                        {changingThumbnailFor === category.id ? 'Cancel' : 'Change Thumbnail'}
                      </button>
                      {category.categoryDetails.details.map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 border-t border-slate-100 py-1">
                          <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-sm bg-slate-100">
                            {item.photoUrl && <Image src={item.photoUrl} alt="" fill className="object-cover" sizes="28px" />}
                          </div>
                          <p className="line-clamp-1 flex-1 text-[10px] leading-tight text-slate-600">{item.text || '—'}</p>
                        </div>
                      ))}
                    </div>
                    {changingThumbnailFor === category.id && (
                      <div className="mt-2 max-w-xs rounded-md border border-slate-200 bg-white p-3">
                        <UploadField label="Upload New Thumbnail" value="" folder="category-details" onChange={(url) => handleChangeThumbnail(category.id, url, category.categoryDetails!.details)} />
                      </div>
                    )}
                  </div>
                )}

                {/* ── Gender sub-sections ─────────────────────────────────── */}
                {genders.length === 0 ? (
                  <p className="rounded-md border border-dashed border-slate-200 py-6 text-center text-sm text-slate-400">
                    Add genders above to start adding products.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {genders.map((gender) => {
                      const genderProducts = category.products.filter((p) => p.genderId === gender.id);
                      return (
                        <div key={gender.id} className="rounded-md border border-slate-200">
                          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              {gender.imageUrl && (
                                <div className="relative h-6 w-6 overflow-hidden rounded-full flex-shrink-0">
                                  <Image src={gender.imageUrl} alt={gender.name} fill className="object-cover" sizes="24px" />
                                </div>
                              )}
                              <span className="text-sm font-semibold text-primary">{gender.name}</span>
                              <span className="text-xs text-slate-400">({genderProducts.length})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => openCreateProduct(category.id, gender.id, category.name, gender.name)}
                              disabled={category.id === 'uncategorized'}
                              className="rounded-sm bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              + Add Product
                            </button>
                          </div>

                          <div className="p-3">
                            {genderProducts.length === 0 ? (
                              <p className="py-4 text-center text-xs text-slate-400">
                                No {gender.name} products in this category yet.
                              </p>
                            ) : (
                              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                                {genderProducts.map((product) => (
                                  <div key={product.id} className="rounded-md border border-slate-200 p-2">
                                    <div className="relative mb-2 h-28 overflow-hidden rounded-sm bg-slate-100">
                                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-primary line-clamp-1">{product.name}</h4>
                                    <p className="mt-1 text-xs text-slate-600 line-clamp-2">{product.description}</p>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleHome(product)}
                                      className={`mt-2 w-full rounded-sm px-2 py-1.5 text-[11px] font-medium text-white ${product.addToHome ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                                    >
                                      {product.addToHome ? 'Remove from Home' : 'Add to Home'}
                                    </button>
                                    <div className="mt-2 flex items-center gap-2">
                                      <button type="button" onClick={() => openEditProduct(product, category.name, gender.name)} className="flex-1 rounded-sm border border-slate-300 px-2 py-1.5 text-[11px] font-medium text-primary hover:border-primary">Edit</button>
                                      <button type="button" onClick={() => setPendingDelete({ kind: 'product', id: product.id })} className="flex-1 rounded-sm border border-red-200 px-2 py-1.5 text-[11px] font-medium text-red-600 hover:border-red-400">Delete</button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add / Edit Gender Modal ───────────────────────────────────────── */}
      {isGenderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
            <h2 className="text-xl font-playfair font-semibold text-primary">
              {editingGenderId ? 'Edit Gender' : 'Add Gender'}
            </h2>
            {editingGenderId && (
              <p className="mt-1 text-xs text-slate-500">
                Note: changing the name will update the URL slug, so existing links to this gender page will change.
              </p>
            )}
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary">Gender Name</label>
                <input
                  type="text"
                  value={genderForm.name}
                  onChange={(e) => setGenderForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Ladies, Mens, Kids"
                  className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <UploadField
                label="Card Photo"
                value={genderForm.imageUrl}
                folder="genders"
                onChange={(url) => setGenderForm((prev) => ({ ...prev, imageUrl: url }))}
              />
              {genderForm.imageUrl && (
                <div className="relative h-24 w-24 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                  <Image src={genderForm.imageUrl} alt="Preview" fill className="object-cover" sizes="96px" />
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={closeGenderModal} className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-medium text-primary">Cancel</button>
              <button type="button" onClick={handleSaveGender} disabled={isSavingGender} className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60">
                {isSavingGender ? 'Saving...' : editingGenderId ? 'Save Changes' : 'Save Gender'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Product Modal ──────────────────────────────────────── */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-lg bg-white p-5 shadow-xl">
            <h2 className="text-xl font-playfair font-semibold text-primary">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            {(productModalCtx.categoryName || productModalCtx.genderName) && (
              <p className="mt-1 text-sm text-slate-500">
                {productModalCtx.genderName} — {productModalCtx.categoryName}
              </p>
            )}

            <div className="mt-4 space-y-4">
              <UploadField
                label="Product Photo"
                value={productForm.imageUrl}
                folder="products"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={(url) => setProductForm((prev) => ({ ...prev, imageUrl: url }))}
              />
              {productForm.imageUrl && (
                <div className="relative h-28 w-40 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                  <Image src={productForm.imageUrl} alt="Product preview" fill className="object-cover" sizes="160px" />
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary">Product Name</label>
                <input type="text" value={productForm.name} onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary">Description</label>
                <textarea value={productForm.description} onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))} rows={4} className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={closeProductModal} className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-medium text-primary">Cancel</button>
              <button type="button" onClick={handleSaveProduct} disabled={isSavingProduct} className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60">{isSavingProduct ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Dialog ────────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title={
          pendingDelete?.kind === 'gender' ? 'Delete Gender'
          : pendingDelete?.kind === 'category' ? 'Delete Category'
          : pendingDelete?.kind === 'categoryDetails' ? 'Delete Category Details'
          : 'Delete Product'
        }
        message={
          pendingDelete?.kind === 'gender' ? 'Delete this gender? Products under this gender will remain but become unassigned.'
          : pendingDelete?.kind === 'category' ? 'Delete this category and all products inside it?'
          : pendingDelete?.kind === 'categoryDetails' ? 'Delete the category details? This cannot be undone.'
          : 'Delete this product?'
        }
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
