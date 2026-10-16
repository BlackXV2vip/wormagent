---
summary: "CLI reference for `wormagent setup` (initialize config + workspace)"
read_when:
  - You’re doing first-run setup without full CLI onboarding
  - You want to set the default workspace path
title: "setup"
---

# `wormagent setup`

Initialize `~/.wormagent/wormagent.json` and the agent workspace.

Related:

- Getting started: [Getting started](/start/getting-started)
- CLI onboarding: [Onboarding (CLI)](/start/wizard)

## Examples

```bash
wormagent setup
wormagent setup --workspace ~/.wormagent/workspace
```

To run onboarding via setup:

```bash
wormagent setup --wizard
```
