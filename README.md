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

  Die Coverage-Berichte (inkl. HTML) befinden sich im Verzeichnis:

  ```
  /backend/coverage/lcov-report/
  ```

  Im Browser öffnen:

  ```bash
  firefox coverage/lcov-report/index.html
  ```

## 🔗 API-Übersicht

| Methode | Endpoint               | Beschreibung                       | Auth nötig |
| ------- | ---------------------- | ---------------------------------- | ---------- |
| POST    | /auth/register         | Benutzer registrieren              | ❌          |
| POST    | /auth/login            | Einloggen und Token erhalten       | ❌          |
| GET     | /recipes               | Alle Rezepte abrufen               | ❌          |
| GET     | /recipes/\:id          | Einzelnes Rezept abrufen           | ❌          |
| POST    | /recipes               | Rezept erstellen                   | ✅          |
| PUT     | /recipes/\:id          | Rezept bearbeiten                  | ✅          |
| DELETE  | /recipes/\:id          | Rezept löschen                     | ✅          |
| POST    | /recipes/\:id/favorite | Rezept als Favorit markieren       | ✅          |
| DELETE  | /recipes/\:id/favorite | Rezept aus Favoriten entfernen     | ✅          |
| POST    | /recipes/\:id/comments | Kommentar zum Rezept hinzufügen    | ✅          |
| GET     | /recipes/\:id/comments | Kommentare zu einem Rezept abrufen | ❌          |

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
   PORT=3443
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
* Port ist über `.env` frei konfigurierbar (`PORT=3443`)

## 📷 Optional: Screenshots / Vorschau

*(Können bei Präsentation ergänzt werden)*

---

© 2025 Alex Jung – Abschlussprojekt FPAdW, Klasse FI37

---

# 📘️ Intranet Cookbook API (Project FPAdW - Alex Jung)

## 📚 Project Overview

This project is a digital intranet cookbook for the fictional company DWG. It allows registered employees to manage and share their own recipes. A full-featured Node.js backend with a RESTful API was developed, including authentication, user management, and recipe operations.

## 🔧 Tech Stack

* **Backend:** Node.js, Express
* **Database:** MariaDB
* **Authentication:** JWT (JSON Web Tokens)
* **Testing:** Jest, Supertest
* **Documentation:** Markdown / README

## 🚀 Project Status

Completed (as of June 2025)

## 🧪 Tests

* **Frameworks:** Jest + Supertest
* **Test Coverage Includes:**

  * User registration & login (`/auth/register`, `/auth/login`)
  * Creating, reading, updating, and deleting recipes (`/recipes`)
  * Access control via JWT authentication
* **Coverage:**
  All must-have features are tested. Generate test coverage with:

  ```bash
  npm test -- --coverage
  ```

  HTML reports are generated under:

  ```
  /backend/coverage/lcov-report/
  ```

  Open with:

  ```bash
  firefox coverage/lcov-report/index.html
  ```

## 🔗 API Overview

| Method | Endpoint               | Description                  | Auth Required |
| ------ | ---------------------- | ---------------------------- | ------------- |
| POST   | /auth/register         | Register new user            | ❌             |
| POST   | /auth/login            | Login and get token          | ❌             |
| GET    | /recipes               | Fetch all recipes            | ❌             |
| GET    | /recipes/\:id          | Fetch single recipe by ID    | ❌             |
| POST   | /recipes               | Create new recipe            | ✅             |
| PUT    | /recipes/\:id          | Update recipe                | ✅             |
| DELETE | /recipes/\:id          | Delete recipe                | ✅             |
| POST   | /recipes/\:id/favorite | Mark recipe as favorite      | ✅             |
| DELETE | /recipes/\:id/favorite | Remove recipe from favorites | ✅             |
| POST   | /recipes/\:id/comments | Add comment to recipe        | ✅             |
| GET    | /recipes/\:id/comments | Get comments for recipe      | ❌             |

## 📁 Project Structure

```
kochbuch-fi37-jung/
├── controllers/          # Route logic
├── middleware/           # JWT middleware
├── models/               # DB models (optionally used)
├── routes/               # API routes (auth, recipes)
├── config/db.js          # DB connection
├── server.js             # Express app
├── tests/                # Jest test files
├── .env / .env.test      # Environment variables
└── package.json
```

## 🛠️ Installation & Setup

1. **Clone repository:**

   ```bash
   git clone <repo-url>
   cd kochbuch-fi37-jung/backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure database:**

   ```env
   # .env or .env.test
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=youruser
   DB_PASSWORD=yourpass
   DB_NAME=fi37_jung_fpadw
   JWT_SECRET=your-jwt-secret
   PORT=3443
   ```

4. **Create database:**
   Execute the SQL file from `/db/init.sql` (if present).

5. **Start server:**

   ```bash
   npm start
   ```

6. **Run tests:**

   ```bash
   npm test
   ```

   Optional to detect open handles:

   ```bash
   npm test -- --detectOpenHandles
   ```

   Optional with coverage:

   ```bash
   npm test -- --coverage
   ```

## 🔐 Example API Usage

### Register

```bash
curl -X POST http://localhost:3443/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "username": "testuser", "password": "Pass123!"}'
```

### Login (get token)

```bash
curl -X POST http://localhost:3443/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Pass123!"}'
```

### Create recipe (with JWT)

```bash
curl -X POST http://localhost:3443/recipes \
  -H "Authorization: Bearer <your-token>" \
  -F "title=My Recipe" \
  -F "ingredients=Ingredients" \
  -F "instructions=Instructions"
```

## 📝 Notes

* `.env.test` is gitignored to protect sensitive information
* Tests use a dedicated test database
* Call `db.end()` after all tests to cleanly close connections
* The API port is configurable via `.env` (`PORT=3443`)

## 📷 Optional: Screenshots / Preview

*(To be added for presentation if needed)*

---

© 2025 Alex Jung – Final project FPAdW, Class FI37
