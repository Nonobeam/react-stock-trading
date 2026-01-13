/**
 * TradeEntryModal - Modal for adding/editing trades
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTrades } from '../../../context/TradesContext';
import type { Trade } from '../../../shared/types/Trade';
import './TradeEntryModal.css';

interface TradeEntryModalProps {
  trade?: Trade;
  onClose: () => void;
}

export function TradeEntryModal({ trade, onClose }: TradeEntryModalProps) {
  const { addTrade, updateTrade } = useTrades();
  const isEdit = !!trade;

  const [formData, setFormData] = useState({
    symbol: trade?.symbol || '',
    entrySide: trade?.entry.side || 'long',
    entryPrice: trade?.entry.price?.toString() || '',
    entryQuantity: trade?.entry.quantity?.toString() || '',
    entryTimestamp: trade?.entry.timestamp || new Date().toISOString().slice(0, 16),
    stopLoss: trade?.stopLoss?.toString() || '',
    takeProfit: trade?.takeProfit?.toString() || '',
    setupName: trade?.setup.name || '',
    setupTimeframe: trade?.setup.timeframe || '',
    setupRegime: trade?.setup.regime || '',
    setupQuality: trade?.setup.quality?.toString() || '3',
    setupDescription: trade?.setup.description || '',
    notes: trade?.notes || '',
    tags: trade?.tags?.join(', ') || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const tradeData = {
      symbol: formData.symbol.toUpperCase(),
      entry: {
        side: formData.entrySide as 'long' | 'short',
        price: parseFloat(formData.entryPrice),
        quantity: parseInt(formData.entryQuantity),
        timestamp: new Date(formData.entryTimestamp).toISOString(),
      },
      stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : undefined,
      takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : undefined,
      setup: {
        name: formData.setupName,
        timeframe: formData.setupTimeframe,
        regime: formData.setupRegime,
        quality: parseInt(formData.setupQuality),
        description: formData.setupDescription || undefined,
      },
      notes: formData.notes || undefined,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : undefined,
    };

    if (isEdit && trade) {
      updateTrade(trade.id, tradeData);
    } else {
      addTrade(tradeData);
    }

    onClose();
  };

  return (
    <div className="trade-entry-modal-overlay" onClick={onClose}>
      <div className="trade-entry-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Trade' : 'Add New Trade'}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Symbol *</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>Side *</label>
                <select
                  value={formData.entrySide}
                  onChange={(e) => setFormData({ ...formData, entrySide: e.target.value as 'long' | 'short' })}
                  required
                >
                  <option value="long">Long</option>
                  <option value="short">Short</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Entry Details</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Entry Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.entryPrice}
                  onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>Quantity *</label>
                <input
                  type="number"
                  value={formData.entryQuantity}
                  onChange={(e) => setFormData({ ...formData, entryQuantity: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>Entry Time *</label>
                <input
                  type="datetime-local"
                  value={formData.entryTimestamp}
                  onChange={(e) => setFormData({ ...formData, entryTimestamp: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Risk Management</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Stop Loss</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.stopLoss}
                  onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Take Profit</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.takeProfit}
                  onChange={(e) => setFormData({ ...formData, takeProfit: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Setup Details</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Setup Name *</label>
                <input
                  type="text"
                  value={formData.setupName}
                  onChange={(e) => setFormData({ ...formData, setupName: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>Timeframe *</label>
                <input
                  type="text"
                  value={formData.setupTimeframe}
                  onChange={(e) => setFormData({ ...formData, setupTimeframe: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>Market Regime *</label>
                <input
                  type="text"
                  value={formData.setupRegime}
                  onChange={(e) => setFormData({ ...formData, setupRegime: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>Quality (1-5) *</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.setupQuality}
                  onChange={(e) => setFormData({ ...formData, setupQuality: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-field">
              <label>Setup Description</label>
              <textarea
                rows={3}
                value={formData.setupDescription}
                onChange={(e) => setFormData({ ...formData, setupDescription: e.target.value })}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Information</h3>
            <div className="form-field">
              <label>Notes</label>
              <textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., breakout, earnings, high-volume"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? 'Update Trade' : 'Add Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
