---
name: plan-making
description: Creates structured development plan documents using size-appropriate templates (S/M/L/XL). Use when the user asks to plan a feature, write an RFC, create a dev plan, design a technical approach, or when a task is complex enough to warrant a written plan before implementation. Also triggers on phrases like "let's plan this out", "write up a plan", "how should we approach this", "break this down", or "create a dev todo". Even if the user doesn't explicitly say "plan", use this skill when the request involves multiple phases, design decisions, or cross-cutting concerns that benefit from structured thinking before coding.
---

# Plan Making

Create structured development plans that serve as living reference documents. Plans capture the *what* and *why* before implementation begins, scaled to the complexity of the work.

## Workflow

### Step 1: Gather Context

Before writing a plan:

- Ask the user about the problem, goals, and constraints (or extract from conversation history)
- If working in a repo, check for existing architecture docs, prior plans, or related completed work
- Identify dependencies, stakeholders, and integration points

### Step 2: Determine T-Shirt Size

Size based on **conceptual complexity**, not file count. A variable rename across 20 files is still small.

| Signal | S | M | L | XL |
|--------|---|---|---|-----|
| Scope boundary | One bug, one pattern, one screen | Single feature, single concern | End-to-end feature slice across layers | Multi-milestone program with child plans |
| Subsystem fan-out | Single subsystem | 1-2 subsystems | Multiple (UI + API + DB + infra) | Broad (nav + data + auth + sync + tests) |
| Design decisions | None or obvious | 1-2 minor choices | Multiple options with tradeoffs | Decision tables, library evaluations |
| New architectural components | None | Maybe a helper | Named new class/pattern/service | New system patterns, new packages |
| Independent deliverable phases | 1 | 2-3 | 4-6 across layers | 7+ grouped into milestones |
| Risk / rollback story | Trivial | Low | Feature flags, migration concerns | Legacy fallback, data loss prevention, phased rollout |

Pick the size that matches the majority of signals. When borderline, size down — you can always expand later.

### Step 3: Select Template

- **S or M** → Read `template-small.md` in this skill's directory and follow it
- **L or XL** → Read `template-large.md` in this skill's directory and follow it

### Step 4: Write the Plan

Output the plan as a markdown file. Use a descriptive snake_case filename (e.g., `data_sync_improvements.md`, `auth_flow_refactor.md`).

If the user has a project structure with a docs or plans directory, place it there. Otherwise, output to the working directory.

### Step 5: Iterate

Plans are living documents. After writing the initial plan, ask the user if anything needs adjustment — scope, phases, decisions, or non-goals.

## General Conventions

Every plan should respect these principles:

- **Tests matter** — Call out what needs testing and how, scaled to plan size
- **Concise writing** — Everything the plan needs, nothing it doesn't
- **Scope discipline** — Non-goals prevent creep, especially on L/XL plans
- **No premature implementation detail** — Focus on *what* and *why*; the *how* is discovered during implementation. Brief illustrative snippets are fine when they clarify an approach; full listings are not.

## Anti-Patterns

- **Over-specifying small plans**: Full code listings and test stubs in an S/M plan waste tokens and will change during implementation
- **Implementation weeds in S/M plans**: Focus on *what* and *why*, not *how*
- **Missing non-goals in L/XL plans**: Every large plan must explicitly state what is out of scope
- **Skipping the sizing step**: Jumping straight to a large template for simple work creates overhead; jumping to a small template for complex work misses critical decisions
