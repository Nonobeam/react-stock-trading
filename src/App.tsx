import { useState, lazy, Suspense } from 'react'
import './App.css'
import { Navigation, ErrorBoundary, LoadingSpinner } from './shared/components'

// Lazy load feature views for code splitting
const MarketDataView = lazy(() => import('./features/market/MarketDataView').then(m => ({ default: m.MarketDataView })));
const RegimeView = lazy(() => import('./features/regime/RegimeView').then(m => ({ default: m.RegimeView })));
const ScannerView = lazy(() => import('./features/scanner').then(m => ({ default: m.ScannerView })));
const RiskView = lazy(() => import('./features/risk').then(m => ({ default: m.RiskView })));
const MonitoringView = lazy(() => import('./features/monitoring').then(m => ({ default: m.MonitoringView })));
const PerformanceView = lazy(() => import('./features/analytics').then(m => ({ default: m.PerformanceView })));

type ViewType = 'dashboard' | 'market-data' | 'regime' | 'scanner' | 'risk' | 'monitoring' | 'analytics';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [currentSymbol, setCurrentSymbol] = useState('VNM');

  return (
    <ErrorBoundary>
      <div className="app">
        <Navigation currentView={currentView} onNavigate={setCurrentView} />

        <main className="app-main">
          {currentView === 'dashboard' ? (
            <div className="dashboard-grid">
              <div className="dashboard-section">
                <h2 className="dashboard-section__title">Market Overview</h2>
                <Suspense fallback={<LoadingSpinner message="Loading market data..." />}>
                  <MarketDataView defaultSymbol={currentSymbol} defaultTimeframe="15m" />
                </Suspense>
              </div>

              <div className="dashboard-section">
                <h2 className="dashboard-section__title">Market Regime</h2>
                <Suspense fallback={<LoadingSpinner message="Loading regime..." />}>
                  <RegimeView symbol={currentSymbol} onSymbolChange={setCurrentSymbol} />
                </Suspense>
              </div>

              <div className="dashboard-section">
                <h2 className="dashboard-section__title">Trade Setups</h2>
                <Suspense fallback={<LoadingSpinner message="Loading setups..." />}>
                  <ScannerView />
                </Suspense>
              </div>

              <div className="dashboard-section">
                <h2 className="dashboard-section__title">Active Positions</h2>
                <Suspense fallback={<LoadingSpinner message="Loading positions..." />}>
                  <MonitoringView />
                </Suspense>
              </div>

              <div className="dashboard-section">
                <h2 className="dashboard-section__title">Performance</h2>
                <Suspense fallback={<LoadingSpinner message="Loading analytics..." />}>
                  <PerformanceView />
                </Suspense>
              </div>

              <div className="dashboard-section">
                <h2 className="dashboard-section__title">Risk Calculator</h2>
                <Suspense fallback={<LoadingSpinner message="Loading risk calculator..." />}>
                  <RiskView />
                </Suspense>
              </div>
            </div>
          ) : currentView === 'market-data' ? (
            <Suspense fallback={<LoadingSpinner fullScreen message="Loading Market Data..." />}>
              <MarketDataView defaultSymbol={currentSymbol} defaultTimeframe="15m" />
            </Suspense>
          ) : currentView === 'regime' ? (
            <Suspense fallback={<LoadingSpinner fullScreen message="Loading Regime Analysis..." />}>
              <RegimeView 
                symbol={currentSymbol} 
                onSymbolChange={setCurrentSymbol}
              />
            </Suspense>
          ) : currentView === 'scanner' ? (
            <Suspense fallback={<LoadingSpinner fullScreen message="Loading Setup Scanner..." />}>
              <ScannerView />
            </Suspense>
          ) : currentView === 'risk' ? (
            <Suspense fallback={<LoadingSpinner fullScreen message="Loading Risk Calculator..." />}>
              <RiskView />
            </Suspense>
          ) : currentView === 'monitoring' ? (
            <Suspense fallback={<LoadingSpinner fullScreen message="Loading Position Monitor..." />}>
              <MonitoringView />
            </Suspense>
          ) : currentView === 'analytics' ? (
            <Suspense fallback={<LoadingSpinner fullScreen message="Loading Performance Analytics..." />}>
              <PerformanceView />
            </Suspense>
          ) : null}
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App
