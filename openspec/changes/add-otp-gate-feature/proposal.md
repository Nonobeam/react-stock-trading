# Change: Add OTP Gate Feature

## Why
The application needs access control to ensure only authorized users can view the trading platform. An OTP gate provides a simple authentication mechanism where users must enter a valid 6-digit OTP code before accessing the application.

## What Changes
- Add OTP gate that intercepts app access on initial load
- Implement GET /api/otp check on app initialization
- Display full-screen OTP entry modal when no valid OTP exists
- Blur and disable background UI during OTP entry
- Implement POST /api/otp to submit new OTP code
- Display current OTP with TTL in a persistent, non-intrusive location (navbar badge)
- Use existing Modal component pattern with enhanced backdrop blur

## Impact
- Affected specs: `otp-gate` (new capability)
- Affected code:
  - `src/App.tsx` - Add OTP gate wrapper
  - `src/services/api/client.ts` - Add OTP API endpoints
  - `src/context/` - New OTPContext for state management
  - `src/shared/components/` - OtpGateModal component
  - `src/shared/components/` - OtpBadge component for navbar

## User Experience
1. User visits the web application
2. App calls GET /api/otp to check if valid OTP exists
3. If no OTP or expired:
   - Full-screen modal appears with 6-digit OTP input
   - Background is heavily blurred (cannot see content clearly)
   - User enters OTP and submits via POST /api/otp
   - On success, modal closes and user can access the app
4. If valid OTP exists:
   - User proceeds to app directly
   - OTP code and remaining TTL shown in navbar as a small badge
5. OTP badge refreshes periodically to show accurate TTL

## Theme Compliance
All UI elements will strictly follow the Fintech Neon Theme:
- Modal uses `--panel`, `--border`, `--radius-lg`
- Inputs use accent glow on focus
- Primary button uses `--accent` with hover glow
- Backdrop uses enhanced blur (12-16px) with dark overlay
- OTP badge uses subtle `--accent-muted` background
