# Design: OTP Gate Feature

## Context
The trading platform requires a simple access control mechanism using OTP (One-Time Password). The backend provides two endpoints:
- `GET /api/otp` - Returns current OTP and TTL (Time To Live)
- `POST /api/otp` - Sets a new OTP code

The frontend must gate access to the application, requiring a valid OTP before users can interact with any features.

## Goals
- Gate all app access behind OTP verification
- Provide clear UX for OTP entry with themed UI
- Show current OTP status in a visible but non-intrusive location
- Handle OTP expiration gracefully
- Follow Fintech Neon Theme design system

## Non-Goals
- User registration/login system
- Password-based authentication
- OTP generation (handled by backend)
- Session persistence across browser tabs

## Decisions

### 1. Architecture: Context-Based State Management
**Decision:** Use React Context (OTPContext) to manage OTP state globally.

**Rationale:**
- Consistent with existing patterns (AccountContext, SettingsContext)
- Provides clean access to OTP state from any component
- Centralizes API calls and state management
- Enables easy polling/refresh of OTP TTL

**Alternatives Considered:**
- Local state in App.tsx: Too coupled, harder to access from navbar
- Redux/Zustand: Overkill for single-purpose state

### 2. UI Pattern: Full-Screen Modal Gate
**Decision:** Use enhanced Modal component with strong backdrop blur and disabled close.

**Rationale:**
- Modal pattern already exists and is themed
- Full-screen prevents any interaction with app
- Strong blur (16px) makes content unreadable but hints at app behind
- Centered OTP input draws focus

**Alternatives Considered:**
- Separate login page: More complex routing, not needed for simple OTP
- Inline overlay: Less clear separation, harder to style

### 3. OTP Input: 6 Separate Digit Boxes
**Decision:** Use 6 individual input boxes for OTP digits with auto-focus progression.

**Rationale:**
- Clear visual representation of 6-digit requirement
- Better UX with auto-tab between digits
- Common pattern in fintech applications
- Easier validation per-digit

**Alternatives Considered:**
- Single input field: Less visual, harder to see progress
- Masked input: Unnecessary complexity

### 4. OTP Status Display: Navbar Badge
**Decision:** Small badge in navbar showing OTP code and TTL countdown.

**Rationale:**
- Always visible but not intrusive
- User can quickly reference current OTP
- TTL countdown helps awareness of expiration
- Badge pattern fits fintech aesthetic

**Alternatives Considered:**
- Settings panel: Not frequently visible
- Toast notification: Temporary, not persistent
- Footer: Less visible, may be scrolled away

### 5. API Integration Pattern
**Decision:** Add OTP endpoints to existing APIClient class.

**Rationale:**
- Consistent with existing API patterns
- Reuses error handling and base URL config
- Type-safe with TypeScript interfaces

## Component Structure

```
src/
├── context/
│   └── OTPContext.tsx           # OTP state management
├── shared/
│   ├── components/
│   │   ├── OtpGateModal.tsx     # Full-screen OTP entry modal
│   │   ├── OtpGateModal.css
│   │   ├── OtpInput.tsx         # 6-digit OTP input component
│   │   ├── OtpInput.css
│   │   ├── OtpBadge.tsx         # Navbar OTP status badge
│   │   └── OtpBadge.css
│   └── types/
│       └── otp.ts               # OTP-related types
├── services/
│   └── api/
│       └── otpApi.ts            # OTP API functions
└── App.tsx                      # OTPProvider wrapper + gate logic
```

## State Flow

```
App Load
    │
    ▼
GET /api/otp
    │
    ├─ Success (OTP exists) ──────► Show App + OtpBadge
    │                                    │
    │                                    ▼
    │                              Start TTL polling
    │
    └─ No OTP / Expired ──────────► Show OtpGateModal
                                         │
                                         ▼
                                   User enters OTP
                                         │
                                         ▼
                                   POST /api/otp
                                         │
                                    ├─ Success ──► Close modal, show app
                                    │
                                    └─ Error ────► Show error, retry
```

## API Interfaces

```typescript
interface OTPStatus {
  otp: string;        // Current OTP code
  ttl: number;        // Time to live in seconds
  expiresAt: string;  // ISO timestamp of expiration
}

interface OTPSetRequest {
  otp: string;        // 6-digit OTP to set
}

interface OTPSetResponse {
  success: boolean;
  message?: string;
}
```

## Theme Integration

### OtpGateModal
- Backdrop: `rgba(0, 0, 0, 0.85)` + `blur(16px)` - stronger than standard modal
- Modal panel: `--panel` background, `--radius-lg` border radius
- Title: `--text` color, centered
- Subtitle: `--text-secondary`, explains what to do

### OtpInput
- Each digit box: `--panel` background, `--border` border
- Focus state: `--accent` border + `--glow-accent` shadow
- Filled state: Subtle `--accent-muted` background
- Error state: `--danger` border and message

### OtpBadge
- Container: `--panel-elevated` background, `--radius-sm` corners
- OTP text: `--accent` color, monospace font
- TTL text: `--text-secondary`, small font
- Position: Right side of navbar, before user actions

## Risks / Trade-offs

### Risk: Network failure during OTP check
**Mitigation:** Show loading state, retry button, clear error messaging

### Risk: OTP expires while user is active
**Mitigation:** Poll TTL every 30 seconds, show warning at 1 minute remaining

### Trade-off: No "remember me" option
**Accepted:** Simpler implementation, OTP re-entry on refresh is acceptable for security

## Open Questions
- ~~Should OTP be hidden/masked in badge?~~ No, user needs to see it for reference
- ~~Should we support paste from clipboard?~~ Yes, handle paste in OtpInput
