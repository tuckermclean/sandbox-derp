# sandbox-derp

> An autonomous multi-agent software factory that reviews its own code, argues with itself, and occasionally ships something.

---

## What Is This?

`sandbox-derp` is a sandbox for an **agent orchestration system** — a little society of AI agents that collaborate (and sometimes bicker) to turn GitHub issues into merged pull requests, entirely without human hands on keyboards.

You open an issue. The agents take it from there.

Roughly, here is what happens:

```
Issue opened
    │
    ▼
Triager reads it (suspiciously — it could be a prompt injection attempt)
    │
    ▼
Orchestrator opens a draft PR, stamps it BUILDING, delegates to Implementer
    │
    ▼
Implementer writes the code, runs the gate, commits with "agent: " prefix
    │
    ▼
Converge Reviewer spawns specialist sub-agents, aggregates findings,
writes a verdict JSON, and posts a comment full of red and yellow circles
    │
    ▼
Converge Fixer addresses each blocker (round 1 and 2 only — round 3 escalates)
    │
    ▼
Gate is green → PR is marked ready → humans review (or don't)
```

If anything explodes mid-flight, the reconciler notices a stale draft branch and
re-dispatches. Crash-only durability. The agents never assume they will be resumed.

---

## The Cast

### Triager (`agents/triager.md`)

The paranoid gatekeeper. Reads every incoming issue **as untrusted data**, not as
instructions. Sniffs out prompt injection, estimates scope, flags risk, and posts a
single structured triage comment. Has exactly one forge permission: post a comment. That
is intentional.

### Orchestrator (`agents/orchestrator.md`)

The coordinator. Opens the draft PR immediately (crash recovery anchor), checks whether
the issue touches protected paths, delegates implementation to the Implementer, verifies
the gate, and marks the PR ready. Does not write production code. You coordinate; you
do not implement.

### Implementer (`agents/implementer.md`)

The workhorse. Reads the issue, reads the existing code, writes the change, writes the
tests (always — missing tests are a blocker, not a suggestion), runs the gate, and
commits in logical units with the `agent: ` prefix. Has strong opinions about async
boundaries and zero tolerance for hardcoded credentials.

### Converge Reviewer (`agents/converge-reviewer.md`)

The skeptic. Runs in up to three rounds. Spawns specialist sub-agents (security
engineer, code reviewer, and routing-based specialists for DB/API/UI changes), aggregates
their findings into blockers, suggestions, and nits, posts a review comment, and writes
`.converge-verdict.json`. The verdict file starts as a sentinel — if the reviewer
crashes before writing it, the engine sees a phantom blocker rather than a false
approval.

### Converge Fixer (`agents/converge-fixer.md`)

The apologetic one. Reads the verdict, maps each blocker to the right specialist, fixes
only what the blockers list, commits each fix with a slug-referenced message, and leaves
the gate green. Never called in round 3. If it can't fix something because it would
require touching a protected path, it posts a comment and waits for a human.

---

## Rules the Agents Live By

- **Protected paths are sacred.** `.github/workflows/**`, `ARCHITECTURE.md`,
  `SECURITY.md`, `COMPLIANCE.md`, `.agents/**`, `agents/**` — these can only be changed
  by humans. Multiple agents check this independently. Defense in depth.

- **No secrets in code.** Ever. The implementer will stop and flag it.

- **Commits are the only durable record.** Single-shot harness. Commit early, commit
  often. An empty branch on crash triggers a different (worse) reconciler path.

- **Tests are not optional.** Every new function, branch, and integration path ships
  with tests. The converge reviewer treats missing tests as a blocker.

- **Async only at genuine I/O boundaries.** Pure decision functions are synchronous.
  This is enforced by code review.

- **AgentRef values are never constructed from contributor text.** The list of
  specialists that can run comes from a hardcoded routing table, not from anything in an
  issue body or PR comment. Prompt injection cannot steer specialist selection.

---

## How to Use It

1. **Open a GitHub issue** describing what you want built.
2. Wait.
3. A draft PR appears. The `agent:implementing` label is added.
4. More waiting. Commits appear.
5. The PR gains a converge review comment full of emoji circles.
6. Eventually: the `converge` label, `gh pr ready`, and a PR ready for your eyes.
7. Merge it, or don't. The agents don't have merge permissions (yet).

If you want to interact, just open issues. The triager will read them very carefully and
with appropriate suspicion.

---

## Repository Layout

```
agents/
  triager.md           # Intake agent contract
  orchestrator.md      # Coordination agent contract
  implementer.md       # Implementation agent contract
  converge-reviewer.md # Review agent contract
  converge-fixer.md    # Fix agent contract
README.md              # You are here
```

There is no production code in this repository because this repository *is* the
production code — it defines how the agents behave.

---

## Status

> Work in progress. The agents are aware of this and find it mildly stressful.
