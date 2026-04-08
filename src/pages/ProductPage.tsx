import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Package,
  Boxes,
  Layers,
  X,
  Check,
  Image as ImageIcon,
  Undo2,
} from 'lucide-react';
import { ApiError } from '../api/client';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useCategories,
  useBrands,
  useColors,
  useSizes,
  useProductImages,
  useUploadProductImage,
  useDeleteProductImage,
} from '../hooks/api';
import type { ProductImageRecord, ProductRecord } from '../types/api';
import './SharedResourceStyles.css';

type SelectValue = number | '';

interface ProductFormState {
  productName: string;
  sku: string;
  price: string;
  stockQuantity: string;
  description: string;
  categoryId: SelectValue;
  brandId: SelectValue;
  colorIds: number[];
  sizeIds: number[];
}

const initialFormState: ProductFormState = {
  productName: '',
  sku: '',
  price: '',
  stockQuantity: '0',
  description: '',
  categoryId: '',
  brandId: '',
  colorIds: [],
  sizeIds: [],
};

const toDataUrl = (imageData: string, mimeType: string = 'image/jpeg'): string => {
  if (!imageData) {
    return '';
  }
  if (imageData.startsWith('data:')) {
    return imageData;
  }
  return `data:${mimeType};base64,${imageData}`;
};

const ProductPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SelectValue>('');
  const [brandFilter, setBrandFilter] = useState<SelectValue>('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<ProductRecord | null>(null);
  const [form, setForm] = useState<ProductFormState>(initialFormState);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProductRecord | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  const [imageValidationError, setImageValidationError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const editingProductId = selectedProduct?.productId ?? 0;

  const {
    data: productsResponse,
    isLoading,
    isError,
    refetch,
  } = useProducts(1, 500, {
    categoryId: categoryFilter || undefined,
    brandId: brandFilter || undefined,
  });
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: colors } = useColors();
  const { data: sizes } = useSizes();
  const {
    data: existingImages = [],
    isLoading: isLoadingExistingImages,
  } = useProductImages(
    editingProductId,
    showModal && modalMode === 'edit' && editingProductId > 0
  );

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const uploadProductImage = useUploadProductImage();
  const deleteProductImage = useDeleteProductImage();

  const products = productsResponse?.data ?? [];

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) {
      return products;
    }

    return products.filter((product) =>
      product.productName.toLowerCase().includes(keyword) ||
      product.categoryName.toLowerCase().includes(keyword) ||
      product.brandName.toLowerCase().includes(keyword) ||
      product.sku.toLowerCase().includes(keyword)
    );
  }, [products, searchTerm]);

  const previewFiles = useMemo(
    () =>
      selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [selectedFiles]
  );

  useEffect(() => {
    return () => {
      previewFiles.forEach((entry) => URL.revokeObjectURL(entry.url));
    };
  }, [previewFiles]);

  const visibleExistingImages = useMemo(
    () =>
      existingImages.filter(
        (image) => !removedImageIds.includes(image.productImageId)
      ),
    [existingImages, removedImageIds]
  );

  const isSubmitting =
    createProduct.isPending ||
    updateProduct.isPending ||
    uploadProductImage.isPending ||
    deleteProductImage.isPending;

  const resetForm = () => {
    setForm(initialFormState);
    setSelectedProduct(null);
    setSelectedFiles([]);
    setRemovedImageIds([]);
    setImageValidationError('');
    setSubmitError('');
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const openCreateModal = () => {
    setModalMode('create');
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product: ProductRecord) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setForm({
      productName: product.productName,
      sku: product.sku,
      price: String(product.price),
      stockQuantity: String(product.stockQuantity),
      description: product.description,
      categoryId: product.categoryId ?? '',
      brandId: product.brandId ?? '',
      colorIds: product.colorIds,
      sizeIds: product.sizeIds,
    });
    setSelectedFiles([]);
    setRemovedImageIds([]);
    setSubmitError('');
    setShowModal(true);
  };

  const openDeleteConfirm = (product: ProductRecord) => {
    setDeleteTarget(product);
    setShowDeleteConfirm(true);
  };

  const toggleSelection = (type: 'colors' | 'sizes', id: number) => {
    setForm((prev) => {
      const key = type === 'colors' ? 'colorIds' : 'sizeIds';
      const exists = prev[key].includes(id);
      return {
        ...prev,
        [key]: exists ? prev[key].filter((item) => item !== id) : [...prev[key], id],
      };
    });
  };

  const removeSelectedFileAt = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
  };

  const addFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const maxFileSizeBytes = 10 * 1024 * 1024;
    const validFiles: File[] = [];
    let errorMessage = '';

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        errorMessage = 'Only image files are allowed.';
        continue;
      }
      if (file.size > maxFileSizeBytes) {
        errorMessage = 'Each image must be 10MB or smaller.';
        continue;
      }
      validFiles.push(file);
    }

    if (errorMessage) {
      setImageValidationError(errorMessage);
    } else {
      setImageValidationError('');
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }

    event.target.value = '';
  };

  const markExistingImageForDelete = (imageId: number) => {
    if (removedImageIds.includes(imageId)) {
      return;
    }
    setRemovedImageIds((prev) => [...prev, imageId]);
  };

  const undoPendingImageDeletes = () => {
    setRemovedImageIds([]);
  };

  const uploadQueuedImages = async (productId: number) => {
    if (selectedFiles.length === 0) {
      return;
    }

    for (const file of selectedFiles) {
      await uploadProductImage.mutateAsync({ productId, file });
    }
  };

  const deleteQueuedExistingImages = async (
    productId: number,
    images: ProductImageRecord[]
  ) => {
    if (images.length === 0) {
      return;
    }

    for (const image of images) {
      await deleteProductImage.mutateAsync({
        productId,
        imageId: image.productImageId,
      });
    }
  };

  const handleSubmit = async () => {
    const name = form.productName.trim();
    const price = Number(form.price);
    const stockQuantity = Number(form.stockQuantity);

    if (
      !name ||
      !form.categoryId ||
      !form.brandId ||
      Number.isNaN(price) ||
      price < 0
    ) {
      return;
    }

    try {
      setSubmitError('');
      const payload = {
        productName: name,
        sku: form.sku.trim(),
        price,
        stockQuantity: Number.isNaN(stockQuantity) ? 0 : Math.max(stockQuantity, 0),
        description: form.description.trim(),
        categoryId: Number(form.categoryId),
        brandId: Number(form.brandId),
        colorIds: form.colorIds,
        sizeIds: form.sizeIds,
      };

      let targetProductId = 0;

      if (modalMode === 'create') {
        const created = await createProduct.mutateAsync(payload);
        targetProductId = created.productId;
      } else if (selectedProduct) {
        const updated = await updateProduct.mutateAsync({
          id: selectedProduct.productId,
          data: payload,
        });
        targetProductId = updated.productId;
      }

      if (targetProductId > 0) {
        const imagesToDelete = existingImages.filter((image) =>
          removedImageIds.includes(image.productImageId)
        );

        await deleteQueuedExistingImages(targetProductId, imagesToDelete);
        await uploadQueuedImages(targetProductId);
      }

      closeModal();
      refetch();
    } catch (error) {
      console.error('Product operation failed:', error);
      if (error instanceof ApiError) {
        setSubmitError(error.message);
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Failed to save product. Please try again.');
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteProduct.mutateAsync(deleteTarget.productId);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      refetch();
    } catch (error) {
      console.error('Delete product failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboard-error">
        <p>Failed to load product data. Please check your backend connection.</p>
        <button onClick={() => window.location.reload()} className="btn-retry">Retry</button>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <div className="category-header-info">
          <h2>Product Management</h2>
          <p>Create and manage your catalog with real-time backend data</p>
        </div>
        <button className="btn-add-category" onClick={openCreateModal}>
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="category-bento-grid">
        <div className="category-card">
          <div className="category-icon-wrapper rose">
            <Package size={24} />
          </div>
          <div className="category-info">
            <h4>Total Products</h4>
            <span>{productsResponse?.total ?? products.length} items</span>
          </div>
        </div>
        <div className="category-card">
          <div className="category-icon-wrapper blue">
            <Layers size={24} />
          </div>
          <div className="category-info">
            <h4>Categories</h4>
            <span>{categories?.length ?? 0} mapped</span>
          </div>
        </div>
        <div className="category-card">
          <div className="category-icon-wrapper green">
            <Boxes size={24} />
          </div>
          <div className="category-info">
            <h4>Brands</h4>
            <span>{brands?.length ?? 0} available</span>
          </div>
        </div>
        <div className="category-card">
          <div className="category-icon-wrapper amber">
            <ImageIcon size={24} />
          </div>
          <div className="category-info">
            <h4>Search Result</h4>
            <span>{filteredProducts.length} shown</span>
          </div>
        </div>
      </div>

      <div className="category-table-container">
        <div className="table-header" style={{ gap: '12px', flexWrap: 'wrap' }}>
          <div className="search-wrapper">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value ? Number(event.target.value) : '')
              }
              className="resource-filter-select"
            >
              <option value="">All Categories</option>
              {categories?.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            <select
              value={brandFilter}
              onChange={(event) =>
                setBrandFilter(event.target.value ? Number(event.target.value) : '')
              }
              className="resource-filter-select"
            >
              <option value="">All Brands</option>
              {brands?.map((brand) => (
                <option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="category-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Variants</th>
              <th>Images</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.productId}>
                <td>
                  <div className="category-name-cell">
                    <div
                      className="category-icon-wrapper rose"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <Package size={14} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{product.productName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {product.sku || 'No SKU'}
                      </div>
                    </div>
                  </div>
                </td>
                  <td>{product.categoryName || 'N/A'}</td>
                  <td>{product.brandName || 'N/A'}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stockQuantity}</td>
                  <td>{product.colors.length} colors / {product.sizes.length} sizes</td>
                  <td>-</td>
                  <td>
                    {product.updatedAt
                      ? new Date(product.updatedAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="category-action-btn"
                        onClick={() => openEditModal(product)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="category-action-btn delete"
                        onClick={() => openDeleteConfirm(product)}
                      >
                        <Trash2 size={14} />
                      </button>
                      <button className="category-action-btn">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(event) => event.stopPropagation()}
            style={{ maxWidth: '760px' }}
          >
            <div className="modal-header">
              <h3>{modalMode === 'create' ? 'Add New Product' : 'Edit Product'}</h3>
              <button className="modal-close" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="product-form-grid">
                <div>
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={form.productName}
                    onChange={(event) =>
                      setForm({ ...form, productName: event.target.value })
                    }
                    placeholder="Enter product name"
                    autoFocus
                  />
                </div>
                <div>
                  <label>SKU</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(event) => setForm({ ...form, sku: event.target.value })}
                    placeholder="Enter SKU"
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) => setForm({ ...form, price: event.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stockQuantity}
                    onChange={(event) =>
                      setForm({ ...form, stockQuantity: event.target.value })
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <label>Category</label>
                  <select
                    className="resource-filter-select"
                    value={form.categoryId}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        categoryId: event.target.value
                          ? Number(event.target.value)
                          : '',
                      })
                    }
                  >
                    <option value="">Select category</option>
                    {categories?.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Brand</label>
                  <select
                    className="resource-filter-select"
                    value={form.brandId}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        brandId: event.target.value ? Number(event.target.value) : '',
                      })
                    }
                  >
                    <option value="">Select brand</option>
                    {brands?.map((brand) => (
                      <option key={brand.brandId} value={brand.brandId}>
                        {brand.brandName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label>Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Enter description"
                />
              </div>

              <div style={{ marginTop: '16px' }}>
                <label>Colors</label>
                <div className="selection-chips">
                  {colors?.map((color) => (
                    <button
                      key={color.colorId}
                      type="button"
                      className={`selection-chip ${
                        form.colorIds.includes(color.colorId) ? 'active' : ''
                      }`}
                      onClick={() => toggleSelection('colors', color.colorId)}
                    >
                      {color.colorName}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label>Sizes</label>
                <div className="selection-chips">
                  {sizes?.map((size) => (
                    <button
                      key={size.sizeId}
                      type="button"
                      className={`selection-chip ${
                        form.sizeIds.includes(size.sizeId) ? 'active' : ''
                      }`}
                      onClick={() => toggleSelection('sizes', size.sizeId)}
                    >
                      {size.sizeName}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label>Product Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={addFileSelection}
                  className="image-upload-input"
                />
                {imageValidationError && (
                  <p className="upload-error-text">{imageValidationError}</p>
                )}
              </div>

              {modalMode === 'edit' && (
                <div style={{ marginTop: '12px' }}>
                  <div className="images-section-title">
                    Existing Images
                    {removedImageIds.length > 0 && (
                      <button
                        type="button"
                        className="undo-remove-btn"
                        onClick={undoPendingImageDeletes}
                      >
                        <Undo2 size={14} />
                        Undo Removed ({removedImageIds.length})
                      </button>
                    )}
                  </div>
                  {isLoadingExistingImages ? (
                    <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
                      Loading existing images...
                    </p>
                  ) : (
                    <div className="image-preview-grid">
                      {visibleExistingImages.map((image) => (
                        <div key={image.productImageId} className="image-preview-item">
                          <img
                            src={toDataUrl(image.imageData, image.mimeType)}
                            alt={`Product ${image.productImageId}`}
                          />
                          <button
                            type="button"
                            className="image-remove-btn"
                            onClick={() =>
                              markExistingImageForDelete(image.productImageId)
                            }
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {!isLoadingExistingImages &&
                        visibleExistingImages.length === 0 && (
                          <p
                            style={{
                              color: 'var(--text-secondary)',
                              fontSize: '13px',
                              margin: 0,
                            }}
                          >
                            No existing images.
                          </p>
                        )}
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: '12px' }}>
                <div className="images-section-title">New Upload Queue</div>
                <div className="image-preview-grid">
                  {previewFiles.map((entry, index) => (
                    <div key={`${entry.file.name}-${index}`} className="image-preview-item">
                      <img src={entry.url} alt={entry.file.name} />
                      <button
                        type="button"
                        className="image-remove-btn"
                        onClick={() => removeSelectedFileAt(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {previewFiles.length === 0 && (
                    <p
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '13px',
                        margin: 0,
                      }}
                    >
                      No new images selected.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {submitError && <p className="upload-error-text" style={{ marginRight: 'auto' }}>{submitError}</p>}
              <button className="btn-cancel" onClick={closeModal} disabled={isSubmitting}>
                Cancel
              </button>
              <button
                className="btn-submit"
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !form.productName.trim() ||
                  !form.categoryId ||
                  !form.brandId ||
                  !form.price
                }
              >
                <Check size={16} />
                {isSubmitting
                  ? 'Saving...'
                  : modalMode === 'create'
                    ? 'Create'
                    : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && deleteTarget && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Product</h3>
              <button
                className="modal-close"
                onClick={() => setShowDeleteConfirm(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete{' '}
                <strong>{deleteTarget.productName}</strong>?
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button className="btn-submit delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
