# Hemmilicious WebUntis – Schul & Familien OS

Dieses n8n-Community-Node-Paket verbindet WebUntis mit automatisierten Abläufen auf Smartphone, Server und weiteren n8n-Nodes. Es bildet die WebUntis-Basis für ein modulares **Schul- & Familien-OS**.

Ziel ist nicht nur das Auslesen von Stundenplänen. WebUntis-Daten sollen mit weiteren Bausteinen wie Supabase, E-Mail, Push-Nachrichten, PDF-Erstellung, Lernmaterialien, Raumplänen und KI-gestützten Lernhilfen verbunden werden.

## Version 0.3.0

Diese Version erweitert die Unterstützung für Elternkonten.

### Schülerkontext

Elternkonten besitzen in WebUntis häufig eine eigene Personen-ID, während Stundenplan und Abwesenheiten über die ID des Kindes abgerufen werden müssen.

Beispiel:

```text
Eltern-Personen-ID  → 5205
Schüler-ID          → 6145
Klassen-ID          → 288
```

Die Werte dienen nur als Beispiel. Im eigenen Workflow müssen die IDs des jeweiligen WebUntis-Kontos verwendet werden.

### Stundenplan

Für sichtbare Elemente können Stundenpläne nach Klasse, Fach, Raum, Schüler/in oder Lehrkraft abgerufen werden.

Bei Lehrkräften kann die WebUntis-ID jetzt manuell eingegeben werden. Das ist hilfreich, wenn das Konto keine Berechtigung besitzt, die vollständige Lehrerliste abzurufen.

### Abwesenheiten

Bei Abwesenheiten kann optional eine **Schüler-ID** angegeben werden. Das ist insbesondere für Elternkonten relevant, bei denen die angemeldete Personen-ID nicht mit der Schüler-ID identisch ist.

Ohne Schüler-ID bleibt das bisherige Verhalten erhalten.

### Trigger

Der WebUntis Trigger unterstützt jetzt zusätzlich:

- Schüler-ID für **Stundenplan geändert**
- Schüler-ID für **Abwesenheiten geändert**
- Klassen-ID für **Klassenarbeiten / Prüfungen geändert**

Damit können Polling-Trigger gezielter auf den Kontext eines Kindes oder einer Klasse zugreifen.

## Nodes

### WebUntis

Unterstützte Bereiche:

- Stundenplan
- Klassen
- Lehrkräfte
- Schüler
- Fächer
- Räume
- Abteilungen
- Schuljahre
- Ferien und Feiertage
- Zeitraster
- Klassenarbeiten / Prüfungen
- Hausaufgaben
- Abwesenheiten
- Posteingang
- Neuigkeiten
- System- und Benutzerinformationen

### WebUntis Trigger

Verfügbare Ereignisse:

- WebUntis-Daten aktualisiert
- Stundenplan geändert
- Hausaufgaben geändert
- Klassenarbeiten / Prüfungen geändert
- Posteingang geändert
- Abwesenheiten geändert

Der Trigger verwendet Polling. In den Workflow-Static-Data wird nur ein SHA-256-Fingerabdruck der zuletzt gesehenen Daten gespeichert.

## Projektidee: Schul & Familien OS

WebUntis ist nur eine Datenquelle. Das Projekt soll schrittweise mit weiteren n8n-Nodes und Diensten erweitert werden.

Geplante bzw. mögliche Bausteine:

- Push- und Smartphone-Benachrichtigungen
- Hausaufgaben-Automation
- Lehrer- und Fächerprofile
- Supabase als Familien-/Schuldatenbank
- Raum- und Etagenmapping der Schule
- Lernmaterialien und eingescannte Buchseiten
- automatische Zuordnung von Hausaufgaben zu Buchseite und Aufgabe
- PDF-Arbeitsblätter
- zusätzliche Übungsaufgaben
- Eltern-Lösungsblätter mit Erklärungen
- Kalender- und Termin-Automationen

Die WebUntis-Node bleibt dabei möglichst auf WebUntis konzentriert. Eigene Schulprofile, Karten, Lernmaterialien und Familienlogik sollten in separaten Nodes oder Datenbanken geführt werden.

## Sicherheit

WebUntis-Daten können personenbezogen und sensibel sein.

- Secret Keys, Passwörter und QR-URLs gehören ausschließlich in n8n Credentials.
- Keine Session-Cookies, Secret Keys oder QR-URLs in Workflow-JSON oder Logs speichern.
- Abwesenheiten, Schülerdaten, Noten und Nachrichten nur in geschützten Workflows verarbeiten.
- WebUntis-Berechtigungen unterscheiden sich je nach Schule und Benutzerkonto.
- Ein `Permission denied` kann daher ein korrektes Serververhalten sein.

## Authentifizierung

Unterstützt werden:

- Secret Key manuell
- Benutzername + Passwort
- Untis QR-URL

## Installation

Für selbst gehostetes n8n:

1. **Settings**
2. **Community Nodes**
3. Paket installieren:

```text
n8n-nodes-hemmilicious-webuntis
```

## Entwicklung und Veröffentlichung

Vor einer Veröffentlichung:

```bash
npm install
npm run lint
npm test
rm -rf dist tsconfig.tsbuildinfo
npm run build
npm pack --dry-run
```

Die wichtigsten Aktionen sollten anschließend mit einem echten WebUntis-Konto getestet werden.

## Technische Basis

Entwickelt für:

- n8n 2.38.x
- Node.js 22+
- webuntis 2.2.1
- TypeScript 5.9.x

## Lizenz

MIT
