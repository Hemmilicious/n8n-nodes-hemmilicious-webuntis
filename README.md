# n8n-nodes-hemmilicious-webuntis

Comprehensive self-hosted n8n Community Nodes for reading WebUntis data with Secret/QR authentication.

## Nodes

### WebUntis — Action Node

Read operations for:

- Timetable
  - own timetable: today, date, range, week
  - own class: today, date, range
  - any visible class, teacher, subject, room, or student: today, date, range, week
- Classes
- Teachers
- Students
- Subjects
- Rooms
- Departments
- School Years
- Holidays
- Time Grid
- Exams
- Homework
- Absences
- Inbox
- News
- System/User information
- Latest import time
- Status data
- Session validation

### WebUntis Trigger — Polling Trigger

Polling/change-detection events:

- WebUntis data updated
- My timetable changed
- Homework changed
- Exams changed
- Inbox changed
- Absences changed

The trigger stores only a SHA-256 fingerprint in workflow static data, not the fetched WebUntis records.

### Webhook Trigger Node

There is intentionally **no WebUntis Webhook Trigger Node** in this package. The `webuntis` 2.2.1 client does not document a general server-to-client WebUntis webhook. The trigger node therefore uses polling.


## Authentication modes

This candidate supports three credential modes:

- **Secret Key (Manual)** — compatible with credentials created by version 0.1.0.
- **Username + Password** — uses the normal `WebUntis` login from the `webuntis` package.
- **Untis QR URL** — parses the sensitive `untis://setschool?...` configuration value and uses Secret authentication.

The normal password and Secret Key are different authentication methods. Keep both only in the n8n Credential system.

## Authentication

The node supports WebUntis Secret authentication using:

- manual server/school/user/secret fields, or
- the sensitive `untis://setschool?...` QR URL

Secrets and QR URLs belong only in n8n Credentials.

Never put the QR URL, Secret Key, session cookies, JWTs, or session IDs into workflow JSON, logs, Set/Edit Fields nodes, or public issue reports.

## Security notes

- Session information is not returned.
- The connection test returns only success/failure.
- Errors are mapped to safe messages.
- The client logs out best-effort after an execution.
- One re-login/retry is attempted when a session expires.
- The Absence PDF operation returns an ephemeral report URL. Treat that output as sensitive.
- Inbox, students, grades, absences, and similar data may be personal/sensitive. Restrict workflow access and logs accordingly.
- WebUntis permissions vary by school and account. An operation may legitimately return permission errors.

## Email

Do **not** put SMTP into the WebUntis node.

The used `webuntis` client exposes inbox reading but no documented send-mail/send-message method. For outbound mail, use the native n8n **Send Email (SMTP)** node, Gmail node, Microsoft Outlook node, or another mail integration downstream from WebUntis.

Recommended flow:

`WebUntis Trigger → IF/Filter → Send Email`

This keeps WebUntis credentials separate from SMTP credentials and is easier to audit.

## Apple Shortcuts

The WebUntis node should not directly contain Apple Shortcuts logic.

Recommended patterns:

1. **Shortcut → n8n**  
   Use an n8n Webhook node and call it from Apple Shortcuts using “Get Contents of URL”.

2. **n8n → Shortcut on a Mac**  
   If a Mac is online and reachable, use n8n's SSH node and run:
   `shortcuts run "Your Shortcut Name"`

3. **n8n → iPhone/iPad**  
   A Linux/Docker n8n server cannot itself open `shortcuts://` on an iPhone. Send a deep link to the device for the user to tap, or use a dedicated bridge/automation service.

See `examples/apple-shortcuts.md`.

## Installation

Self-hosted n8n:

1. Settings
2. Community Nodes
3. Install:
   `n8n-nodes-hemmilicious-webuntis`

## Upgrade development copy to 0.2.0

This ZIP intentionally does not contain `package-lock.json`.

When applying it to the existing repository, keep your existing lockfile and then run:

```bash
npm install
npm run lint
npm test
rm -rf dist tsconfig.tsbuildinfo
npm run build
npm pack --dry-run
```

Only publish after the real WebUntis credential and the most important operations were tested against your school account.

## Supported baseline

Developed around:

- n8n 2.38.x
- Node.js 26.x
- `@n8n/node-cli` 0.48.4
- `n8n-workflow` 2.38.1
- `webuntis` 2.2.1
- `otplib` 12.0.1

## License

MIT
