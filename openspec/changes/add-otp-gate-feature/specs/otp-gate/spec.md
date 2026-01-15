# OTP Gate Specification

## ADDED Requirements

### Requirement: OTP Access Gate
The system SHALL gate access to the application by requiring a valid OTP before allowing users to interact with the trading platform.

#### Scenario: App loads without valid OTP
- **WHEN** user navigates to the application
- **AND** GET /api/otp returns no OTP or expired OTP
- **THEN** a full-screen OTP entry modal SHALL be displayed
- **AND** the background UI SHALL be blurred and non-interactive
- **AND** user cannot access any application features

#### Scenario: App loads with valid OTP
- **WHEN** user navigates to the application
- **AND** GET /api/otp returns a valid OTP with remaining TTL
- **THEN** the OTP gate modal SHALL NOT be displayed
- **AND** user can access all application features

#### Scenario: App loading state
- **WHEN** user navigates to the application
- **AND** OTP status check is in progress
- **THEN** a loading indicator SHALL be displayed
- **AND** no application content SHALL be visible

---

### Requirement: OTP Entry Modal
The system SHALL provide a themed modal for OTP entry that blocks all background interaction.

#### Scenario: Modal display
- **WHEN** OTP gate modal is displayed
- **THEN** the modal SHALL use strong backdrop blur (16px minimum)
- **AND** backdrop opacity SHALL be at least 0.85
- **AND** the modal SHALL follow Fintech Neon Theme design

#### Scenario: OTP input interface
- **WHEN** OTP gate modal is displayed
- **THEN** 6 individual digit input boxes SHALL be shown
- **AND** first input box SHALL be auto-focused
- **AND** inputs SHALL auto-advance on digit entry
- **AND** backspace SHALL navigate to previous input

#### Scenario: Clipboard paste support
- **WHEN** user pastes a 6-digit code into OTP input
- **THEN** all 6 digits SHALL be distributed across input boxes
- **AND** focus SHALL move to the last filled box

---

### Requirement: OTP Submission
The system SHALL submit the entered OTP via POST /api/otp for validation.

#### Scenario: Successful OTP submission
- **WHEN** user enters 6 digits and submits
- **AND** POST /api/otp returns success
- **THEN** the OTP gate modal SHALL close
- **AND** user SHALL be granted access to the application
- **AND** OTP badge SHALL appear in navbar

#### Scenario: Failed OTP submission
- **WHEN** user enters 6 digits and submits
- **AND** POST /api/otp returns error
- **THEN** an error message SHALL be displayed
- **AND** OTP input SHALL be cleared
- **AND** first input box SHALL be re-focused
- **AND** user SHALL remain in the OTP gate modal

#### Scenario: Submit button state
- **WHEN** fewer than 6 digits are entered
- **THEN** submit button SHALL be disabled
- **WHEN** exactly 6 digits are entered
- **THEN** submit button SHALL be enabled

#### Scenario: Loading state during submission
- **WHEN** OTP submission is in progress
- **THEN** submit button SHALL show loading indicator
- **AND** inputs SHALL be disabled
- **AND** user cannot modify or re-submit

---

### Requirement: OTP Status Badge
The system SHALL display the current OTP and TTL in a persistent, non-intrusive location.

#### Scenario: Badge display
- **WHEN** user has valid OTP
- **THEN** OTP badge SHALL appear in navbar
- **AND** current OTP code SHALL be visible
- **AND** remaining TTL SHALL be shown as countdown

#### Scenario: Badge styling
- **WHEN** OTP badge is displayed
- **THEN** it SHALL be small and non-intrusive
- **AND** OTP code SHALL use monospace font
- **AND** it SHALL follow Fintech Neon Theme (accent-muted background)

#### Scenario: Low TTL warning
- **WHEN** TTL is below 60 seconds
- **THEN** badge SHALL show warning state
- **AND** TTL countdown SHALL use warning color

---

### Requirement: OTP TTL Polling
The system SHALL periodically refresh OTP status to maintain accurate TTL display.

#### Scenario: TTL refresh
- **WHEN** user has valid OTP access
- **THEN** system SHALL poll GET /api/otp every 30 seconds
- **AND** badge TTL SHALL update accordingly

#### Scenario: OTP expiration during session
- **WHEN** OTP expires while user is active (TTL reaches 0)
- **THEN** OTP gate modal SHALL be displayed
- **AND** user access SHALL be revoked
- **AND** user must enter new OTP

---

### Requirement: Backdrop Blur Effect
The system SHALL blur the application background when OTP gate modal is active to prevent content visibility.

#### Scenario: Blur intensity
- **WHEN** OTP gate modal is displayed
- **THEN** background blur SHALL be 16px minimum
- **AND** background content SHALL NOT be clearly readable
- **AND** background elements SHALL NOT be interactive

#### Scenario: Theme compliance
- **WHEN** OTP gate is active
- **THEN** all UI elements SHALL follow Fintech Neon Theme
- **AND** colors SHALL use theme CSS variables
- **AND** transitions SHALL use theme transition timing
