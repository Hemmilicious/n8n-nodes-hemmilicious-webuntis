# Changelog

## 0.2.0 candidate

### Authentication

- Existing Secret-Key login remains backward compatible.
- Added normal WebUntis username/password login.
- QR URL login remains supported.
- School Number is no longer required by the Secret-Key UI because the underlying `webuntis` constructor does not use it.

### Action Node

Expanded read access for:

- own timetable and own class timetable
- timetable by class, teacher, student, subject, and room
- classes
- teachers
- students
- subjects
- rooms
- departments
- school years
- holidays
- time grid
- exams
- homework
- absences
- inbox
- news
- latest import time
- status data
- session validation

### Trigger Node

Added a separate polling trigger for:

- WebUntis data updated
- own timetable changed
- homework changed
- exams changed
- inbox changed
- absences changed

There is intentionally no WebUntis webhook trigger until a real server-to-client WebUntis webhook is verified.

### Integrations

- SMTP/mail stays in the native n8n mail nodes.
- Apple Shortcuts examples are included for:
  - Shortcut → n8n Webhook
  - n8n → macOS Shortcut via SSH and `shortcuts run`
  - deep-link handoff to iPhone/iPad
