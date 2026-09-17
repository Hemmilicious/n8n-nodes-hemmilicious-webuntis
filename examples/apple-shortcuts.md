# Apple Shortcuts + n8n + WebUntis

## Direction A: Apple Shortcut calls n8n

This is the cleanest mobile design.

1. Create an n8n workflow with a **Webhook Trigger**.
2. Protect the webhook with an authentication mechanism or an unguessable secret.
3. In Apple Shortcuts use **Get Contents of URL** to call the webhook.
4. n8n then runs WebUntis actions.

Do not place a WebUntis secret inside the Shortcut. The Shortcut only calls n8n.

## Direction B: n8n starts a Shortcut on a Mac

Apple provides the `shortcuts` command on macOS.

If the Mac is reachable from the n8n host, use the n8n **SSH** node and execute:

```bash
shortcuts run "WebUntis Update"
```

The Mac must be online and the shortcut must exist on that Mac.

## Direction C: n8n points an iPhone/iPad at a Shortcut

Apple supports the URL form:

```text
shortcuts://run-shortcut?name=Shortcut%20Name&input=text&text=hello
```

A Docker/Linux n8n server cannot remotely force iOS to open that URL. It can send the URL through mail, chat, push notification, etc., and the device/user can open it.

## Security

- Do not embed WebUntis QR URLs or Secret Keys in shortcut URLs.
- Treat n8n webhook URLs as credentials when they contain secrets.
- Prefer HTTPS.
