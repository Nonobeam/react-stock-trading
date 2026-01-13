import React from 'react';
import { useAccount } from '../../../context/AccountContext';
import './AccountInfoCard.css';

export const AccountInfoCard: React.FC = () => {
  const { account, isLoading, error, fetchAccount } = useAccount();

  if (isLoading && !account) {
    return (
      <div className="account-info-card">
        <div className="loading-placeholder">Loading account information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-info-card account-info-card--error">
        <div className="error-message">{error}</div>
        <button className="btn-retry" onClick={fetchAccount}>
          Retry
        </button>
      </div>
    );
  }

  if (!account) {
    return null;
  }

  const formatBalance = (balance: number): string => {
    return new Intl.NumberFormat('vi-VN').format(balance) + ' VND';
  };

  return (
    <div className="account-info-card">
      <h3 className="account-info-card__title">Account Information</h3>
      
      <div className="account-info-card__content">
        <div className="account-info-item">
          <span className="account-info-item__label">Account No</span>
          <span className="account-info-item__value">{account.accountNo}</span>
        </div>
        
        <div className="account-info-item">
          <span className="account-info-item__label">Account Name</span>
          <span className="account-info-item__value">{account.accountName}</span>
        </div>
        
        <div className="account-info-item account-info-item--balance">
          <span className="account-info-item__label">Available Balance</span>
          <span className="account-info-item__value account-info-item__value--highlight">
            {formatBalance(account.balance)}
          </span>
        </div>
      </div>
      
      <button className="btn-refresh" onClick={fetchAccount} disabled={isLoading}>
        {isLoading ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
};
