---
description: Implement an approved OpenSpec change and keep tasks in sync.
---

$ARGUMENTS
<!-- OPENSPEC:START -->
**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to `openspec/AGENTS.md` (located inside the `openspec/` directory—run `ls openspec` or `openspec update` if you don't see it) if you need additional OpenSpec conventions or clarifications.
- **CRITICAL: Always read `docs/FINTECH_NEON_THEME.md` before and after implementation to ensure all UI/UX changes strictly follow the established theme, color schema, component styles, and design principles. Do NOT deviate from the defined color palette or visual patterns.**

**Steps**
Track these steps as TODOs and complete them one by one.
1. **Read `docs/FINTECH_NEON_THEME.md` to understand and memorize the theme requirements, color variables, component patterns, and design constraints before starting implementation.**
2. Read `changes/<id>/proposal.md`, `design.md` (if present), and `tasks.md` to confirm scope and acceptance criteria.
3. Work through tasks sequentially, keeping edits minimal and focused on the requested change.
4. **After completing all implementation work, re-read `docs/FINTECH_NEON_THEME.md` and verify that:**
   - All colors used match the defined CSS variables (--bg, --panel, --accent, --text, etc.)
   - Component styles follow the established patterns (borders, shadows, hover effects, transitions)
   - Typography, spacing, and visual hierarchy align with the design principles
   - No unauthorized colors, emoji, or visual elements were introduced
5. Run `npm run build` to ensure everything compiles and passes tests.
6. Confirm completion before updating statuses—make sure every item in `tasks.md` is finished and theme compliance is verified.
7. Update the checklist after all work is done so each task is marked `- [x]` and reflects reality.
8. Reference `openspec list` or `openspec show <item>` when additional context is required.

**Reference**
- Use `openspec show <id> --json --deltas-only` if you need additional context from the proposal while implementing.
<!-- OPENSPEC:END -->
