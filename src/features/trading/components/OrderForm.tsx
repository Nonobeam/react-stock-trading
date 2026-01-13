import React, { useState, useCallback, useMemo } from 'react';
import type { OrderRequest, OrderSide, OrderType } from '../../../shared/types';
import { LOT_SIZE } from '../../../services/vietnam/lotSize';
import { Button } from '../../../shared/components/Button';
import './OrderForm.css';

interface OrderFormProps {
  onSubmit: (order: OrderRequest) => void;
  isSubmitting: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onSubmit, isSubmitting }) => {
  const [symbol, setSymbol] = useState('');
  const [side, setSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('LO');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{
    symbol?: string;
    quantity?: string;
    price?: string;
  }>({});

  // Validate symbol format
  const validateSymbol = useCallback((value: string): string | undefined => {
    if (!value.trim()) {
      return 'Symbol is required';
    }
    if (!/^[A-Z]{3}$/.test(value.toUpperCase())) {
      return 'Symbol must be 3 uppercase letters (e.g., VNM, HPG)';
    }
    return undefined;
  }, []);

  // Validate quantity (must be multiple of lot size)
  const validateQuantity = useCallback((value: string, sym: string): string | undefined => {
    if (!value.trim()) {
      return 'Quantity is required';
    }
    const qty = parseInt(value, 10);
    if (isNaN(qty) || qty <= 0) {
      return 'Quantity must be a positive number';
    }
    if (sym) {
      const lotSize = LOT_SIZE; // 100 shares for Vietnam market
      if (qty % lotSize !== 0) {
        return `Quantity must be a multiple of ${lotSize} (lot size for ${sym.toUpperCase()})`;
      }
    }
    return undefined;
  }, []);

  // Validate price format
  const validatePrice = useCallback((value: string, type: OrderType): string | undefined => {
    if (type === 'MP') {
      return undefined; // No price needed for market orders
    }
    if (!value.trim()) {
      return 'Price is required for limit orders';
    }
    const p = parseFloat(value);
    if (isNaN(p) || p <= 0) {
      return 'Price must be a positive number';
    }
    // Check tick size (0.1 for prices >= 50, 0.01 otherwise)
    const tickSize = p >= 50 ? 0.1 : 0.01;
    const remainder = (p * 100) % (tickSize * 100);
    if (Math.abs(remainder) > 0.001) {
      return `Price must be a multiple of ${tickSize} VND`;
    }
    return undefined;
  }, []);

  // Calculate estimated value
  const estimatedValue = useMemo(() => {
    const qty = parseInt(quantity, 10);
    const p = parseFloat(price);
    if (!isNaN(qty) && !isNaN(p) && qty > 0 && p > 0) {
      return (qty * p * 1000).toLocaleString('vi-VN'); // Vietnamese stocks traded in 1000s
    }
    return '0';
  }, [quantity, price]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const symbolError = validateSymbol(symbol);
    const quantityError = validateQuantity(quantity, symbol);
    const priceError = validatePrice(price, orderType);

    setErrors({
      symbol: symbolError,
      quantity: quantityError,
      price: priceError,
    });

    // If any errors, don't submit
    if (symbolError || quantityError || priceError) {
      return;
    }

    // Build order request
    const orderRequest: OrderRequest = {
      symbol: symbol.toUpperCase(),
      side,
      orderType,
      quantity: parseInt(quantity, 10),
      ...(orderType === 'LO' && { price: parseFloat(price) }),
    };

    onSubmit(orderRequest);
  }, [symbol, side, orderType, quantity, price, validateSymbol, validateQuantity, validatePrice, onSubmit]);

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setSymbol(value);
    setErrors((prev) => ({ ...prev, symbol: validateSymbol(value) }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(value);
    setErrors((prev) => ({ ...prev, quantity: validateQuantity(value, symbol) }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrice(value);
    setErrors((prev) => ({ ...prev, price: validatePrice(value, orderType) }));
  };

  const handleOrderTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as OrderType;
    setOrderType(type);
    // Clear price error when switching to market order
    if (type === 'MP') {
      setErrors((prev) => ({ ...prev, price: undefined }));
    }
  };

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="symbol">Symbol</label>
          <input
            id="symbol"
            type="text"
            value={symbol}
            onChange={handleSymbolChange}
            placeholder="VNM"
            maxLength={3}
            disabled={isSubmitting}
            className={errors.symbol ? 'error' : ''}
          />
          {errors.symbol && <span className="error-message">{errors.symbol}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="side">Side</label>
          <select
            id="side"
            value={side}
            onChange={(e) => setSide(e.target.value as OrderSide)}
            disabled={isSubmitting}
          >
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="orderType">Order Type</label>
          <select
            id="orderType"
            value={orderType}
            onChange={handleOrderTypeChange}
            disabled={isSubmitting}
          >
            <option value="LO">Limit</option>
            <option value="MP">Market</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            placeholder="100"
            min="1"
            step="10"
            disabled={isSubmitting}
            className={errors.quantity ? 'error' : ''}
          />
          {errors.quantity && <span className="error-message">{errors.quantity}</span>}
        </div>
      </div>

      {orderType === 'LO' && (
        <div className="form-group">
          <label htmlFor="price">Price (VND/1000)</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={handlePriceChange}
            placeholder="75.5"
            min="0.01"
            step="0.1"
            disabled={isSubmitting}
            className={errors.price ? 'error' : ''}
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>
      )}

      <div className="order-summary">
        <div className="summary-row">
          <span className="label">Estimated Value:</span>
          <span className="value">{estimatedValue} VND</span>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting || Object.values(errors).some((err) => err !== undefined)}
        className="submit-button"
      >
        {isSubmitting ? 'Placing Order...' : `Place ${side === 'BUY' ? 'Buy' : 'Sell'} Order`}
      </Button>
    </form>
  );
};
