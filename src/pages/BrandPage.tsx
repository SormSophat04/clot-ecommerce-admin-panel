import { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Tag, 
  Globe,
  Award,
  Zap,
  X,
  Check,
} from 'lucide-react';
import {
  useBrands,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
} from '../hooks/api/useResources';
import type { Brand } from '../types/api';
import './SharedResourceStyles.css';

const BrandPage = () => {
  const { data: brands, isLoading, isError, refetch } = useBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [formName, setFormName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedBrand(null);
    setFormName('');
    setShowModal(true);
  };

  const openEditModal = (brand: Brand) => {
    setModalMode('edit');
    setSelectedBrand(brand);
    setFormName(brand.brandName);
    setShowModal(true);
  };

  const openDeleteConfirm = (brand: Brand) => {
    setDeleteTarget(brand);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) {
      return;
    }

    try {
      if (modalMode === 'create') {
        await createBrand.mutateAsync({ name: formName });
      } else if (selectedBrand) {
        await updateBrand.mutateAsync({ id: selectedBrand.brandId, name: formName });
      }

      setShowModal(false);
      refetch();
    } catch (error) {
      console.error('Brand operation failed:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteBrand.mutateAsync(deleteTarget.brandId);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      refetch();
    } catch (error) {
      console.error('Delete brand failed:', error);
    }
  };

  const filteredBrands = brands?.filter(brand => 
    brand.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading brands...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboard-error">
        <p>Failed to load brand data. Please check your backend connection.</p>
        <button onClick={() => window.location.reload()} className="btn-retry">Retry</button>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <div className="category-header-info">
          <h2>Brand Management</h2>
          <p>Manage product brands and manufacturing partners</p>
        </div>
        <button className="btn-add-category" onClick={openCreateModal}>
          <Plus size={18} />
          <span>Add New Brand</span>
        </button>
      </div>

      <div className="category-bento-grid">
        <div className="category-card">
          <div className="category-icon-wrapper rose">
            <Tag size={24} />
          </div>
          <div className="category-info">
            <h4>Total Brands</h4>
            <span>{brands?.length || 0} active partners</span>
          </div>
        </div>
        <div className="category-card">
          <div className="category-icon-wrapper blue">
            <Globe size={24} />
          </div>
          <div className="category-info">
            <h4>Global Reach</h4>
            <span>Distributed in 24 countries</span>
          </div>
        </div>
        <div className="category-card">
          <div className="category-icon-wrapper green">
            <Award size={24} />
          </div>
          <div className="category-info">
            <h4>Premium Brands</h4>
            <span>12 Luxury partnerships</span>
          </div>
        </div>
        <div className="category-card">
          <div className="category-icon-wrapper amber">
            <Zap size={24} />
          </div>
          <div className="category-info">
            <h4>Sync Status</h4>
            <span>Fully synchronized with ERP</span>
          </div>
        </div>
      </div>

      <div className="category-table-container">
        <div className="table-header">
          <div className="search-wrapper">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search brands..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="table-actions">
            <button className="category-action-btn" onClick={openCreateModal}>
              <Plus size={18} />
            </button>
          </div>
        </div>

        <table className="category-table">
          <thead>
            <tr>
              <th>Brand Name</th>
              <th>Total Products</th>
              <th>Created Date</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands?.map((brand) => (
              <tr key={brand.brandId}>
                <td>
                  <div className="category-name-cell">
                    <div className="category-icon-wrapper rose" style={{ width: '32px', height: '32px' }}>
                      <Tag size={14} />
                    </div>
                    {brand.brandName}
                  </div>
                </td>
                <td>{brand.productCount || 0} Items</td>
                <td>{brand.createdAt ? new Date(brand.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>{brand.updatedAt ? new Date(brand.updatedAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <div className="actions-cell">
                    <button className="category-action-btn" onClick={() => openEditModal(brand)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="category-action-btn delete" onClick={() => openDeleteConfirm(brand)}>
                      <Trash2 size={14} />
                    </button>
                    <button className="category-action-btn">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!filteredBrands || filteredBrands.length === 0) && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No brands found
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
              <h3>{modalMode === 'create' ? 'Add New Brand' : 'Edit Brand'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <label>Brand Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter brand name"
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
              <h3>Delete Brand</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{deleteTarget.brandName}</strong>?</p>
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

export default BrandPage;
