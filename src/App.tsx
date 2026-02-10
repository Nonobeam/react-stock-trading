import { useState } from 'react'
import './App.css'
import { ErrorBoundary, OtpGateModal, OtpBadge, LoadingSpinner } from './shared/components'
import { 
  MarketDataProvider, 
  AccountProvider, 
  PositionsProvider, 
  SetupsProvider,
  OTPProvider,
  useOtp
} from './context'

// Import Phase 1 screens
import { DashboardView } from './features/dashboard'
import { WatchlistView } from './features/watchlist'
import { PortfolioView } from './features/portfolio'
import { SignalsView } from './features/signals'

// Import Phase 2 screens
import { JournalView } from './features/journal'
import { SettingsView } from './features/settings'
import { BacktestView } from './features/backtest'
import { CoachView } from './features/coach'

// Import Phase 3 screens
import { ScannerView } from './features/scanner'

type ViewType = 'dashboard' | 'watchlist' | 'portfolio' | 'signals' | 'scanner' | 'journal' | 'settings' | 'backtest' | 'coach';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const { isAuthenticated, isLoading, otpStatus, error, submitOtp, clearError } = useOtp();

  // Show loading state during initial OTP check
  if (isLoading) {
    return (
      <div className="app-loading">
        <LoadingSpinner size="large" />
        <p className="app-loading__text">Verifying access...</p>
      </div>
    );
  }

  return (
    <>
      {/* OTP Gate Modal - blocks access when not authenticated */}
      <OtpGateModal
        isOpen={!isAuthenticated}
        onSubmit={submitOtp}
        error={error}
        onClearError={clearError}
      />

      <MarketDataProvider>
        <AccountProvider>
          <PositionsProvider>
            <SetupsProvider>
              <div className="app">
                {/* Navigation Bar */}
                <nav className="app-nav">
                  <div className="app-nav__brand">
                    <span className="app-nav__logo">VN Trading</span>
                    <span className="app-nav__subtitle">v1.0.0</span>
                  </div>
                  
                  <div className="app-nav__links">
                    <button
                      className={`app-nav__link ${currentView === 'dashboard' ? 'active' : ''}`}
                      onClick={() => setCurrentView('dashboard')}
                    >
                      Dashboard
                    </button>
                    <button
                      className={`app-nav__link ${currentView === 'watchlist' ? 'active' : ''}`}
                      onClick={() => setCurrentView('watchlist')}
                    >
                      Watchlist
                    </button>
                    <button
                      className={`app-nav__link ${currentView === 'portfolio' ? 'active' : ''}`}
                      onClick={() => setCurrentView('portfolio')}
                    >
                      Portfolio
                    </button>
                    <button
                      className={`app-nav__link ${currentView === 'signals' ? 'active' : ''}`}
                      onClick={() => setCurrentView('signals')}
                    >
                      Signals
                    </button>
                    <button
                      className={`app-nav__link ${currentView === 'scanner' ? 'active' : ''}`}
                      onClick={() => setCurrentView('scanner')}
                    >
                      Scanner
                    </button>
                    <button
                      className={`app-nav__link ${currentView === 'journal' ? 'active' : ''}`}
                      onClick={() => setCurrentView('journal')}
                    >
                      Journal
                    </button>
                    <button
                      className={`app-nav__link ${currentView === 'backtest' ? 'active' : ''}`}
                      onClick={() => setCurrentView('backtest')}
                    >
                      Backtest
                    </button>
                    <button
                      className={`app-nav__link ${currentView === 'coach' ? 'active' : ''}`}
                      onClick={() => setCurrentView('coach')}
                    >
                      AI Coach
                    </button>
                    <button
                      className={`app-nav__link ${currentView === 'settings' ? 'active' : ''}`}
                      onClick={() => setCurrentView('settings')}
                    >
                      Settings
                    </button>
                  </div>

                  {/* OTP Badge - shows current OTP and TTL */}
                  {isAuthenticated && otpStatus && (
                    <div className="app-nav__otp">
                      <OtpBadge otp={otpStatus.otp} ttl={otpStatus.ttl} />
                    </div>
                  )}
                </nav>

                {/* Main Content */}
                <main className="app-main">
                  {currentView === 'dashboard' && <DashboardView />}
                  {currentView === 'watchlist' && <WatchlistView />}
                  {currentView === 'portfolio' && <PortfolioView />}
                  {currentView === 'signals' && <SignalsView />}
                  {currentView === 'scanner' && <ScannerView />}
                  {currentView === 'journal' && <JournalView />}
                  {currentView === 'backtest' && <BacktestView />}
                  {currentView === 'coach' && <CoachView />}
                  {currentView === 'settings' && <SettingsView />}
                </main>
              </div>
            </SetupsProvider>
          </PositionsProvider>
        </AccountProvider>
      </MarketDataProvider>
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <OTPProvider>
        <AppContent />
      </OTPProvider>
    </ErrorBoundary>
  );
}

export default App
