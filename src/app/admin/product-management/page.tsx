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

type DetailItem = {
  photoUrl: string;
  text: string;
};

type CategoryDetails = {
  thumbnailUrl: string;
  details: DetailItem[];
};

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
  name: string;
  description: string;
  imageUrl: string;
};

type DetailsForm = {
  categoryId: string;
  thumbnailUrl: string;
  details: DetailItem[];
};

const emptyForm: ProductForm = {
  categoryId: '',
  name: '',
  description: '',
  imageUrl: '',
};

const MAX_DETAILS = 4;

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
    | { kind: 'categoryDetails'; categoryId: string }
    | null
  >(null);

  const [detailsForm, setDetailsForm] = useState<DetailsForm | null>(null);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [editingDetailIndex, setEditingDetailIndex] = useState<number | null>(null);
  const [changingThumbnailFor, setChangingThumbnailFor] = useState<string | null>(null);

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

  const openDetailsForm = (category: AdminCategory) => {
    setDetailsForm({
      categoryId: category.id,
      thumbnailUrl: category.categoryDetails?.thumbnailUrl ?? '',
      details: category.categoryDetails?.details ? [...category.categoryDetails.details] : [],
    });
    setEditingDetailIndex(null);
  };

  const closeDetailsForm = () => {
    setDetailsForm(null);
    setEditingDetailIndex(null);
  };

  const addDetailItem = () => {
    if (!detailsForm || detailsForm.details.length >= MAX_DETAILS) return;
    const newIndex = detailsForm.details.length;
    setDetailsForm((prev) =>
      prev ? { ...prev, details: [...prev.details, { photoUrl: '', text: '' }] } : prev
    );
    setEditingDetailIndex(newIndex);
  };

  const removeDetailItem = (index: number) => {
    setDetailsForm((prev) =>
      prev ? { ...prev, details: prev.details.filter((_, i) => i !== index) } : prev
    );
    setEditingDetailIndex((prev) => {
      if (prev === null) return null;
      if (prev === index) return null;
      if (prev > index) return prev - 1;
      return prev;
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

    if (!detailsForm.thumbnailUrl.trim()) {
      setError('Thumbnail photo is required.');
      return;
    }

    setIsSavingDetails(true);
    setError('');

    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'saveCategoryDetails',
        categoryId: detailsForm.categoryId,
        thumbnailUrl: detailsForm.thumbnailUrl,
        details: detailsForm.details,
      }),
    });

    setIsSavingDetails(false);

    if (!response.ok) {
      setError('Failed to save category details.');
      return;
    }

    setDetailsForm(null);
    setEditingDetailIndex(null);
    loadData();
  };

  const handleDeleteCategoryDetails = async (categoryId: string) => {
    const response = await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteCategoryDetails', categoryId }),
    });

    if (!response.ok) {
      setError('Failed to delete category details.');
      return;
    }

    loadData();
  };

  const handleChangeThumbnail = async (
    categoryId: string,
    thumbnailUrl: string,
    existingDetails: DetailItem[]
  ) => {
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'saveCategoryDetails',
        categoryId,
        thumbnailUrl,
        details: existingDetails,
      }),
    });

    if (!response.ok) {
      setError('Failed to update thumbnail.');
      return;
    }

    setChangingThumbnailFor(null);
    loadData();
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

  const requestDeleteProduct = (productId: string) => setPendingDelete({ kind: 'product', id: productId });
  const requestDeleteCategory = (categoryId: string) => setPendingDelete({ kind: 'category', id: categoryId });
  const requestDeleteCategoryDetails = (categoryId: string) =>
    setPendingDelete({ kind: 'categoryDetails', categoryId });
  const cancelDelete = () => setPendingDelete(null);

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    if (pendingDelete.kind === 'category') {
      await handleDeleteCategory(pendingDelete.id);
    } else if (pendingDelete.kind === 'product') {
      await handleDeleteProduct(pendingDelete.id);
    } else if (pendingDelete.kind === 'categoryDetails') {
      await handleDeleteCategoryDetails(pendingDelete.categoryId);
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
        {categories.map((category) => {
          const isEditingDetails = detailsForm?.categoryId === category.id;
          const hasDetails = Boolean(category.categoryDetails?.thumbnailUrl);

          return (
            <div key={category.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              {/* Category header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-playfair font-semibold text-primary">{category.name}</h2>
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
                      onClick={() => requestDeleteCategoryDetails(category.id)}
                      className="rounded-sm border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:border-red-400"
                    >
                      Delete Details
                    </button>
                  )}
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

              {/* Category Details inline form */}
              {isEditingDetails && detailsForm && (
                <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-4 text-sm font-semibold text-primary">Category Details</h3>

                  {/* Thumbnail upload */}
                  <UploadField
                    label="Thumbnail Photo"
                    value={detailsForm.thumbnailUrl}
                    folder="category-details"
                    onChange={(url) =>
                      setDetailsForm((prev) => (prev ? { ...prev, thumbnailUrl: url } : prev))
                    }
                  />
                  {detailsForm.thumbnailUrl && (
                    <div className="relative mt-2 h-16 w-24 overflow-hidden rounded-sm border border-slate-200 bg-slate-100">
                      <Image
                        src={detailsForm.thumbnailUrl}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  )}

                  {/* Detail items as cards */}
                  {detailsForm.details.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {detailsForm.details.map((item, index) =>
                        editingDetailIndex === index ? (
                          /* Expanded edit form */
                          <div
                            key={index}
                            className="rounded-md border border-primary/30 bg-white p-3"
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <span className="text-xs font-semibold text-primary">
                                Detail {index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => setEditingDetailIndex(null)}
                                className="rounded-sm bg-primary px-2 py-1 text-xs font-medium text-white hover:bg-primary-dark"
                              >
                                Done
                              </button>
                            </div>
                            <UploadField
                              label="Photo"
                              value={item.photoUrl}
                              folder="category-details"
                              onChange={(url) => updateDetailItem(index, 'photoUrl', url)}
                            />
                            {item.photoUrl && (
                              <div className="relative mt-1 h-14 w-20 overflow-hidden rounded-sm border border-slate-200 bg-slate-100">
                                <Image
                                  src={item.photoUrl}
                                  alt={`Detail ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              </div>
                            )}
                            <div className="mt-2 space-y-1">
                              <label className="block text-sm font-medium text-primary">
                                Details Text
                              </label>
                              <textarea
                                value={item.text}
                                onChange={(event) =>
                                  updateDetailItem(index, 'text', event.target.value)
                                }
                                rows={3}
                                placeholder="Enter detail text..."
                                className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
                              />
                            </div>
                          </div>
                        ) : (
                          /* Compact card view */
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-2"
                          >
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-sm bg-slate-100">
                              {item.photoUrl ? (
                                <Image
                                  src={item.photoUrl}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <span className="text-[10px] text-slate-400">No photo</span>
                                </div>
                              )}
                            </div>
                            <p className="line-clamp-2 flex-1 text-xs text-slate-600">
                              {item.text || '(no text)'}
                            </p>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => setEditingDetailIndex(index)}
                                className="rounded-sm border border-slate-200 px-2 py-1 text-[11px] font-medium text-primary hover:border-primary"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => removeDetailItem(index)}
                                className="rounded-sm border border-red-100 px-2 py-1 text-[11px] font-medium text-red-500 hover:border-red-300"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {detailsForm.details.length < MAX_DETAILS ? (
                    <button
                      type="button"
                      onClick={addDetailItem}
                      className="mt-3 w-full rounded-sm border border-dashed border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 hover:border-primary hover:text-primary"
                    >
                      + Add Details
                    </button>
                  ) : (
                    <p className="mt-3 text-center text-xs text-slate-500">
                      Maximum {MAX_DETAILS} detail items reached.
                    </p>
                  )}

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeDetailsForm}
                      className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-medium text-primary"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveDetails}
                      disabled={isSavingDetails}
                      className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60"
                    >
                      {isSavingDetails ? 'Saving...' : 'Save Details'}
                    </button>
                  </div>
                </div>
              )}

              {/* Details preview (read-only, when not editing) */}
              {!isEditingDetails && hasDetails && category.categoryDetails && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Category Details Preview
                  </p>

                  <div className="w-48 rounded-md border border-slate-200 p-2">
                    {/* Thumbnail — same h-28 as product cards */}
                    <div className="relative mb-2 h-28 overflow-hidden rounded-sm bg-slate-100">
                      <Image
                        src={category.categoryDetails.thumbnailUrl}
                        alt="Category thumbnail"
                        fill
                        className="object-cover"
                        sizes="192px"
                      />
                    </div>

                    {/* Change thumbnail button */}
                    <button
                      type="button"
                      onClick={() =>
                        setChangingThumbnailFor(
                          changingThumbnailFor === category.id ? null : category.id
                        )
                      }
                      className="mb-1 w-full rounded-sm border border-slate-200 px-2 py-1 text-[11px] font-medium text-primary hover:border-primary"
                    >
                      {changingThumbnailFor === category.id ? 'Cancel' : 'Change Thumbnail'}
                    </button>

                    {/* Detail rows: photo + text in one row each */}
                    {category.categoryDetails.details.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 border-t border-slate-100 py-1"
                      >
                        <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-sm bg-slate-100">
                          {item.photoUrl && (
                            <Image
                              src={item.photoUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="28px"
                            />
                          )}
                        </div>
                        <p className="line-clamp-1 flex-1 text-[10px] leading-tight text-slate-600">
                          {item.text || '—'}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Inline thumbnail upload */}
                  {changingThumbnailFor === category.id && (
                    <div className="mt-2 max-w-xs rounded-md border border-slate-200 bg-white p-3">
                      <UploadField
                        label="Upload New Thumbnail"
                        value=""
                        folder="category-details"
                        onChange={(url) =>
                          handleChangeThumbnail(
                            category.id,
                            url,
                            category.categoryDetails!.details
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Separator between details and products */}
              <hr className="my-4 border-slate-200" />

              {/* Products */}
              {category.products.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No products yet. Click Add New Product to add one.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
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
                          product.addToHome
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-emerald-600 hover:bg-emerald-700'
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
              )}
            </div>
          );
        })}
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
        title={
          pendingDelete?.kind === 'category'
            ? 'Delete Category'
            : pendingDelete?.kind === 'categoryDetails'
            ? 'Delete Category Details'
            : 'Delete Product'
        }
        message={
          pendingDelete?.kind === 'category'
            ? 'Are you sure you want to delete this category and all products inside it?'
            : pendingDelete?.kind === 'categoryDetails'
            ? 'Are you sure you want to delete the category details? This cannot be undone.'
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
