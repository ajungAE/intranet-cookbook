# Intranet-Kochbuch API (Projekt FPAdW - Alex Jung)

## 📚 Projektübersicht

Dieses Projekt ist ein digitales Intranet-Kochbuch für die fiktive Firma DWG. Es ermöglicht registrierten Mitarbeitenden das Verwalten und Teilen eigener Rezepte. Entwickelt wurde ein vollständiges Node.js-Backend mit RESTful API inklusive Authentifizierung, Nutzerverwaltung und Rezeptfunktionen.

## 🔧 Tech-Stack

* **Backend:** Node.js, Express
* **Datenbank:** MariaDB
* **Authentifizierung:** JWT (JSON Web Tokens)
* **Testing:** Jest, Supertest
* **Dokumentation:** Markdown / README

## 🚀 Projektstatus

Abgeschlossen (Stand: Juni 2025)

## 🧪 Tests

* **Test-Frameworks:** Jest + Supertest
* **Getestete Funktionalitäten:**

  * Registrierung & Login (`/auth/register`, `/auth/login`)
  * Rezepte erstellen, abrufen, bearbeiten, löschen (`/recipes`)
  * Zugriffsbeschränkungen durch Authentifizierung (JWT)
* **Testabdeckung:**
  Die Tests prüfen alle Must-Have-Anforderungen. Eine Coverage-Analyse kann mit folgendem Befehl erzeugt werden:

  ```bash
  npm test -- --coverage
  ```

## 📁 Projektstruktur

```
kochbuch-fi37-jung/
├── controllers/          # Routenlogik
├── middleware/           # Authentifizierungs-Middleware
├── models/               # DB-Modelle (optional genutzt)
├── routes/               # API-Routen (auth, recipes)
├── config/db.js          # DB-Verbindung
├── server.js             # Express-App
├── tests/                # Jest-Testdateien
├── .env / .env.test      # Umgebungsvariablen
└── package.json
```

## 🛠️ Installation & Setup

1. **Repository klonen:**

   ```bash
   git clone <repo-url>
   cd kochbuch-fi37-jung/backend
   ```

2. **Abhängigkeiten installieren:**

   ```bash
   npm install
   ```

3. **Datenbank konfigurieren:**

   ```env
   # .env oder .env.test
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=deinuser
   DB_PASSWORD=deinpass
   DB_NAME=fi37_jung_fpadw
   JWT_SECRET=dein-jwt-secret
   ```

4. **Datenbank erstellen:**
   SQL-Datei aus `/db/init.sql` (falls vorhanden) ausführen.

5. **Server starten:**

   ```bash
   npm start
   ```

6. **Tests ausführen:**

   ```bash
   npm test
   ```

   Optional für offene Handles:

   ```bash
   npm test -- --detectOpenHandles
   ```

   Optional mit Coverage:

   ```bash
   npm test -- --coverage
   ```

## 🔐 Beispiel-API-Aufrufe

### Registrierung

```bash
curl -X POST http://localhost:3443/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "username": "testuser", "password": "Pass123!"}'
```

### Login (Token erhalten)

```bash
curl -X POST http://localhost:3443/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Pass123!"}'
```

### Rezept erstellen (mit JWT)

```bash
curl -X POST http://localhost:3443/recipes \
  -H "Authorization: Bearer <dein-token>" \
  -F "title=Mein Rezept" \
  -F "ingredients=Zutaten" \
  -F "instructions=Anleitung"
```

## 📝 Hinweise

* `.env.test` wird in `.gitignore` ignoriert, um sensible Daten zu schützen
* Bei Testläufen wird eine eigene Testdatenbank verwendet
* Es wird empfohlen, `db.end()` nach allen Tests aufzurufen

## 📷 Optional: Screenshots / Vorschau

*(Können bei Präsentation ergänzt werden)*

---

© 2025 Alexander Jung – Abschlussprojekt DWG FPAdW, Klasse FI37-1 Comhard GmbH
