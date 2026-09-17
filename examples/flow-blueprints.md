# Flow blueprints

## 1. Timetable change → email

```text
WebUntis Trigger
Event: My Timetable Changed
Days Ahead: 2

→ IF
Condition: {{$json.cancelled}} is true
    OR {{$json.substitution}} is true

→ Send Email
Subject: WebUntis timetable changed
Body: Build from {{$json}}
```

## 2. Homework → task manager

```text
WebUntis Trigger
Event: Homework Changed
Days Ahead: 14

→ Split/Filter as needed
→ Todoist / Notion / Microsoft To Do
```

Use the homework ID as an external/deduplication key.

## 3. Exam reminder → calendar

```text
WebUntis Trigger
Event: Exams Changed
Days Ahead: 60

→ Calendar node
```

Use the exam ID as the external/deduplication key.

## 4. Apple Shortcut → n8n

```text
Apple Shortcut
Get Contents of URL
POST https://YOUR-N8N/webhook/...
    ↓
n8n Webhook Trigger
    ↓
WebUntis
    ↓
Respond to Webhook
```

Keep WebUntis credentials only in n8n.
