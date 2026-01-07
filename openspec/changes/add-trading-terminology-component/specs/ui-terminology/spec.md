# UI Terminology Capability

**Capability ID:** `ui-terminology`  
**Status:** New (ADDED)  
**Category:** User Interface  
**Last Updated:** 2026-01-07

---

## ADDED Requirements

### Requirement: System SHALL provide reusable Trading Term Component

The system SHALL provide a reusable React component for displaying trading terminology with hover-activated definitions.

**Rationale:** Consistent presentation of technical terms improves usability and reduces learning curve for users unfamiliar with trading jargon.

**Acceptance Criteria:**
- Component accepts `term` prop with typed term key
- Component renders term text inline with visual indicator (dotted underline)
- Component displays definition tooltip on hover within 200ms
- Component supports custom display text via `display` or `children` props
- Component handles undefined terms gracefully with fallback behavior
- Component applies custom positioning for tooltip (top, bottom, left, right)
- Component adds proper accessibility attributes (role, aria-label, aria-describedby)

#### Scenario: Display RSI indicator with definition

**Given** the IndicatorsPanel component is rendered  
**And** the RSI indicator label needs a definition  
**When** the developer uses `<TradingTerm term="RSI">RSI (14)</TradingTerm>`  
**Then** the term "RSI (14)" is displayed with a dotted underline  
**And** the cursor shows "help" style on hover  
**When** the user hovers over the term  
**Then** a tooltip appears within 200ms showing "Relative Strength Index. Momentum indicator measuring speed and magnitude of price changes. Values above 70 indicate overbought, below 30 oversold."  
**And** the tooltip background is 80% transparent dark gray  
**And** the tooltip has a subtle backdrop blur effect

#### Scenario: Handle undefined term gracefully

**Given** a developer uses `<TradingTerm term="UNKNOWN_TERM">Unknown</TradingTerm>`  
**When** the component renders  
**Then** the text "Unknown" displays without error  
**And** hovering shows a fallback tooltip "Definition not available"  
**Or** no tooltip appears at all (graceful degradation)

#### Scenario: Custom display text with definition

**Given** the user wants to show "ATR (14)" but use the ATR definition  
**When** the developer uses `<TradingTerm term="ATR" display="ATR (14)" />`  
**Then** "ATR (14)" is displayed  
**And** hovering shows the ATR definition  

---

### Requirement: System SHALL maintain centralized Terminology Dictionary

The system SHALL maintain a centralized dictionary of trading term definitions accessible to UI components.

**Rationale:** Single source of truth for definitions ensures consistency and eases maintenance.

**Acceptance Criteria:**
- Dictionary defined as typed constant with TypeScript Record type
- Each term has name, definition, and category fields
- Definitions are concise (1-3 sentences, max 200 characters)
- Dictionary includes minimum 20 commonly used trading terms
- Dictionary is exportable for use across components
- TypeScript enforces valid term keys at compile time

#### Scenario: Look up RSI definition

**Given** the terminology dictionary is imported  
**When** code accesses `TRADING_TERMS['RSI']`  
**Then** it returns an object with:
```
{
  name: "RSI",
  definition: "Relative Strength Index. Momentum indicator...",
  category: "INDICATOR"
}
```

#### Scenario: Access undefined term

**Given** the terminology dictionary is imported  
**When** code accesses `TRADING_TERMS['NONEXISTENT']`  
**Then** TypeScript shows a compile-time error  
**Or** runtime returns `undefined` if type assertion bypassed

#### Scenario: Iterate over all terms

**Given** a UI component needs to display all available terms  
**When** code iterates `Object.entries(TRADING_TERMS)`  
**Then** it receives an array of [key, definition] tuples  
**And** each definition includes name, definition text, and category

---

### Requirement: System SHALL enhance Tooltip with 80% Transparency mode

The system SHALL enhance the existing Tooltip component to support 80% transparency mode for terminology definitions.

**Rationale:** Transparent tooltips improve readability while maintaining context of underlying UI elements.

**Acceptance Criteria:**
- Tooltip component accepts `transparent` boolean prop
- When `transparent={true}`, background is `rgba(31, 41, 55, 0.8)`
- Transparent tooltips include `backdrop-filter: blur(8px)` for glassmorphism
- Tooltip supports `maxWidth` prop for wrapping long definitions
- Tooltip animation remains smooth (200ms fade-in)
- Tooltip maintains existing position logic (top, bottom, left, right)

#### Scenario: Render transparent tooltip

**Given** TradingTerm uses Tooltip with `transparent={true}`  
**When** the tooltip is displayed  
**Then** the background color is `rgba(31, 41, 55, 0.8)`  
**And** the backdrop-filter applies 8px blur  
**And** the underlying content is partially visible through the tooltip  
**And** text remains readable with sufficient contrast

#### Scenario: Wrap long definition text

**Given** a term definition is longer than 250 characters  
**When** the tooltip is displayed with `maxWidth={300}`  
**Then** the tooltip wraps text at 300px width  
**And** whitespace is set to `normal` instead of `nowrap`  
**And** line-height is 1.5 for readability

---

### Requirement: System SHALL integrate TradingTerm in Market Data View

The system SHALL replace all technical indicator labels in the Market Data View with TradingTerm components.

**Rationale:** Traders viewing indicators benefit most from immediate definition access.

**Acceptance Criteria:**
- IndicatorsPanel wraps all 8+ indicator labels with TradingTerm
- Indicators include: RSI, MACD, Stochastic, ADX, ATR, VWAP, Bollinger Bands, OBV
- Existing visual layout remains unchanged
- Hover definitions appear without breaking panel layout
- TypeScript types enforce valid term keys

#### Scenario: View indicator definitions in Market Data

**Given** the user is on the Market Data View  
**And** the IndicatorsPanel is displayed with live data  
**When** the user hovers over "RSI (14)"  
**Then** a tooltip appears showing the RSI definition  
**When** the user hovers over "Bollinger Bands"  
**Then** a tooltip appears showing the Bollinger Bands definition  
**And** both tooltips use 80% transparency  
**And** no layout shift occurs when tooltips appear

---

### Requirement: System SHALL integrate TradingTerm in Performance Analytics View

The system SHALL replace all performance metric labels in the Performance Analytics View with TradingTerm components.

**Rationale:** Performance metrics are critical for evaluating trading systems and require clear explanations.

**Acceptance Criteria:**
- PerformanceView wraps all 5+ metric labels with TradingTerm
- Metrics include: Win Rate, Sharpe Ratio, Profit Factor, Drawdown, Expectancy
- PerformanceOverviewCards removes duplicate tooltip logic
- Existing visual layout remains unchanged
- Hover definitions appear without breaking card layout

#### Scenario: View metric definitions in Performance Analytics

**Given** the user is on the Performance Analytics View  
**And** performance metrics are displayed  
**When** the user hovers over "Sharpe Ratio"  
**Then** a tooltip appears showing "Risk-adjusted return metric..."  
**When** the user hovers over "Win Rate"  
**Then** a tooltip appears showing "Percentage of trades that were profitable..."  
**And** tooltips do not overlap with metric values  
**And** old tooltip implementation is removed

---

### Requirement: System SHALL integrate TradingTerm in Risk Management View

The system SHALL replace all risk calculation labels in the Risk Management View with TradingTerm components.

**Rationale:** Risk concepts are fundamental to position sizing and require clear understanding.

**Acceptance Criteria:**
- RiskView and sub-components wrap 3+ risk labels with TradingTerm
- Terms include: R-Multiple, Risk:Reward Ratio, Position Sizing, ATR Stop
- Existing form layout remains unchanged
- Hover definitions appear without breaking calculator layout

#### Scenario: View risk term definitions

**Given** the user is on the Risk Management View  
**And** the position calculator is displayed  
**When** the user hovers over "R-Multiple"  
**Then** a tooltip appears showing "Risk unit measurement..."  
**When** the user hovers over "Position Sizing"  
**Then** a tooltip appears showing "Calculation of shares to buy..."  
**And** tooltips position correctly near form fields

---

### Requirement: System SHALL integrate TradingTerm in Trade Scanner View

The system SHALL replace all setup type labels in the Trade Scanner View with TradingTerm components.

**Rationale:** Setup types are strategic patterns that benefit from definition context.

**Acceptance Criteria:**
- TradeScannerTable wraps 4 setup type labels with TradingTerm
- Setup types include: Pullback, Breakout, Mean Reversion, Crossover
- Table layout remains unchanged
- Hover definitions appear without breaking table structure

#### Scenario: View setup type definitions

**Given** the user is on the Trade Scanner View  
**And** trade setups are listed in the table  
**When** the user hovers over a "Breakout" setup type label  
**Then** a tooltip appears showing "Price breaks above resistance..."  
**When** the user hovers over "Mean Reversion" filter option  
**Then** a tooltip appears showing "Price reverts to average..."  
**And** tooltips do not cause table cells to expand

---

### Requirement: System SHALL enforce Type Safety for trading term references

The system SHALL enforce type safety for all trading term references using TypeScript.

**Rationale:** Compile-time validation prevents runtime errors from typos or undefined terms.

**Acceptance Criteria:**
- `TermKey` type exported from TradingTerm module
- All term references use `TermKey` literal union type
- TypeScript compiler errors if invalid term key used
- IDE provides autocomplete for valid term keys
- Dictionary lookup typed as `Record<TermKey, TermDefinition>`

#### Scenario: TypeScript catches invalid term

**Given** a developer writes `<TradingTerm term="INVALID">Label</TradingTerm>`  
**When** TypeScript compiles the code  
**Then** a type error is raised: "Type 'INVALID' is not assignable to type 'TermKey'"  
**And** the developer is prompted to use a valid term from autocomplete

#### Scenario: IDE autocomplete for valid terms

**Given** a developer types `<TradingTerm term="`  
**When** the IDE shows autocomplete suggestions  
**Then** all valid TermKey values appear in the list (RSI, MACD, ATR, etc.)  
**And** selecting a value inserts the correct term key

---

### Requirement: System SHALL ensure Accessibility for term definitions via keyboard and screen readers

The system SHALL ensure trading term definitions are accessible via keyboard navigation and screen readers.

**Rationale:** Inclusive design allows all users to benefit from in-context learning.

**Acceptance Criteria:**
- TradingTerm elements are keyboard focusable (tabIndex={0})
- Tooltip appears on both mouse hover and keyboard focus
- Screen readers announce term with role="term"
- aria-describedby links term to definition
- Focus indicator visible when navigating with Tab key

#### Scenario: Keyboard navigate to term definition

**Given** the user navigates with the Tab key  
**When** focus lands on a TradingTerm element  
**Then** a visible focus outline appears  
**And** the tooltip definition appears (same as hover behavior)  
**When** the user presses Tab again  
**Then** focus moves to the next interactive element  
**And** the tooltip disappears

#### Scenario: Screen reader announces term

**Given** a screen reader user navigates the page  
**When** the screen reader encounters a TradingTerm  
**Then** it announces the term name and role ("RSI, term")  
**And** the definition is available via aria-describedby  
**And** the user can access the full definition if needed

---

### Requirement: System SHALL maintain Performance with 50+ TradingTerm instances

The system SHALL render pages with 50+ TradingTerm instances without measurable performance degradation.

**Rationale:** Heavy usage of TradingTerm across views should not impact application responsiveness.

**Acceptance Criteria:**
- Page with 50+ TradingTerms renders in <100ms (first paint)
- Hovering a term shows tooltip in <200ms
- No jank or frame drops during tooltip animations
- Bundle size increase <10KB gzipped
- No re-renders of sibling components when tooltip appears

#### Scenario: Render Performance View with many terms

**Given** the Performance View has 20+ TradingTerm instances  
**And** the IndicatorsPanel has 10+ TradingTerm instances  
**When** the user navigates to the Performance View  
**Then** the page renders in <100ms  
**And** React DevTools Profiler shows <16ms commit time  
**When** the user hovers over any term  
**Then** the tooltip appears in <200ms  
**And** no other components re-render

---

## Related Capabilities

- **UI Components:** Tooltip component enhancement
- **Type System:** TypeScript type definitions for terms
- **Performance:** Component rendering performance
- **Accessibility:** Keyboard navigation and screen reader support

---

## Dependencies

**Upstream:**
- None (new capability)

**Downstream:**
- Market Data View (depends on TradingTerm)
- Performance Analytics View (depends on TradingTerm)
- Risk Management View (depends on TradingTerm)
- Trade Scanner View (depends on TradingTerm)

---

## Validation Criteria

- [ ] All 8 requirements have at least one scenario
- [ ] All scenarios follow Given/When/Then format
- [ ] Acceptance criteria are testable and measurable
- [ ] Requirements map to tasks in tasks.md
- [ ] No ambiguous or subjective criteria
- [ ] Cross-references to related capabilities are accurate

---

## Notes

- Initial version focuses on 20+ common trading terms
- Future enhancements: comprehensive glossary modal, external links, analytics
- Definitions kept concise (1-3 sentences) for quick reference
- 80% transparency value is configurable if needed for theme variations
