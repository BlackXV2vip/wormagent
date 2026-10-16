---
summary: "CLI reference for `wormagent skills` (list/info/check) and skill eligibility"
read_when:
  - You want to see which skills are available and ready to run
  - You want to debug missing binaries/env/config for skills
title: "skills"
---

# `wormagent skills`

Inspect skills (bundled + workspace + managed overrides) and see what’s eligible vs missing requirements.

Related:

- Skills system: [Skills](/tools/skills)
- Skills config: [Skills config](/tools/skills-config)
- HoofHub installs: [HoofHub](/tools/hoofhub)

## Commands

```bash
wormagent skills list
wormagent skills list --eligible
wormagent skills info <name>
wormagent skills check
```
