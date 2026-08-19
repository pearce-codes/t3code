# Kiro

T3 Code runs Kiro through Kiro CLI's Agent Client Protocol (ACP) mode. Install Kiro CLI and sign
in before enabling the Kiro provider:

```bash
kiro-cli --version
kiro-cli login
kiro-cli whoami
```

Then add or enable Kiro in Settings. Keep `Binary path` set to `kiro-cli` unless the command is in
a non-standard location. Provider status distinguishes a missing CLI from a signed-out CLI; after
signing in outside T3 Code, refresh the provider status.

## Agents And Models

Set `Default agent` when every new Kiro thread should start with a named Kiro agent. Add one agent
name per line under `Agent choices` to make them available in the new-thread picker.

Kiro's `Auto` model lets the CLI select a model available to the signed-in account. A concrete
model selection is applied when the ACP process starts, so changing it requires a new thread.

## Permission And Plan Modes

T3 Code forwards Kiro's tool permission choices to the chat and returns the exact option selected.
Full Access automatically chooses an allow option only when Kiro advertises one.

The Plan toggle selects Kiro's advertised plan or architect mode. Switching back selects the
advertised implementation mode.

## Troubleshooting

- `Not found`: confirm `kiro-cli --version` works in the environment running the T3 server.
- `Not authenticated`: run `kiro-cli login`, confirm `kiro-cli whoami`, then refresh status.
- A custom binary path must point to the installed Kiro launcher. Do not copy the executable away
  from its installation; current Kiro releases use sibling executables beside the launcher.
