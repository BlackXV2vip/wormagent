---
summary: "CLI reference for `wormagent reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
title: "reset"
---

# `wormagent reset`

Reset local config/state (keeps the CLI installed).

```bash
wormagent backup create
wormagent reset
wormagent reset --dry-run
wormagent reset --scope config+creds+sessions --yes --non-interactive
```

Run `wormagent backup create` first if you want a restorable snapshot before removing local state.
