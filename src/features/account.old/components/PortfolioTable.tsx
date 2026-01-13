import React from 'react';
import { useAccount } from '../../../context/AccountContext';
import { EmptyState } from '../../../shared/components';
import './PortfolioTable.css';

export const PortfolioTable: React.FC = () => {
  const { portfolio, isLoading } = useAccount();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price * 1000) + ' VND';
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const formatPercent = (percent: number): string => {
    const sign = percent >= 0 ? '+' : '';
    return sign + percent.toFixed(2) + '%';
  };

  const getPLClassName = (value: number): string => {
    if (value > 0) return 'profit-positive';
    if (value < 0) return 'profit-negative';
    return '';
  };

  if (isLoading && portfolio.length === 0) {
    return (
      <div className="portfolio-table-container">
        <div className="loading-placeholder">Loading portfolio...</div>
      </div>
    );
  }

  if (portfolio.length === 0) {
    return (
      <div className="portfolio-table-container">
        <EmptyState
          title="No Holdings"
          message="You don't have any holdings in your portfolio yet."
          action={{
            label: "Go to Trading",
            onClick: () => {
              // Navigation will be handled by parent
              window.location.hash = '#trading';
            }
          }}
        />
      </div>
    );
  }

  // Calculate totals
  const totalValue = portfolio.reduce((sum, holding) => 
    sum + (holding.marketPrice * holding.quantity * 1000), 0
  );
  const totalCost = portfolio.reduce((sum, holding) => 
    sum + (holding.averagePrice * holding.quantity * 1000), 0
  );
  const totalPL = portfolio.reduce((sum, holding) => sum + holding.profit, 0);
  const totalPLPercent = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

  return (
    <div className="portfolio-table-container">
      <table className="portfolio-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th className="align-right">Quantity</th>
            <th className="align-right">Avg Price</th>
            <th className="align-right">Market Price</th>
            <th className="align-right">P&L (VND)</th>
            <th className="align-right">P&L %</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((holding) => (
            <tr key={holding.symbol}>
              <td className="symbol-cell">
                <strong>{holding.symbol}</strong>
              </td>
              <td className="align-right">{formatNumber(holding.quantity)}</td>
              <td className="align-right">{formatPrice(holding.averagePrice)}</td>
              <td className="align-right">{formatPrice(holding.marketPrice)}</td>
              <td className={`align-right ${getPLClassName(holding.profit)}`}>
                {formatNumber(holding.profit)}
              </td>
              <td className={`align-right ${getPLClassName(holding.profitPercent)}`}>
                {formatPercent(holding.profitPercent)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="summary-row">
            <td colSpan={4} className="summary-label">
              <strong>Total Portfolio</strong>
            </td>
            <td className={`align-right summary-value ${getPLClassName(totalPL)}`}>
              <strong>{formatNumber(totalPL)}</strong>
            </td>
            <td className={`align-right summary-value ${getPLClassName(totalPLPercent)}`}>
              <strong>{formatPercent(totalPLPercent)}</strong>
            </td>
          </tr>
          <tr className="summary-row">
            <td colSpan={4} className="summary-label">
              Total Value
            </td>
            <td colSpan={2} className="align-right summary-value">
              {formatNumber(totalValue)} VND
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
