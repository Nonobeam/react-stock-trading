import { useState } from 'react'
import './App.css'
import { ErrorBoundary } from './shared/components'
import { 
  MarketDataProvider, 
  AccountProvider, 
  PositionsProvider, 
  SetupsProvider 
} from './context'

// Import Phase 1 screens
import { DashboardView } from './features/dashboard'
import { WatchlistView } from './features/watchlist'
import { PortfolioView } from './features/portfolio'
import { SignalsView } from './features/signals'

type ViewType = 'dashboard' | 'watchlist' | 'portfolio' | 'signals';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  return (
    <ErrorBoundary>
      <MarketDataProvider>
        <AccountProvider>
          <PositionsProvider>
            <SetupsProvider>
              <div className="app">
                {/* Navigation Bar */}
                <nav className="app-nav">
                  <div className="app-nav__brand">
                    <span className="app-nav__logo">VN Trading</span>
                    <span className="app-nav__subtitle">Phase 1 MVP</span>
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
                  </div>
                </nav>

                {/* Main Content */}
                <main className="app-main">
                  {currentView === 'dashboard' && <DashboardView />}
                  {currentView === 'watchlist' && <WatchlistView />}
                  {currentView === 'portfolio' && <PortfolioView />}
                  {currentView === 'signals' && <SignalsView />}
                </main>
              </div>
            </SetupsProvider>
          </PositionsProvider>
        </AccountProvider>
      </MarketDataProvider>
    </ErrorBoundary>
  )
}

export default App
