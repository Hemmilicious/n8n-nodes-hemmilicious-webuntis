# Email from WebUntis data

Use a separate mail node instead of adding SMTP to the WebUntis community node.

Recommended flow:

```text
WebUntis Trigger
  -> IF / Filter
  -> Set / Edit Fields
  -> Send Email (SMTP)
```

Example use cases:

- Notify when today's timetable changes.
- Send a daily homework summary.
- Send an exam reminder.
- Notify on a new inbox message.

Benefits:

- WebUntis and SMTP credentials remain isolated.
- Mail retries and provider-specific errors stay in the mail node.
- You can swap SMTP for Gmail or Outlook without changing the WebUntis package.
