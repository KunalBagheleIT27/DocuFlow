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
# 🚀 DocuFlow

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-brightgreen)](#)
[![Backend](https://img.shields.io/badge/backend-SpringBoot-orange)](#)
[![Status](https://img.shields.io/badge/status-Active-success)](#)


A modern, polished document workflow UI — DocuFlow helps teams upload, review, and approve documents with a clean interface and role-based workflows.

---

<p align="center">
	<img src="screenshots/dashboard.png" alt="DocuFlow preview" width="900" style="border-radius:12px; box-shadow: 0 10px 30px rgba(2,6,23,0.08)" />
</p>

---

## ✨ Highlights

- Beautiful, responsive UI built with React + Vite.
- Role-driven workflows (Submitter / Reviewer / Approver).
- Full frontend mock API for local development (no backend required).
- Clean layouts: sticky header + footer, fixed left navigation, spacious cards.

---

## Quick start (frontend)

```powershell
# from project root
cd C:\Users\kunal\DocuFlow
npm install
npm run dev
# then open http://localhost:5173
```

> The frontend uses Vite and React (TSX). If you prefer pnpm or yarn, those work too.

## Backend (optional)

The project includes a Spring Boot backend under `backend/`. You can run it if you need the full stack features (MongoDB, Pulsar integrations):

```powershell
cd backend
mvn -DskipTests spring-boot:run
```

Configuration is in `backend/src/main/resources/application.yml` (port 9090 by default).

---

## Files & Structure

- `src/` — React frontend
- `backend/` — Spring Boot backend
- `src/styles/global.css` — app-wide design tokens and layout

---

## Features

- Document upload with metadata
- Document lists (All / My Documents) with nice cards and badges
- Inbox / Tasks with Approve/Reject actions
- Templates management
- Mock API available at `src/services/mockApi.ts` for local development

---

## Screenshots

Add screenshots to `screenshots/` and reference them here. Example images are included in the repo to preview the layout.

---

## Contributing

If you'd like to contribute:

1. Fork the repo
2. Create a branch named `feature/your-feature`
3. Commit your changes with clear messages
4. Open a PR — I'll review and merge

---

## Commit conventions I used

- `feat:` — new features
- `fix:` — bug fixes
- `ui:` — visual & layout changes
- `chore:` — maintenance

---

## License

DocuFlow is MIT licensed — see `LICENSE`.

---

<p align="center">
	<strong>Enjoy DocuFlow — a small, delightful document workflow UI.</strong>
</p>

---

## 🎨 Designer Showcase

> This README is styled to give a modern product-first impression — clean sections, emoji-led headings, attractive badges and quick-action buttons.

<p align="center">
	<a href="#" style="text-decoration:none">
		<img alt="Open on GitHub" src="https://img.shields.io/badge/Open%20on-GitHub-22272E?logo=github&style=for-the-badge" />
	</a>
	<a href="#" style="text-decoration:none; margin-left:8px">
		<img alt="Live demo" src="https://img.shields.io/badge/Live%20Demo-Visit-blue?style=for-the-badge&logo=vercel" />
	</a>
</p>

---

## 📌 Project Summary

- Project: **DocuFlow** — a sleek document workflow UI for collaboration and approvals.
- Stack: React + Vite (frontend), Spring Boot (backend) — optional for local dev.
- Goals: fast feedback for reviewers, clear document history, role-based approvals.

---

## 🧭 Specification

- UI: Responsive, accessible components, sticky header & footer, fixed left navigation.
- Data: Mocked API for UI-centric development; backend connects to MongoDB and optional Pulsar.
- Pages: Dashboard, All Documents, My Documents, Upload, Inbox/Tasks, Templates, Reports, Settings.

---

## 🎯 Use Cases & Impact

- Teams that need a lightweight document approval flow without heavy process overhead.
- Quick onboarding for reviewers: single-click Approve/Reject actions.
- Improves auditability (timestamps, history) for compliance.

Impact:
- Faster approvals — reduce review time by surfacing pending tasks.
- Cleaner collaboration — document cards with metadata make discovery easier.

---

## 🛠 Tech Stack & APIs

Built with modern open-source tech:

<p>
	<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5" alt="HTML5" />
	<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3" alt="CSS3" />
	<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
	<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
	<img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring" alt="Spring Boot" />
</p>

APIs & integrations (optional): MongoDB, Apache Pulsar.

---

## ✨ Visual & UX Notes

- Inputs: modern rounded fields, larger touch targets, subtle shadow on focus.
- Cards: increased padding and elevation for laptop screens, responsive grid columns.
- Accessibility: clear contrast, keyboard focus styles and large clickable buttons.

---

## ▶️ Quick Actions

<p align="center">
	<a href="#" style="text-decoration:none"><img src="https://img.shields.io/badge/Run%20Locally-Start%20Dev%20Server-brightgreen?style=for-the-badge&logo=linux" alt="Run" /></a>
	<a href="#" style="text-decoration:none; margin-left:8px"><img src="https://img.shields.io/badge/Open%20Issues-Report%20Bug-red?style=for-the-badge&logo=github" alt="Issues" /></a>
</p>

---

## ✅ Getting Started (recap)

```powershell
cd C:\Users\kunal\DocuFlow
npm install
npm run dev

# open http://localhost:5173
```

---

If you want, I can further:

- Add high-resolution screenshots to `screenshots/` and wire them into this README.
- Create a beautiful `docs/` page with an interactive demo and design tokens.
- Clean the repo (remove tracked build outputs) and add a polished `.gitignore`.

---

_Made with ❤️ — let's make DocuFlow feel like a product-ready app._




