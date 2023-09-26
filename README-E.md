Progressive Web Apps - Aktuelle Trends der IKT 2023
capture ist eine PWA, welche als digitale Collage für analog geschossene Bilder dienen soll. Neben dem Foto können Titel des Bildes, Location, sowie die Art der Filmrolle eingetragen werden. Somit wird Analog-Fotograf*innen die Arbeit erleichtert, wenn es um die Sortierung eigener Collagen geht.

Installation
Zum Ausführen des Projektes wird Node.js verwendet. Sie müssen es auf Ihren Rechner installieren.

Zum Starten des Projektes wechseln Sie im Terminal (Terminal Ihres Rechners oder das Terminal in der IDE) in den Projektordner (cd IKT-PWA-01) und führen dort

npm install

aus (es genügt auch npm i). Damit werden alle erforderlichen Abhängigkeiten installiert.
## Installation BACKEND

1. Wechsel in das Projektverzeichnis:

```bash
    git clone deins
    cd dein-projekt
```

2. Installiere die erforderlichen Abhängigkeiten:

```bash
    npm install
```

3. Erstelle eine Datei namens .env im Hauptverzeichnis und konfiguriere die Verbindung zur MongoDB-Datenbank:

```env
DB_CONNECTION = mongodb+srv://<name>:<password>@<database_bezeichnung>?retryWrites=true&w=majority
DB_NAME = <database>
COLLECTION = posts
```

Ersetze `mongodb+srv://<name>:<password>@<database_bezeichnung>` durch die Verbindungs-URL deiner MongoDB-Datenbank.

- Erstelle einen Netzwerkzugang z.b. 0.0.0.0 für alle Sichtbar
- Erstelle einen User mit PW
- Unter Connect / Driver / Node.js lässt sich die Zugangs-URI ausgeben

## Verwendung

### Direkter Start 

```bash
    node server.js
```

### Über npm 
Dazu muss jedoch das Script Backend innerhalbd er package.json eingebunden sein

```json
    "scripts": {
        "backend": "node server.js"
    },
```
npm backend


frontend:
npm start in Ordner: Graffiti (das is n skriopt aus frontend package.json btw)


- Node.js: [Installationsanleitung](https://nodejs.org/)
- MongoDB: [Installationsanleitung](https://docs.mongodb.com/manual/installation/)
MongoDB Cloud: [Website](https://cloud.mongodb.com/)