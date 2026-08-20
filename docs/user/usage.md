# Review usage

The Usage page combines Codex, Claude Code, and Kiro activity from your connected environments. It
reads the providers' local session history and shows API-equivalent token cost, processed tokens,
Kiro metering credits, cache savings, provider shares, and model breakdowns. Claude and Codex costs
are API-equivalent; Kiro cost is a marginal credit value. Subscription billing is separate from the
cost shown here.

Kiro does not contribute token counts. Its approximate dollar value is the provider-reported credit
total multiplied by the public $0.04 per-credit add-on and overage price; it is not a reconstruction
of your subscription bill. Approximate Kiro costs are prefixed with `~`.

Use **Past 24h** for an hourly chart covering the exact rolling 24-hour period. The **7 days**,
**30 days**, and **90 days** ranges use daily resolution. Cost, token, and credit toggles update both
the headline and chart, and refreshing rescans every connected environment.
