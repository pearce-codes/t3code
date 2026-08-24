# Pearce Codes Downstream Changes

This ledger tracks behavior intentionally carried on top of T3 Code. Update it
when a customization is added, removed, or contributed upstream.

| Area               | Downstream purpose                                                           | Surfaces                                       | Upstream policy                                                |
| ------------------ | ---------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------- |
| Product identity   | Pearce Codes names, icons, package IDs, schemes, and release metadata        | Web, desktop, mobile, server, packaging        | Keep downstream                                                |
| Data isolation     | Use Pearce-specific runtime homes and avoid collisions with T3 Code installs | Server, desktop, CLI                           | Keep downstream                                                |
| Remote CLI and SSH | Install and launch `@pearcecodes/t3code` on remote hosts                     | Desktop, server, SSH package                   | Keep package identity downstream; upstream generic fixes       |
| Kiro provider      | ACP controls, agent discovery, steering, plans, tasks, tools, and usage      | Contracts, server, client runtime, web, mobile | Upstream provider-neutral fixes; retain Kiro policy downstream |
| Usage reporting    | Include Kiro credits, estimated cost, and provider presentation              | Server, shared, web, mobile                    | Upstream generic aggregation fixes                             |
| Brand palette      | Pearce themes, terminal palette, generated icons, and CRT treatment          | Web, desktop, mobile, marketing                | Keep downstream                                                |
| Generic fixes      | Workspace search loading and remote file handling                            | Server, web                                    | Contribute upstream and drop after release                     |

For each upstream sync, review whether:

- Upstream now provides equivalent behavior.
- A downstream change repeatedly conflicts and needs a narrower boundary.
- A generic fix can be removed after its upstream commit lands.
- Tests still cover every affected client, provider, and wire contract.
