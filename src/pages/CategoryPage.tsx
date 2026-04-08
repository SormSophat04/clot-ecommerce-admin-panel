import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Layers, 
  FolderPlus,
  Package,
  TrendingUp,
  X,
  Check
} from 'lucide-react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/api';
import type { Category } from '../types/api';
import './SharedResourceStyles.css';

const CategoryPage = () => {
  const { data: categories, isLoading, isError, refetch } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(0);
  const deleteCategory = useDeleteCategory();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedCategory(null);
    setFormName('');
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setFormName(category.categoryName);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) return;
    
    try {
      if (modalMode === 'create') {
        await createCategory.mutateAsync({ name: formName });
      } else if (selectedCategory) {
        await updateCategory.mutateAsync({ id: selectedCategory.categoryId, name: formName });
      }
      setShowModal(false);
      refetch();
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      await deleteCategory.mutateAsync(deleteTarget.categoryId);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      refetch();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const openDeleteConfirm = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget(category);
    setShowDeleteConfirm(true);
  };

  const filteredCategories = categories?.filter(cat => 
    cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading categories...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboard-error">
        <p>Failed to load category data. Please check your backend connection.</p>
        <button onClick={() => window.location.reload()} className="btn-retry">Retry</button>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <div className="category-header-info">
          <h2>Product Categories</h2>
          <p>Organize and manage your product catalog</p>
        </div>
        <button className="btn-add-category" onClick={openCreateModal}>
          <Plus size={18} />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="category-bento-grid">
        <div className="category-card">
          <div className="category-icon-wrapper rose">
            <Layers size={24} />
          </div>
          <div className="category-info">
            <h4>Total Categories</h4>
            <span>{categories?.length || 0} active folders</span>
          </div>
        </div>
        <div className="category-card">
          <div className="category-icon-wrapper blue">
            <Package size={24} />
          </div>
          <div className="category-info">
            <h4>Top Category</h4>
            <span>Apparel (450 items)</span>
          </div>
        </div>
        <div className="category-card">
          <div className="category-icon-wrapper green">
            <TrendingUp size={24} />
          </div>
          <div className="category-info">
            <h4>Growth</h4>
            <span>+12% vs last month</span>
          </div>
        </div>
        <div className="category-card">
          <div className="category-icon-wrapper amber">
            <FolderPlus size={24} />
          </div>
          <div className="category-info">
            <h4>Drafts</h4>
            <span>3 waiting for review</span>
          </div>
        </div>
      </div>

      <div className="category-table-container">
        <div className="table-header">
          <div className="search-wrapper">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="table-actions">
            <button className="category-action-btn">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <table className="category-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Items</th>
              <th>Created Date</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories?.map((category) => (
              <tr key={category.categoryId}>
                <td>
                  <div className="category-name-cell">
                    <div className="category-icon-wrapper rose" style={{ width: '32px', height: '32px' }}>
                      <Layers size={14} />
                    </div>
                    {category.categoryName}
                  </div>
                </td>
                <td>{category.productCount || 0} Products</td>
                <td>{category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>{category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <div className="actions-cell">
                    <button className="category-action-btn" onClick={() => openEditModal(category)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="category-action-btn delete" onClick={(e) => openDeleteConfirm(category, e)}>
                      <Trash2 size={14} />
                    </button>
                    <button className="category-action-btn">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!filteredCategories || filteredCategories.length === 0) && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalMode === 'create' ? 'Add New Category' : 'Edit Category'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <label>Category Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter category name"
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-submit" onClick={handleSubmit} disabled={!formName.trim()}>
                <Check size={16} />
                {modalMode === 'create' ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && deleteTarget && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Category</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{deleteTarget.categoryName}</strong>?</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn-submit delete" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
