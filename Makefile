# WormAgent Gateway — operator targets 🐴
# Usage: make help
.RECIPEPREFIX := >
SHELL := /bin/bash

GATEWAY_PORT ?= 18789
NODE_BIN     ?= node
PKG_ROOT     := $(shell npm root -g 2>/dev/null)/wormagent
SERVICE_DIR  := $(HOME)/.config/systemd/user
STATE_DIR    := $(HOME)/.wormagent

.PHONY: help install config workspace service-install run verify status logs restart stop update backup uninstall

help: ## Show available targets
> @echo "WormAgent — make targets:"
> @grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-16s\033[0m %s\n",$$1,$$2}'

install: ## Install the gateway globally (npm)
> npm i -g wormagent

config: ## Install config skeleton (fill every REQUIRED value)
> mkdir -p $(STATE_DIR)
> test -f $(STATE_DIR)/wormagent.json      || cp deploy/config/wormagent.json      $(STATE_DIR)/wormagent.json
> test -f $(STATE_DIR)/exec-approvals.json || cp deploy/config/exec-approvals.json $(STATE_DIR)/exec-approvals.json
> @echo ">> Edit $(STATE_DIR)/wormagent.json and replace every 'REQUIRED:' value"

workspace: ## Install the agent persona workspace
> mkdir -p $(STATE_DIR)/workspace
> cp -r agent/* $(STATE_DIR)/workspace/
> @echo ">> Agent workspace installed at $(STATE_DIR)/workspace"

service-install: ## Install + enable the systemd user service
> mkdir -p $(SERVICE_DIR)
> cp deploy/systemd/wormagent-gateway.service $(SERVICE_DIR)/
> systemctl --user daemon-reload
> systemctl --user enable --now wormagent-gateway
> @echo ">> Service enabled: wormagent-gateway"

run: ## Run the gateway in the foreground
> $(NODE_BIN) $(PKG_ROOT)/dist/index.js gateway --port $(GATEWAY_PORT)

verify: ## Health check the running gateway
> @curl -fsS http://127.0.0.1:$(GATEWAY_PORT)/health && echo || echo "!! gateway not responding on $(GATEWAY_PORT)"

status: ## Show service status
> systemctl --user status wormagent-gateway --no-pager

logs: ## Tail service logs
> journalctl --user -u wormagent-gateway -f

restart: ## Restart the service
> systemctl --user restart wormagent-gateway

stop: ## Stop the service
> systemctl --user stop wormagent-gateway

update: ## Update the gateway and restart the service
> npm i -g wormagent@latest
> -systemctl --user restart wormagent-gateway

backup: ## Create a verifiable local state backup
> wormagent backup create

uninstall: ## Remove the service + global package (keeps state data)
> -systemctl --user disable --now wormagent-gateway
> -rm -f $(SERVICE_DIR)/wormagent-gateway.service
> -npm rm -g wormagent
> @echo ">> Removed. State data kept at $(STATE_DIR)"
