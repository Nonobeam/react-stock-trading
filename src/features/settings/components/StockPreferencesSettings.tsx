/**
 * StockPreferencesSettings - Manage per-stock signal score preferences
 */

import { useState, useEffect, useCallback } from 'react';
import { preferencesApi } from '../../../services/api';
import { Button } from '../../../shared/components/Button';
import { Badge } from '../../../shared/components/Badge';
import { IconButton } from '../../../shared/components/IconButton';
import { Modal } from '../../../shared/components/Modal';
import { LoadingSkeleton } from '../../../shared/components/LoadingSkeleton';
import { EmptyState } from '../../../shared/components/EmptyState';
import type { StockPreference, StockPreferenceRequest } from '../../../shared/types';
import './StockPreferencesSettings.css';

// Validation helpers
const isValidSymbol = (symbol: string): boolean => {
  return /^[A-Z0-9]{1,10}$/.test(symbol);
};

const isValidScore = (score: number): boolean => {
  return Number.isInteger(score) && score >= 1 && score <= 10;
};

const getScoreBadgeVariant = (score: number): 'success' | 'warning' | 'neutral' => {
  if (score >= 8) return 'success';
  if (score >= 5) return 'warning';
  return 'neutral';
};

interface FormData {
  symbol: string;
  min_signal_score: number;
  notes: string;
}

interface FormErrors {
  symbol?: string;
  min_signal_score?: string;
  notes?: string;
}

const initialFormData: FormData = {
  symbol: '',
  min_signal_score: 7,
  notes: '',
};

export function StockPreferencesSettings() {
  // Data state
  const [preferences, setPreferences] = useState<StockPreference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search/filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'symbol' | 'min_signal_score'>('symbol');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPreference, setEditingPreference] = useState<StockPreference | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Delete confirmation state
  const [deleteConfirmSymbol, setDeleteConfirmSymbol] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch preferences on mount
  const fetchPreferences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await preferencesApi.getAll();
      setPreferences(response.preferences);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  // Filter and sort preferences
  const filteredPreferences = preferences
    .filter((pref) =>
      pref.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? cmp : -cmp;
    });

  // Handle sorting
  const handleSort = (column: 'symbol' | 'min_signal_score') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Open add modal
  const handleAddClick = () => {
    setEditingPreference(null);
    setFormData(initialFormData);
    setFormErrors({});
    setSubmitError(null);
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEditClick = (pref: StockPreference) => {
    setEditingPreference(pref);
    setFormData({
      symbol: pref.symbol,
      min_signal_score: pref.min_signal_score,
      notes: pref.notes || '',
    });
    setFormErrors({});
    setSubmitError(null);
    setIsModalOpen(true);
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!editingPreference) {
      if (!formData.symbol.trim()) {
        errors.symbol = 'Symbol is required';
      } else if (!isValidSymbol(formData.symbol.toUpperCase())) {
        errors.symbol = 'Enter a valid stock symbol (1-10 uppercase letters)';
      } else if (preferences.some((p) => p.symbol === formData.symbol.toUpperCase())) {
        errors.symbol = 'Preference for this symbol already exists';
      }
    }

    if (!isValidScore(formData.min_signal_score)) {
      errors.min_signal_score = 'Score must be between 1 and 10';
    }

    if (formData.notes.length > 200) {
      errors.notes = 'Notes cannot exceed 200 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const symbol = editingPreference?.symbol || formData.symbol.toUpperCase();
    const data: StockPreferenceRequest = {
      min_signal_score: formData.min_signal_score,
      notes: formData.notes.trim() || undefined,
    };

    try {
      const result = await preferencesApi.upsert(symbol, data);
      
      if (editingPreference) {
        // Update existing
        setPreferences((prev) =>
          prev.map((p) => (p.symbol === symbol ? result : p))
        );
      } else {
        // Add new
        setPreferences((prev) => [...prev, result]);
      }
      
      setIsModalOpen(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save preference');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDeleteClick = (symbol: string) => {
    setDeleteConfirmSymbol(symbol);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmSymbol) return;

    setIsDeleting(true);
    try {
      await preferencesApi.remove(deleteConfirmSymbol);
      setPreferences((prev) => prev.filter((p) => p.symbol !== deleteConfirmSymbol));
      setDeleteConfirmSymbol(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete preference');
    } finally {
      setIsDeleting(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="settings-section stock-preferences">
        <h2>Stock Preferences</h2>
        <p className="section-description">Configure minimum signal scores for individual stocks</p>
        <LoadingSkeleton variant="card" height="300px" />
      </div>
    );
  }

  return (
    <div className="settings-section stock-preferences">
      <h2>Stock Preferences</h2>
      <p className="section-description">Configure minimum signal scores for individual stocks</p>

      {/* Error banner */}
      {error && (
        <div className="stock-preferences__error">
          <span>{error}</span>
          <Button variant="secondary" size="small" onClick={fetchPreferences}>
            Retry
          </Button>
        </div>
      )}

      {/* Header with Add button and Search */}
      <div className="stock-preferences__header">
        <Button variant="primary" onClick={handleAddClick}>
          + Add Stock Preference
        </Button>
        <div className="stock-preferences__search">
          <input
            type="text"
            placeholder="Search by symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="stock-preferences__search-input"
          />
        </div>
      </div>

      {/* Table or Empty State */}
      {filteredPreferences.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No matching preferences' : 'No stock preferences configured'}
          message={
            searchQuery
              ? 'Try a different search term'
              : 'Add a stock preference to require specific signal scores for individual stocks'
          }
          action={
            !searchQuery
              ? { label: 'Add First Preference', onClick: handleAddClick }
              : undefined
          }
        />
      ) : (
        <div className="stock-preferences__table-container">
          <table className="stock-preferences__table">
            <thead>
              <tr>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('symbol')}
                >
                  Symbol {sortBy === 'symbol' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('min_signal_score')}
                >
                  Min Score {sortBy === 'min_signal_score' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Notes</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPreferences.map((pref) => (
                <tr key={pref.symbol}>
                  <td className="symbol-cell">{pref.symbol}</td>
                  <td>
                    <Badge variant={getScoreBadgeVariant(pref.min_signal_score)}>
                      {pref.min_signal_score}/10
                    </Badge>
                  </td>
                  <td className="notes-cell">{pref.notes || '—'}</td>
                  <td className="actions-cell">
                    <IconButton
                      icon="✎"
                      variant="ghost"
                      size="small"
                      ariaLabel={`Edit preference for ${pref.symbol}`}
                      onClick={() => handleEditClick(pref)}
                    />
                    <IconButton
                      icon="×"
                      variant="danger"
                      size="small"
                      ariaLabel={`Delete preference for ${pref.symbol}`}
                      onClick={() => handleDeleteClick(pref.symbol)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPreference ? `Edit Preference: ${editingPreference.symbol}` : 'Add Stock Preference'}
        size="small"
        footer={
          <div className="stock-preferences__modal-footer">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="stock-preferences__form">
          {submitError && (
            <div className="stock-preferences__form-error">{submitError}</div>
          )}
          
          <div className="stock-preferences__form-group">
            <label htmlFor="pref-symbol">Symbol</label>
            <input
              id="pref-symbol"
              type="text"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
              placeholder="e.g., VNM"
              disabled={!!editingPreference}
              className={formErrors.symbol ? 'has-error' : ''}
            />
            {formErrors.symbol && <span className="error-text">{formErrors.symbol}</span>}
          </div>

          <div className="stock-preferences__form-group">
            <label htmlFor="pref-score">Minimum Signal Score (1-10)</label>
            <input
              id="pref-score"
              type="number"
              min={1}
              max={10}
              value={formData.min_signal_score}
              onChange={(e) => setFormData({ ...formData, min_signal_score: parseInt(e.target.value) || 1 })}
              className={formErrors.min_signal_score ? 'has-error' : ''}
            />
            {formErrors.min_signal_score && <span className="error-text">{formErrors.min_signal_score}</span>}
            <span className="hint-text">Only signals with this score or higher will be shown for this stock</span>
          </div>

          <div className="stock-preferences__form-group">
            <label htmlFor="pref-notes">Notes (optional)</label>
            <textarea
              id="pref-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g., Blue chip, need strong signals"
              rows={3}
              maxLength={200}
              className={formErrors.notes ? 'has-error' : ''}
            />
            {formErrors.notes && <span className="error-text">{formErrors.notes}</span>}
            <span className="hint-text">{formData.notes.length}/200 characters</span>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmSymbol}
        onClose={() => setDeleteConfirmSymbol(null)}
        title="Confirm Delete"
        size="small"
        footer={
          <div className="stock-preferences__modal-footer">
            <Button variant="secondary" onClick={() => setDeleteConfirmSymbol(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete the preference for <strong>{deleteConfirmSymbol}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
