# Large/XL Plan Template (L-XL)

Use for work with high subsystem fan-out, architecture decisions, new components, or phased rollout.

## Key Principle

Hit the right level of specificity — everything the plan needs, nothing it doesn't. Large plans are long-lived reference documents that future you (and the AI) will re-read during implementation. Invest in design decisions, non-goals, and scope boundaries. Only include code snippets, test stubs, or layouts when they're genuinely the clearest way to communicate an approach.

## Template

```
# Feature: [Title]

**Tracking:** [issue link, ticket, or "N/A"]

## Background

[Problem statement, how it works today, history of related work. Include tables of related issues if there's a trail.]

## Goal

[What we're building and what it enables for the user. 2-5 sentences.]

## Non-Goals

[Explicitly state what this plan does NOT cover. This is critical for preventing scope creep. Each item should be a concrete thing someone might reasonably expect to be included but isn't.]

- **[Thing A]** — [why it's out of scope or deferred]
- **[Thing B]** — [why]

## Key Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|

## Current Architecture (if modifying existing systems)

[Tables of existing components, data flow, key insight that unlocks the approach.]

## Design Decisions

[Detailed sections for non-obvious choices. Each with options considered and rationale.]

## Implementation Plan

### Phase 0: [Infrastructure / Setup]

[Substeps (0a, 0b, 0c if needed), each independently verifiable. Describe what changes and why. Only include code snippets or layouts when prose alone can't convey the approach clearly.]

### Phase N: [Name]

[Same pattern. Large plans typically have 4-10 phases grouped into milestones.]

### Milestone Checkpoint

[What milestone N delivers. Validate before proceeding.]

## Files to Modify/Create

### New Files

| File | Purpose |
|------|---------|

### Modified Files

| File | Changes |
|------|---------|

## Testing Plan

[Describe what needs to be tested and why. Name the scenarios to cover — including edge cases and error handling — but don't write full test stubs. The implementation will determine the exact test shape.]

### Unit Tests

[Key scenarios per component. Edge case and error handling scenarios inline with the component they cover.]

### Integration / E2E Tests

[Only for things requiring integration with real services or end-to-end validation. Name what must be validated.]

## Future Enhancements (if applicable)

[Numbered phases beyond current scope. Brief descriptions only.]

## Notes

[Design principles, behavior clarifications, technical notes that don't fit elsewhere.]

## Related Work

[Links to related docs, prior art, architecture references.]
```

## Non-Goals Section Guidance

The Non-Goals section is **mandatory** for L/XL plans. Good non-goals are:

- Things adjacent to the feature that someone might assume are included
- Explicitly deferred work (with reasoning)
- Scope boundaries that prevent creep

**Example** (from a hypothetical navigation refactor):

```
## Non-Goals

- **Bidirectional sync** — stays as-is; the delete+reupload approach sidesteps sync issues
- **Animated tab transitions** — visual polish deferred to a future phase
- **Deep link support** — existing deep links continue to work; new deep link routes are future work
- **Tablet layout** — single-column layout only; responsive layouts are a separate effort
```

## What L/XL Plans MUST Include (that S-M plans skip)

- Non-Goals section
- Key Decisions Summary table
- Testing Plan with named scenarios (including edge cases and error handling)
- Files to Modify/Create split into New and Modified
- Milestone checkpoints between major phases

## What Makes a Good L/XL Plan

- **Key Decisions Summary** table up front for quick reference
- **Current Architecture** tables showing existing components (when modifying)
- **Implementation Plan** with phases grouped into milestones
- **Phase substeps** (0a, 0b, 0c) each independently verifiable
- **Code snippets** only where they clarify non-obvious approaches
- **Testing Plan** with edge cases as named scenarios
- **Future Enhancements** as numbered phases beyond current scope
- Total length: ~200-2000 lines depending on complexity
