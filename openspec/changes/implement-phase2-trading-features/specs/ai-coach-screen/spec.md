# Specification: AI Coach Screen

**Capability**: `ai-coach-screen`  
**Status**: New  
**Related Changes**: `implement-phase2-trading-features`

## Overview

The AI Coach Screen provides a conversational interface for trading questions, analysis, coaching, and learning. This Phase 2 implementation delivers the complete UI with mock AI responses, preparing for future LLM backend integration.

## ADDED Requirements

### Requirement: AICOACH-UI-001 - Chat Interface

The system shall provide a responsive chat interface with message history and rich formatting support.

#### Scenario: Initiating a new conversation
**Given** the user navigates to the AI Coach screen  
**When** the page loads  
**Then** the system displays a welcome message:
"Hello! I'm your trading coach. I can help you with strategy, analysis, risk management, and learning."  
**And** displays quick action suggestions:
- "Analyze a setup: @VCB or @HPG"
- "Review portfolio: @Portfolio"
- "Check a trade: @Trade-VNM-Jan17"
- "Ask anything!"  
**And** shows empty conversation area above input field  
**And** focuses the input field for immediate typing

#### Scenario: Sending a text message
**Given** the user has typed a question in the input field  
**When** the user presses Enter or clicks Send button  
**Then** the system displays the user's message in the chat area (right-aligned, distinct background)  
**And** displays a loading indicator (typing dots animation)  
**And** generates a mock AI response based on message content  
**And** displays AI response in chat area (left-aligned, with AI avatar icon)  
**And** clears the input field  
**And** scrolls to show the latest message

#### Scenario: AI response with markdown formatting
**Given** the AI generates a response with markdown  
**When** the response contains `**bold**`, `*italic*`, inline `code`, lists, or tables  
**Then** the system renders the markdown with proper formatting  
**And** applies Fintech Neon theme styling to formatted elements  
**And** code blocks display with syntax highlighting  
**And** tables are scrollable if content exceeds width

#### Scenario: AI response with action buttons
**Given** the AI response includes actionable recommendations  
**When** the response is rendered  
**Then** inline action buttons appear within the message:
- "[EXECUTE TRADE]" - Opens execution guide
- "[VIEW CHART]" - Opens full-screen chart
- "[COMPARE POSITIONS]" - Opens comparison modal  
**When** the user clicks an action button  
**Then** the corresponding action executes immediately  
**And** the conversation continues in context

---

### Requirement: AICOACH-UI-002 - Context Injection via @Mentions

The system shall allow users to inject live data context into conversations using @mention syntax.

#### Scenario: Mentioning a stock symbol
**Given** the user types "@" in the input field  
**When** the autocomplete dropdown appears  
**Then** the system shows all watchlist symbols and portfolio positions  
**When** the user types "VC"  
**Then** the dropdown filters to show matching symbols (VCB, VCI, etc.)  
**When** the user selects "@VCB"  
**Then** the system injects current VCB data into the message context:
- Current price
- Technical indicators (RSI, MACD, EMAs)
- Setup status
- Volume data  
**And** the mock AI response references this injected data

#### Scenario: Mentioning portfolio
**Given** the user types "@Portfolio" and sends  
**When** the AI generates a response  
**Then** the response includes current portfolio data:
- Open positions count
- Total value
- Aggregate risk
- P/L summary
- Sector allocation  
**And** provides relevant insights based on portfolio state

#### Scenario: Mentioning a specific trade
**Given** the user has trades logged in Journal  
**When** the user types "@Trade-" in input  
**Then** the autocomplete shows recent trades (e.g., "@Trade-VNM-Jan17")  
**When** the user selects a trade mention  
**Then** the system injects trade details into context:
- Entry/exit prices and dates
- P/L and R-multiple
- Setup type
- User notes  
**And** the AI can discuss that specific trade

---

### Requirement: AICOACH-UI-003 - Artifacts Panel

The system shall display complex visualizations and rich content in a separate artifacts panel.

#### Scenario: AI generates a chart artifact
**Given** the user asks "Show me my equity curve"  
**When** the AI response includes chart data  
**Then** the system opens the artifacts panel (right side, 40% width)  
**And** displays an interactive equity curve chart  
**And** the chart remains visible while conversation continues  
**And** provides full-screen option for the artifact  
**And** provides download option (PNG or SVG)

#### Scenario: AI generates a data table artifact
**Given** the user asks "Compare my last 10 trades"  
**When** the AI generates tabular data  
**Then** the system displays a sortable, filterable table in artifacts panel  
**And** the table columns match relevant trade metrics  
**And** rows are clickable to view trade details  
**And** provides CSV export option

#### Scenario: Multiple artifacts in one session
**Given** the user has requested multiple charts/tables  
**When** artifacts panel contains multiple items  
**Then** the system displays tabs at top of artifacts panel  
**And** tab labels identify each artifact (e.g., "Equity Curve", "Trade Comparison")  
**And** user can switch between artifact tabs  
**And** can close individual artifacts with × button

---

### Requirement: AICOACH-UI-004 - Conversation History

The system shall persist conversation history and allow users to manage past conversations.

#### Scenario: Saving conversation automatically
**Given** the user has an active conversation  
**When** the user sends a message  
**Then** the system saves the entire conversation to localStorage  
**And** assigns a conversation ID and timestamp  
**And** auto-generates a title from first user message (truncated to 50 chars)

#### Scenario: Viewing conversation history sidebar
**Given** the user has multiple past conversations  
**When** the user clicks "Conversation History" dropdown  
**Then** the system displays a sidebar list of conversations organized by date:
- Today
- Yesterday
- Last 7 days
- Last 30 days
- Older  
**And** each conversation shows title and timestamp  
**When** the user clicks a past conversation  
**Then** the system loads that conversation into the main chat area  
**And** all messages and context are restored

#### Scenario: Searching conversation history
**Given** the user wants to find a specific past conversation  
**When** the user types in the conversation history search field  
**Then** the system filters conversations by title and message content  
**And** highlights matching text in results  
**And** updates results in real-time as user types

#### Scenario: Starring important conversations
**Given** the user wants to mark a conversation for easy access  
**When** the user clicks the star icon next to a conversation  
**Then** the system marks it as starred  
**And** starred conversations appear at top of history list  
**And** star icon changes to filled state

#### Scenario: Deleting a conversation
**Given** the user wants to remove a conversation  
**When** the user clicks the delete icon next to a conversation  
**Then** the system displays confirmation dialog "Delete this conversation?"  
**When** the user confirms  
**Then** the system removes the conversation from history  
**And** removes from localStorage  
**And** displays toast "Conversation deleted"

---

### Requirement: AICOACH-UI-005 - Mock AI Response System

The system shall provide intelligent mock responses using pattern matching and context awareness until backend LLM integration is available.

#### Scenario: Trade analysis request
**Given** the user asks "Should I take the VCB signal?"  
**When** the mock AI processes the request  
**Then** the system:
1. Detects "should I take" + symbol pattern
2. Fetches current VCB signal data from SetupsContext
3. Generates structured mock response including:
   - Setup quality assessment (score-based)
   - Strengths checklist (✅ items)
   - Concerns checklist (⚠️ items)
   - Clear recommendation (YES/NO/MAYBE with reasoning)
   - Risk management considerations
   - Action buttons ([EXECUTE TRADE], [ADJUST SIZE])

#### Scenario: Performance review request
**Given** the user asks "How am I doing this month?"  
**When** the mock AI processes the request  
**Then** the system:
1. Queries TradesContext for current month trades
2. Calculates metrics (win rate, total P/L, R-multiple)
3. Generates mock response with:
   - Summary statistics
   - Best and worst trades
   - Strengths identified
   - Areas for improvement
   - Comparison to previous months  
**And** creates equity curve artifact if data sufficient

#### Scenario: Educational query
**Given** the user asks "Explain RSI divergence"  
**When** the mock AI processes the request  
**Then** the system:
1. Detects educational keyword pattern
2. Provides pre-written explanation from knowledge base
3. Finds example from user's watchlist if available
4. Offers to quiz user for comprehension check

#### Scenario: Psychological support query
**Given** the user expresses frustration (e.g., "I'm frustrated after 3 losses")  
**When** the mock AI processes the request  
**Then** the system:
1. Detects emotional keyword patterns
2. Analyzes recent trade history
3. Provides perspective with data:
   - Recent loss streak in context of overall performance
   - Confirmation of rule-following
   - Reassurance based on statistics
   - Encouragement to continue with system  
**And** maintains supportive, coach-like tone

#### Scenario: Unrecognized query fallback
**Given** the user asks something the mock system cannot pattern-match  
**When** no specific handler exists  
**Then** the system displays helpful fallback response:
"I can help with that, but my responses are currently simulated. I can best assist with:
- Trade analysis (@VCB, @HPG)
- Portfolio review (@Portfolio)
- Performance analysis
- Educational questions
- Risk management advice"  
**And** suggests related queries user might mean

#### Scenario: Mock AI disclaimer visibility
**Given** any AI response is displayed  
**Then** the first response in each new conversation includes disclaimer:
"Note: AI responses are currently simulated using pattern matching. Full LLM integration coming soon."  
**And** a small badge appears in the AI avatar area: "Mock AI"  
**And** hovering the badge explains the limitation

---

### Requirement: AICOACH-UI-006 - Voice Input/Output (Optional Feature)

The system should optionally support voice-based interaction for hands-free use.

#### Scenario: Using voice input
**Given** the user clicks the microphone icon in the input area  
**When** browser permissions allow microphone access  
**Then** the system starts speech-to-text capture  
**And** displays animated visual indicator (pulsing microphone icon)  
**And** transcribes speech to text in real-time in the input field  
**When** the user stops speaking or clicks stop  
**Then** the system finalizes the transcription  
**And** user can review/edit before sending

#### Scenario: Enabling voice output
**Given** the user toggles "Voice Responses" in AI Coach settings  
**When** an AI response is generated  
**Then** the system uses text-to-speech to read the response aloud  
**And** provides controls to pause/resume/stop playback  
**And** visual indicator shows speaking progress

---

### Requirement: AICOACH-UI-007 - Suggested Questions

The system shall provide contextually relevant suggested questions to guide users.

#### Scenario: Initial suggestions on new conversation
**Given** the user starts a new conversation  
**Then** the system displays 4-6 suggested questions below input:
- "Analyze my last 10 trades"
- "What's my biggest weakness?"
- "Should I take the [top signal] trade?"
- "Review my portfolio risk"
- "Quiz me on risk management"
- "Show my equity curve"  
**When** the user clicks a suggestion  
**Then** the system populates the input field with that question  
**And** automatically sends the message

#### Scenario: Contextual suggestions after responses
**Given** the AI has just responded about portfolio risk  
**When** the response completes  
**Then** the system updates suggestions to related follow-ups:
- "How can I reduce my risk?"
- "Show me my highest-risk positions"
- "Compare to my risk limits"  
**And** suggestions update dynamically based on conversation flow

---

### Requirement: AICOACH-UI-008 - Message Actions

The system shall provide actions on user and AI messages for better interaction.

#### Scenario: User message actions
**Given** a user message is displayed  
**When** the user hovers over their own message  
**Then** action icons appear:
- Edit icon (pencil)
- Delete icon (trash)  
**When** the user clicks edit  
**Then** the message becomes editable inline  
**And** provides save/cancel buttons  
**When** saved, the AI regenerates its response to the edited message

#### Scenario: AI message actions
**Given** an AI response is displayed  
**When** the user hovers over the AI message  
**Then** action icons appear:
- Copy icon (copy message text to clipboard)
- Regenerate icon (get a new response to same question)
- Thumbs up/down (feedback icons)  
**When** the user clicks thumbs down  
**Then** the system logs negative feedback (for future LLM training)  
**And** optionally prompts "What was wrong with this response?"

---

### Requirement: AICOACH-UI-009 - Theme Compliance

The system shall strictly follow the Fintech Neon theme design system.

#### Scenario: Chat interface styling
**Given** any chat screen element is rendered  
**Then** all backgrounds use theme variables (--bg, --panel, --panel-elevated)  
**And** user messages use --panel-elevated background  
**And** AI messages use --panel background  
**And** input field follows theme input styling (--panel bg, --border, focus with --accent)  
**And** all text uses theme typography (--text, --text-secondary)  
**And** action buttons use accent color (--accent)  
**And** hover states include --glow-accent  
**And** markdown code blocks use --panel-elevated with syntax highlighting colors from theme  
**And** no emojis in production UI (except avatar placeholders if absolutely necessary)

---

### Requirement: AICOACH-UI-010 - Integration with Other Features

The system shall seamlessly integrate with Journal, Portfolio, Watchlist, and Signals.

#### Scenario: Quick access from Dashboard
**Given** the user views an AI Insight card on Dashboard  
**When** the insight mentions a specific recommendation  
**And** the user clicks "Ask AI Coach"  
**Then** the system opens AI Coach screen  
**And** pre-populates input with contextual question about that insight  
**And** auto-sends the message

#### Scenario: Jump to Journal from AI recommendation
**Given** the AI recommends "Review your HPG trade from Jan 15"  
**When** the response includes [VIEW TRADE] button  
**And** the user clicks it  
**Then** the system navigates to Journal screen  
**And** opens that specific trade detail automatically

#### Scenario: Cross-referencing signals in conversation
**Given** the AI discusses a current signal  
**When** the response mentions "@VCB signal"  
**Then** the text is linked/highlighted  
**When** clicked, opens Signals screen and highlights that signal

---

## Non-Functional Requirements

### Performance
- Message send and mock response generation <500ms
- Conversation history load <200ms
- Artifacts panel rendering <300ms
- Smooth scrolling with 60fps animation

### Accessibility
- Full keyboard navigation (Tab, Enter, Esc)
- ARIA labels on all interactive elements
- Screen reader announces new messages
- Voice input accessible via keyboard shortcut

### Browser Compatibility
- Chrome 90+ (required for speech APIs)
- Firefox 88+
- Safari 14+
- Edge 90+

### Data Limits
- Max 50 conversations stored in localStorage
- Max 100 messages per conversation
- Auto-archive oldest conversations when limit reached
- Warning when approaching limits

---

## Related Capabilities

- **journal-screen** (Phase 2): Source of trade history for AI analysis
- **portfolio-screen** (Phase 1): Source of position data for AI recommendations
- **watchlist-screen** (Phase 1): Source of setup data for AI analysis
- **settings-screen** (Phase 2): AI Coach preferences configuration

---

## Future Enhancements (Out of Scope)

- Real LLM backend integration (GPT-4, Claude, etc.)
- Multi-modal input (screenshots, chart annotations)
- Conversation sharing and collaboration
- AI-generated trade ideas
- Personalized learning paths
- Integration with external trading education resources
- Voice persona customization
