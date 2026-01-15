# Tasks: Add OTP Gate Feature

## 1. API Layer
- [x] 1.1 Create OTP type definitions in `src/shared/types/otp.ts`
- [x] 1.2 Add OTP API functions in `src/services/api/otpApi.ts`
- [x] 1.3 Export OTP API from `src/services/api/index.ts`

## 2. Context Setup
- [x] 2.1 Create OTPContext in `src/context/OTPContext.tsx`
- [x] 2.2 Implement `checkOTP()` function (GET /api/otp)
- [x] 2.3 Implement `submitOTP()` function (POST /api/otp)
- [x] 2.4 Implement TTL polling mechanism
- [x] 2.5 Export OTPContext from `src/context/index.tsx`

## 3. OTP Input Component
- [x] 3.1 Create `OtpInput.tsx` with 6 digit boxes
- [x] 3.2 Implement auto-focus progression between digits
- [x] 3.3 Handle backspace navigation
- [x] 3.4 Support clipboard paste
- [x] 3.5 Style with `OtpInput.css` following Fintech Neon Theme

## 4. OTP Gate Modal Component
- [x] 4.1 Create `OtpGateModal.tsx` with strong backdrop blur
- [x] 4.2 Integrate OtpInput component
- [x] 4.3 Add submit button with loading state
- [x] 4.4 Display error messages
- [x] 4.5 Style with `OtpGateModal.css` following Fintech Neon Theme
- [x] 4.6 Export from `src/shared/components/index.ts`

## 5. OTP Badge Component
- [x] 5.1 Create `OtpBadge.tsx` displaying OTP and TTL
- [x] 5.2 Format TTL as countdown (e.g., "5:32")
- [x] 5.3 Style with `OtpBadge.css` following Fintech Neon Theme
- [x] 5.4 Add low TTL warning visual state
- [x] 5.5 Export from `src/shared/components/index.ts`

## 6. App Integration
- [x] 6.1 Wrap App with OTPProvider in `App.tsx`
- [x] 6.2 Add OTP gate logic to show/hide OtpGateModal
- [x] 6.3 Integrate OtpBadge into navbar
- [x] 6.4 Handle loading state during initial OTP check

## 7. Validation & Testing
- [x] 7.1 Verify OTP gate blocks access when no OTP
- [x] 7.2 Verify OTP submission works correctly
- [x] 7.3 Verify OTP badge displays and updates
- [x] 7.4 Verify theme compliance (colors, spacing, transitions)
- [x] 7.5 Test keyboard navigation and accessibility
