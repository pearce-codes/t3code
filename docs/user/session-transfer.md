# Transfer sessions

Pearce Codes session archives let you move a conversation between compatible Pearce Codes and T3 Code installations.

To export a session, open the thread menu and choose **Export session**. The downloaded `.t3-session.json` file contains the thread title, workspace configuration, model and provider selection, and visible user, assistant, and system messages.

To import it, open **Settings → General → Session transfer**, choose **Import session**, and select the archive. Pearce Codes reuses a project with the same workspace path when one exists; otherwise it creates a project from the archive. The imported thread receives new internal IDs, so it cannot overwrite an existing thread.

Archives do not contain credentials, approval history, checkpoints, local attachment files, provider-native transcripts, or telemetry. An imported conversation starts without a running provider process; sending the next message starts a fresh provider session with the imported provider and model selection.

Treat exported archives like any other conversation transcript: they may contain source code, prompts, and assistant output from the original session.
