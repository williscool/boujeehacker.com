# Small/Medium Plan Template (S-M)

Use for single-concern work with few or no design decisions.

## Key Principle

Focus on **what** and **why**, not implementation details. Code will change during the build — don't waste tokens specifying it upfront. Brief illustrative snippets are fine when they clarify an approach; full listings are not.

## Template

```
# [Feature/Fix/Refactor]: [Title]

**Tracking:** [issue link, ticket, or "N/A"]

## Overview

[1-3 sentences: what we're doing, why, and the key insight or approach]

## Background (if needed)

[Brief context: how it works today, related issues, why the current state is a problem. Skip if the overview is sufficient.]

## Plan

### Phase 1: [Name]

[What changes and why. List files or components involved. If a design choice exists, state the choice and rationale in 1-2 sentences. No full code listings.]

### Phase 2: [Name]

[Same pattern. Most S/M plans have 1-3 phases.]

## Files Changed Summary

| File | Change |
|------|--------|

## Testing

[What to test and how. Describe test scenarios, don't write full test stubs.]

## Open Questions (if any)

[Unresolved decisions. Remove this section if there are none.]
```

## What Makes a Good S-M Plan

- **Overview** frames the problem and goal in 2-3 sentences
- **Background** explains current state and why it's a problem (skip if overview covers it)
- **Phases** name files/components and describe changes without full code
- **Testing** names specific test cases without writing full stubs
- Total length: ~50-160 lines

## What NOT to Include in S-M Plans

- Full code listings (save for implementation)
- Full test method stubs with Given/When/Then
- ASCII UI mockups (if UI is simple enough to describe in words)
- Detailed edge cases section (handle during implementation)
- Architecture diagrams
- Future enhancements beyond the immediate scope
