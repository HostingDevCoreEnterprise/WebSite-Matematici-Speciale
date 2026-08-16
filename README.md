# Matematici Speciale

Modern educational platform dedicated to **Matematici Speciale**, providing structured learning resources, mathematical materials, questions, announcements, and tools for studying the subject.

**Production website:** `https://www.matematicispeciale.site`
**API:** `https://api.matematicispeciale.site`
**Admin dashboard:** `https://dashboard.matematicispeciale.site`

---

## Overview

This repository contains the frontend, backend API, and administration dashboard for the **Matematici Speciale** educational platform.

The platform is divided into three independent components:

* **Student frontend** — public educational website for students and visitors.
* **Backend API** — Express.js API responsible for application data, authentication, and database communication.
* **Admin dashboard** — private administrative interface for managing platform content and data.

The student frontend and admin dashboard are static web applications built with HTML, CSS, and JavaScript. The backend is implemented using Node.js and Express.js and communicates with a PostgreSQL database hosted on Neon.

Deployment configuration is maintained separately from this README.

---

## Technology

### Student Frontend

* HTML5
* CSS3
* JavaScript
* Static assets
* Client-side API integration
* SEO resources
* Custom production domain

### Backend API

* Node.js
* Express.js
* PostgreSQL
* Neon Database
* JWT authentication
* REST-style API endpoints
* CORS configuration

### Admin Dashboard

* HTML5
* CSS3
* JavaScript
* Static assets
* Client-side API integration
* JWT-based authentication

---

## Repository Structure

The exact structure may evolve, but the project is generally organized as follows:

```text
.
├── ms site/
│   ├── student/
│   │   ├── index.html
│   │   ├── assets/
│   │   │   ├── css/
│   │   │   ├── js/
│   │   │   ├── images/
│   │   │   └── icons/
│   │   ├── favicon/
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   │
│   ├── backend/
│   │   ├── servers.js
│   │   ├── package.json
│   │   ├── schema.sql
│   │   └── seed.sql
│   │
│   └── admin/
│       ├── index.html
│       ├── assets/
│       │   ├── css/
│       │   ├── js/
│       │   ├── images/
│       │   └── icons/
│       ├── favicon/
│       └── robots.txt
│
└── README.md
```

---

## Architecture

The platform consists of three independently maintained application components.

### Student Frontend

The student frontend is the public-facing educational website.

```text
Student Browser
      │
      ▼
matematicispeciale.site
      │
      ▼
api.matematicispeciale.site
```

The frontend communicates with the backend API through the configuration stored in `window.MS_CONFIG`.

The production configuration uses:

```javascript
window.MS_CONFIG = {
    apiBase: "https://api.matematicispeciale.site",
    adminBase: "https://dashboard.matematicispeciale.site"
};
```

### Backend API

The backend provides the data and application services required by the student frontend and administrator dashboard.

```text
Student Frontend ──────┐
                       │
Admin Dashboard ───────┼──► Express API ───► PostgreSQL
                       │
                       └──► Authentication
```

The production API is available at:

```text
https://api.matematicispeciale.site
```

The backend is responsible for tasks such as:

* API request handling
* database access
* authentication
* authorization
* data validation
* CORS handling
* administrative operations

### Admin Dashboard

The admin dashboard provides authenticated administrative functionality.

```text
Administrator
      │
      ▼
dashboard.matematicispeciale.site
      │
      ▼
api.matematicispeciale.site
      │
      ▼
PostgreSQL
```

The dashboard should remain private and must not be indexed by search engines.

---

## Local Development

### Student Frontend

The student frontend is a static application and does not require a build system.

From the student directory, run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

A local HTTP server is recommended instead of opening `index.html` directly because it provides behavior closer to a normal web deployment.

### Backend API

Install the Node.js dependencies:

```bash
npm install
```

Create the required environment configuration:

```text
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_secure_random_secret
PORT=4000
```

Start the API:

```bash
node servers.js
```

The API will run on the configured port.

### Admin Dashboard

The admin dashboard is also a static application.

From the admin directory:

```bash
python3 -m http.server 8000
```

Then open the local address in a browser.

If the student frontend and admin dashboard are being developed simultaneously, use different local ports.

---

## Database

The backend uses **PostgreSQL** hosted through **Neon**.

The database schema is defined in:

```text
schema.sql
```

Initial database data is defined in:

```text
seed.sql
```

### Database Setup

A new development database can be initialized by:

1. Creating a PostgreSQL database.
2. Obtaining the database connection string.
3. Setting `DATABASE_URL`.
4. Executing `schema.sql`.
5. Optionally executing `seed.sql`.

The database connection string must remain private.

Example environment configuration:

```text
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=your_secure_random_secret
PORT=4000
```

Do not commit real credentials or secrets to the repository.

---

## API Configuration

The student frontend and admin dashboard communicate with the API using their respective configuration objects.

Production API:

```text
https://api.matematicispeciale.site
```

Production admin dashboard:

```text
https://dashboard.matematicispeciale.site
```

The production student frontend should use:

```javascript
window.MS_CONFIG = {
    apiBase: "https://api.matematicispeciale.site",
    adminBase: "https://dashboard.matematicispeciale.site"
};
```

Local development configuration may use the locally running API where appropriate.

---

## CORS

The backend restricts cross-origin requests to approved origins.

Production origins include:

```text
https://matematicispeciale.site
https://www.matematicispeciale.site
https://dashboard.matematicispeciale.site
```

Local development may also use:

```text
http://localhost:3000
```

If application domains change, the allowed origins in the backend must be updated accordingly.

CORS configuration should be kept restrictive and should not allow arbitrary production origins.

---

## Authentication & Security

The backend uses JWT-based authentication for protected functionality.

The JWT signing secret must be stored securely using environment variables.

Sensitive configuration must never be committed to the repository.

Do not commit:

* `.env` files containing secrets
* `DATABASE_URL`
* `JWT_SECRET`
* administrator credentials
* API keys
* private tokens
* session secrets
* other production credentials

Administrative functionality should only be accessible through authenticated and authorized API operations.

---

## API Health Check

The backend exposes a health endpoint:

```text
https://api.matematicispeciale.site/api/health
```

A successful request should return a JSON response indicating that the API is operational.

For example:

```json
{
  "ok": true
}
```

The exact response may contain additional fields depending on the current implementation.

---

## SEO

SEO applies primarily to the public student website.

The public website should contain appropriate technical SEO resources for indexable educational content.

### Sitemap

Production sitemap:

```text
https://matematicispeciale.site/sitemap.xml
```

The sitemap should contain only public and indexable pages.

### Robots

Production robots file:

```text
https://matematicispeciale.site/robots.txt
```

The public website should allow search engines to crawl relevant educational content while excluding unnecessary internal resources and routes.

The admin dashboard has its own `robots.txt` and should prevent search engine indexing.

### Metadata

Public pages should use appropriate:

* `<title>` elements
* meta descriptions
* canonical URLs
* Open Graph metadata
* Twitter/X metadata where appropriate
* language and locale information
* structured data where applicable

The canonical production domain is:

```text
https://matematicispeciale.site
```

Development, localhost, preview, API, and administrative domains should not be used as canonical URLs for public educational pages.

---

## Favicon & Branding

The official **Matematici Speciale** branding should be used throughout the platform.

The applications should include the appropriate:

* browser favicon
* touch/Apple icon where applicable
* web manifest icons where applicable
* application branding assets

Placeholder or framework-default branding should not be used in production.

---

## Google Search Console

The public website can be managed through Google Search Console.

Production website:

```text
https://matematicispeciale.site
```

Production sitemap:

```text
https://matematicispeciale.site/sitemap.xml
```

Only the public student website should be treated as an indexable search destination.

The API and administrator dashboard are application infrastructure and should not be submitted as public search destinations.

Submitting a sitemap does not guarantee immediate indexing because indexing is ultimately controlled by search engines.

---

## Development Guidelines

When modifying the project:

1. Keep student, backend, and admin responsibilities separated.
2. Avoid introducing unnecessary dependencies.
3. Keep frontend configuration explicit and easy to identify.
4. Validate API changes against both frontend applications.
5. Keep authentication and authorization logic on the backend.
6. Avoid exposing sensitive information in client-side JavaScript.
7. Preserve production SEO configuration when modifying public pages.
8. Test responsive behavior on different screen sizes.
9. Check browser console errors before committing changes.
10. Keep database schema changes documented and reproducible.

---

## Maintenance

When making future changes:

1. Test the affected component locally.
2. Verify frontend and backend communication.
3. Verify API requests and CORS behavior.
4. Check links and static assets.
5. Check SEO metadata for affected public pages.
6. Verify database changes against the current schema.
7. Ensure production domains remain correct.
8. Commit changes to the repository.
9. Push changes to the appropriate branch.
10. Verify the affected production service after deployment.

Deployment-specific procedures should be maintained separately from this README.

---

## Deployment Documentation

Deployment instructions are intentionally maintained separately from the main project documentation.

The repository may contain dedicated deployment documentation for:

* Student frontend deployment
* Backend API deployment
* Admin dashboard deployment
* Render configuration
* DNS configuration
* Production environment variables
* Database deployment and initialization

This separation keeps the main README focused on the architecture and development of the platform while allowing deployment procedures to evolve independently.

---

## Project Status

**Production-ready educational platform**

### Production Services

**Student website**

`https://matematicispeciale.site`

**Backend API**

`https://api.matematicispeciale.site`

**Admin dashboard**

`https://dashboard.matematicispeciale.site`

The platform consists of a public educational frontend, a Node.js/Express API, a PostgreSQL database, and a dedicated authenticated administration dashboard.
