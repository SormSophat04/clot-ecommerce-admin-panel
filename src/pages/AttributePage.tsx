import { useState } from 'react';
import { 
  Plus, 
  Palette, 
  Maximize, 
  Edit2, 
  Trash2,
  CheckCircle2,
  X,
  Check,
} from 'lucide-react';
import {
  useColors,
  useSizes,
  useCreateColor,
  useUpdateColor,
  useDeleteColor,
  useCreateSize,
  useUpdateSize,
  useDeleteSize,
} from '../hooks/api/useResources';
import type { Color, Size } from '../types/api';
import './SharedResourceStyles.css';

const AttributePage = () => {
  const { data: colors, isLoading: colorsLoading, isError: colorsError, refetch: refetchColors } = useColors();
  const { data: sizes, isLoading: sizesLoading, isError: sizesError, refetch: refetchSizes } = useSizes();
  const createColor = useCreateColor();
  const updateColor = useUpdateColor();
  const deleteColor = useDeleteColor();
  const createSize = useCreateSize();
  const updateSize = useUpdateSize();
  const deleteSize = useDeleteSize();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'color' | 'size'>('color');
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formName, setFormName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'color' | 'size'; id: number; name: string } | null>(null);

  const openCreateModal = (type: 'color' | 'size') => {
    setModalType(type);
    setModalMode('create');
    setSelectedId(null);
    setFormName('');
    setShowModal(true);
  };

  const openEditColorModal = (color: Color) => {
    setModalType('color');
    setModalMode('edit');
    setSelectedId(color.colorId);
    setFormName(color.colorName);
    setShowModal(true);
  };

  const openEditSizeModal = (size: Size) => {
    setModalType('size');
    setModalMode('edit');
    setSelectedId(size.sizeId);
    setFormName(size.sizeName);
    setShowModal(true);
  };

  const openDeleteConfirm = (type: 'color' | 'size', id: number, name: string) => {
    setDeleteTarget({ type, id, name });
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) {
      return;
    }

    try {
      if (modalType === 'color') {
        if (modalMode === 'create') {
          await createColor.mutateAsync({ name: formName });
        } else if (selectedId) {
          await updateColor.mutateAsync({ id: selectedId, name: formName });
        }
        refetchColors();
      } else {
        if (modalMode === 'create') {
          await createSize.mutateAsync({ name: formName });
        } else if (selectedId) {
          await updateSize.mutateAsync({ id: selectedId, name: formName });
        }
        refetchSizes();
      }

      setShowModal(false);
      setSelectedId(null);
      setFormName('');
    } catch (error) {
      console.error('Attribute operation failed:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      if (deleteTarget.type === 'color') {
        await deleteColor.mutateAsync(deleteTarget.id);
        refetchColors();
      } else {
        await deleteSize.mutateAsync(deleteTarget.id);
        refetchSizes();
      }

      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Delete attribute failed:', error);
    }
  };

  if (colorsLoading || sizesLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading attributes...</p>
      </div>
    );
  }

  if (colorsError || sizesError) {
    return (
      <div className="dashboard-error">
        <p>Failed to load attribute data. Please check your backend connection.</p>
        <button onClick={() => window.location.reload()} className="btn-retry">Retry</button>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <div className="category-header-info">
          <h2>Colors & Sizes</h2>
          <p>Define product variants and options</p>
        </div>
      </div>

      <div className="charts-row">
        {/* Colors Section */}
        <div className="category-table-container">
          <div className="table-header">
            <div className="category-name-cell">
              <div className="category-icon-wrapper rose" style={{ width: '32px', height: '32px' }}>
                <Palette size={14} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Color Variants</h3>
            </div>
            <button className="category-action-btn" onClick={() => openCreateModal('color')}>
              <Plus size={18} />
            </button>
          </div>
          <table className="category-table">
            <thead>
              <tr>
                <th>Color Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {colors?.map((color) => (
                <tr key={color.colorId}>
                  <td>
                    <div className="category-name-cell">
                      <div className="color-preview" style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)', // Placeholder for actual color
                        boxShadow: '0 0 5px rgba(233, 69, 96, 0.3)'
                      }} />
                      {color.colorName}
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="category-action-btn" onClick={() => openEditColorModal(color)}>
                        <Edit2 size={12} />
                      </button>
                      <button
                        className="category-action-btn delete"
                        onClick={() => openDeleteConfirm('color', color.colorId, color.colorName)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!colors || colors.length === 0) && (
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                    No colors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sizes Section */}
        <div className="category-table-container">
          <div className="table-header">
            <div className="category-name-cell">
              <div className="category-icon-wrapper blue" style={{ width: '32px', height: '32px' }}>
                <Maximize size={14} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Size Guides</h3>
            </div>
            <button className="category-action-btn" onClick={() => openCreateModal('size')}>
              <Plus size={18} />
            </button>
          </div>
          <table className="category-table">
            <thead>
              <tr>
                <th>Size Label</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sizes?.map((size) => (
                <tr key={size.sizeId}>
                  <td>
                    <div className="category-name-cell">
                      <strong>{size.sizeName}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="category-action-btn" onClick={() => openEditSizeModal(size)}>
                        <Edit2 size={12} />
                      </button>
                      <button
                        className="category-action-btn delete"
                        onClick={() => openDeleteConfirm('size', size.sizeId, size.sizeName)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!sizes || sizes.length === 0) && (
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                    No sizes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="category-card" style={{ marginTop: '20px', cursor: 'default' }}>
        <div className="category-header-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 size={24} color="var(--accent-green)" />
          <div>
            <h4 style={{ fontSize: '16px', marginBottom: '2px' }}>Automation Rule Active</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              New colors and sizes are automatically added to the global product filter options.
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalMode === 'create' ? 'Add New' : 'Edit'} {modalType === 'color' ? 'Color' : 'Size'}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <label>{modalType === 'color' ? 'Color Name' : 'Size Name'}</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={`Enter ${modalType} name`}
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
              <h3>Delete {deleteTarget.type === 'color' ? 'Color' : 'Size'}</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
              </p>
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

export default AttributePage;
