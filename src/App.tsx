import { useState } from "react";
import "./App.css";
import {
  ErrorBoundary,
  OtpGateModal,
  LoadingSpinner,
} from "./shared/components";
import {
  MarketDataProvider,
  AccountProvider,
  PositionsProvider,
  SetupsProvider,
  OTPProvider,
  useOtp,
} from "./context";

// Import Phase 1 screens
import { DashboardView } from "./features/dashboard";
import { WatchlistView } from "./features/watchlist";
import { PortfolioView } from "./features/portfolio";
import { SignalsView } from "./features/signals";

// Import Phase 2 screens
import { JournalView } from "./features/journal";
import { SettingsView } from "./features/settings";
import { BacktestView } from "./features/backtest";
import { CoachView } from "./features/coach";

// Import Phase 3 screens
import { ScannerView } from "./features/scanner";

type ViewType =
  | "dashboard"
  | "watchlist"
  | "portfolio"
  | "signals"
  | "scanner"
  | "journal"
  | "settings"
  | "backtest"
  | "coach";

// Navigation item definition
interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ReactNode;
}

// SVG icons (thin-stroke monochrome, 20×20)
const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "watchlist",
    label: "Watchlist",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: "signals",
    label: "Signals",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    id: "scanner",
    label: "Scanner",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    id: "journal",
    label: "Journal",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: "backtest",
    label: "Backtest",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    ),
  },
  {
    id: "coach",
    label: "AI Coach",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
        <path d="M12 2a10 10 0 0 1 10 10" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
];

const settingsItem: NavItem = {
  id: "settings",
  label: "Settings",
  icon: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

// Placeholder news items
const newsItems = [
  {
    id: 1,
    tag: "Market",
    tagColor: "lime",
    time: "2m ago",
    title:
      "VN-Index rebounds as banking stocks surge amid easing credit concerns",
    source: "VnExpress",
  },
  {
    id: 2,
    tag: "Macro",
    tagColor: "purple",
    time: "18m ago",
    title:
      "Fed signals hold on rates; emerging market equities rally on dollar weakness",
    source: "Reuters",
  },
  {
    id: 3,
    tag: "Sector",
    tagColor: "lavender",
    time: "45m ago",
    title:
      "Steel & materials lead gains after government announces infrastructure spend",
    source: "Bloomberg",
  },
  {
    id: 4,
    tag: "Market",
    tagColor: "lime",
    time: "1h ago",
    title: "HPG, HSG outperform benchmark on strong export order data",
    source: "CafeF",
  },
  {
    id: 5,
    tag: "Macro",
    tagColor: "purple",
    time: "2h ago",
    title:
      "Vietnam Q1 GDP growth beats forecast at 6.8%, boosting equity sentiment",
    source: "MoF",
  },
  {
    id: 6,
    tag: "Sector",
    tagColor: "lavender",
    time: "3h ago",
    title: "Real estate sector cautious as credit growth tightening continues",
    source: "VnEconomy",
  },
  {
    id: 7,
    tag: "Market",
    tagColor: "lime",
    time: "4h ago",
    title: "Foreign investors net buy $12M on HoSE — third session in a row",
    source: "SSI Research",
  },
];

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const {
    isAuthenticated,
    isLoading,
    otpStatus,
    error,
    submitOtp,
    clearError,
  } = useOtp();

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
                {/* ── Slim Icon Sidebar ── */}
                <aside className="app-sidebar">
                  {/* Logo mark */}
                  <div className="app-sidebar__logo">
                    <span className="app-sidebar__logo-mark">G</span>
                  </div>

                  {/* Primary nav icons */}
                  <nav className="app-sidebar__nav">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        className={`app-sidebar__item ${currentView === item.id ? "app-sidebar__item--active" : ""}`}
                        onClick={() => setCurrentView(item.id)}
                        title={item.label}
                        aria-label={item.label}
                      >
                        {item.icon}
                        <span className="app-sidebar__tooltip">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </nav>

                  {/* Bottom: OTP icon + settings */}
                  <div className="app-sidebar__bottom">
                    {isAuthenticated && otpStatus && (
                      <button
                        className="app-sidebar__item app-sidebar__item--otp"
                        title={`OTP: ${otpStatus.otp}`}
                        aria-label={`OTP: ${otpStatus.otp}`}
                        tabIndex={-1}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span className="app-sidebar__tooltip">
                          {otpStatus.otp} ·{" "}
                          {Math.ceil((otpStatus.ttl ?? 0) / 60)}m
                        </span>
                      </button>
                    )}
                    <button
                      className={`app-sidebar__item ${currentView === "settings" ? "app-sidebar__item--active" : ""}`}
                      onClick={() => setCurrentView("settings")}
                      title={settingsItem.label}
                      aria-label={settingsItem.label}
                    >
                      {settingsItem.icon}
                      <span className="app-sidebar__tooltip">
                        {settingsItem.label}
                      </span>
                    </button>
                  </div>
                </aside>

                {/* ── News Panel ── */}
                <aside className="app-news">
                  <div className="app-news__header">
                    <h2 className="app-news__title">Market News</h2>
                    <span className="app-news__live">
                      <span className="app-news__live-dot" />
                      Live
                    </span>
                  </div>

                  <div className="app-news__feed">
                    {newsItems.map((item) => (
                      <article key={item.id} className="app-news__item">
                        <div className="app-news__item-meta">
                          <span
                            className={`app-news__tag app-news__tag--${item.tagColor}`}
                          >
                            {item.tag}
                          </span>
                          <span className="app-news__time">{item.time}</span>
                        </div>
                        <p className="app-news__headline">{item.title}</p>
                        <span className="app-news__source">{item.source}</span>
                      </article>
                    ))}
                  </div>
                </aside>

                {/* ── Main Content ── */}
                <main className="app-main">
                  {currentView === "dashboard" && <DashboardView />}
                  {currentView === "watchlist" && <WatchlistView />}
                  {currentView === "portfolio" && <PortfolioView />}
                  {currentView === "signals" && <SignalsView />}
                  {currentView === "scanner" && <ScannerView />}
                  {currentView === "journal" && <JournalView />}
                  {currentView === "backtest" && <BacktestView />}
                  {currentView === "coach" && <CoachView />}
                  {currentView === "settings" && <SettingsView />}
                </main>
              </div>
            </SetupsProvider>
          </PositionsProvider>
        </AccountProvider>
      </MarketDataProvider>
    </>
  );
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

export default App;
