## DocuFlow Frontend

React + Vite single-page app implementing the DocuFlow UI (no backend). Includes login, upload, document list, and document detail with role-based workflow actions. Designs inspired by the referenced wireframes at `https://www.figma.com/make/hL3N9C7sd8SfrUP9fN7TOA/DocuFlow-Wireframe-Design?node-id=0-4&t=YofFc6nCRjuyOHSL-0`.

### Getting started

```bash
pnpm i # or: npm i / yarn
pnpm dev # or: npm run dev / yarn dev
```

Open `http://localhost:5173`.

### Backend (Spring Boot 3)

Folder: `backend/`

Build and run:

```bash
cd backend
mvn spring-boot:run
```

Configurations in `backend/src/main/resources/application.yml`:
- `spring.data.mongodb.uri` (default `mongodb://localhost:27017/docuflow`)
- `app.pulsar.serviceUrl` (default `pulsar://localhost:6650`)

Verify:
```
GET http://localhost:8080/api/documents
```
returns `[]` initially.

### Features
- Login with mocked roles (Submitter/Reviewer/Approver) via username keywords.
- Document list with search and state filters.
- Upload form with validation (stored in localStorage).
- Document detail with workflow transitions (role-gated) and delete.

### Notes
- All data is stored in `localStorage` under `docuflow_docs` and `docuflow_user`.
- No backend calls; see `src/services/mockApi.ts`.



