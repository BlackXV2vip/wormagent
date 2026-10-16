---
summary: "CLI reference for `wormagent logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
title: "logs"
---

# `wormagent logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:

- Logging overview: [Logging](/logging)

## Examples

```bash
wormagent logs
wormagent logs --follow
wormagent logs --json
wormagent logs --limit 500
wormagent logs --local-time
wormagent logs --follow --local-time
```

Use `--local-time` to render timestamps in your local timezone.
