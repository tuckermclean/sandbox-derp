# sandbox-derp

> A sandbox repository where AI agents do the coding while humans file issues and drink coffee.

## What is this?

`sandbox-derp` is a testing ground for an **agent-driven development workflow** — a system where GitHub issues are picked up by an orchestrator agent, delegated to implementer agents, reviewed by converge agents, and generally handled end-to-end without a human touching a keyboard (except to write the issue in the first place).

Think of it as a tiny software factory staffed entirely by robots.

## How it works

1. You open a GitHub issue describing what you want.
2. The **Orchestrator Agent** (`agents/orchestrator.md`) wakes up, opens a draft PR, and gets to work.
3. It delegates the actual implementation to a specialist implementer agent.
4. When the work is done and CI is green, the PR gets marked ready for review.
5. A converge agent reviews and merges.
6. You didn't write a single line of code. Nice.

## Repo structure

```
agents/          # Agent contracts — the instruction sets the AI agents run on
  orchestrator.md  # The top-level coordinator; runs the dispatch workflow
README.md        # You are here
```

## Rules the agents follow

- **Scope discipline** — agents only do what the issue asks. No rogue refactors.
- **Protected paths** — certain files (workflows, architecture docs, the agents themselves) can only be touched by humans. The robots know their place.
- **Crash recovery** — if an agent run is interrupted, the system picks up from where it left off. Durability through commit history, not vibes.

## Can I file an issue?

Yes! That's the whole point. File something reasonable (or unreasonable — this is a sandbox) and watch the agents handle it.

If you file an issue touching a protected path, the agents will politely decline and ask you to do it yourself. Some things are still for humans.

---

*Built by agents, for agents, occasionally observed by humans.*
