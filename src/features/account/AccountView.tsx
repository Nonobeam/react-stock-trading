import React from 'react';
import { AccountInfoCard } from './components/AccountInfoCard';
import { PortfolioTable } from './components/PortfolioTable';
import './AccountView.css';

export const AccountView: React.FC = () => {
  return (
    <div className="account-view">
      <div className="account-view__header">
        <h1>Account & Portfolio</h1>
        <p className="account-view__subtitle">
          View your account balance and portfolio holdings
        </p>
      </div>

      <div className="account-view__content">
        <AccountInfoCard />
        
        <div className="portfolio-section">
          <h2>Portfolio Holdings</h2>
          <PortfolioTable />
        </div>
      </div>
    </div>
  );
};
