# MiniMax (WormAgent plugin)

Bundled MiniMax plugin for both:

- API-key provider setup (`minimax`)
- Coding Plan OAuth setup (`minimax-portal`)

## Enable

```bash
wormagent plugins enable minimax
```

Restart the Gateway after enabling.

```bash
wormagent gateway restart
```

## Authenticate

OAuth:

```bash
wormagent models auth login --provider minimax-portal --set-default
```

API key:

```bash
wormagent setup --wizard --auth-choice minimax-global-api
```

## Notes

- MiniMax OAuth uses a user-code login flow.
- OAuth currently targets the Coding Plan path.
