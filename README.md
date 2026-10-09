# ClientFlow ⚡

> **Your freelance business, in flow.**

ClientFlow is an AI-powered workspace built for creative freelancers, independent developers, designers, and small creative studios. It turns unstructured client requests into structured projects, generates professional proposals, plans milestone timelines, manages tasks, creates invoices, drafts client emails, and controls projects through an autonomous conversational AI agent with real application tools and human safety approvals.

---

## ✨ Key Features

- **Brief to Build (AI Project Intake)**: Convert messy client messages into a complete, editable project blueprint with milestones, tasks, and budget allocations.
- **Signature Project Canvas & Flow Board**: Dual-view project workspace with connected milestone timelines, deliverable trackers, and drag-and-drop Kanban columns.
- **Flow Agent (Autonomous Project Assistant)**: Context-aware AI assistant equipped with real application tools and a human-in-the-loop confirmation loop before mutating project data.
- **Proposal Studio**: Document-first proposal editor with interactive pricing tables, terms, auto-totals, and one-click PDF export.
- **Invoice Studio**: Milestone invoice creation with dynamic line items, payment settlement tracking (UPI/Bank Transfer), and PDF export.
- **Client Communication Studio**: Project-aware client emails with tone selectors (Friendly, Professional, Concise) and one-click clipboard copy.
- **Client Dossiers & Document Library**: 360-degree client directories and categorized document archives.
- **Global Command Palette (`Ctrl+K`)**: Instant fuzzy search across projects, clients, invoices, and studio shortcuts.
- **Fully Responsive & Accessible**: Optimized for mobile and desktop screens with dedicated mobile navigation.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide React, jsPDF, html2canvas
- **Backend**: Node.js, Express, CORS, Dotenv
- **AI Integration**: Google Generative AI (Gemini API) + Local Deterministic Autonomous Agent Engine
- **Storage & State**: React Context API with LocalStorage sync & Firebase Auth ready architecture

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/clientflow.git
cd clientflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(If no `GEMINI_API_KEY` is provided, ClientFlow automatically uses its built-in deterministic autonomous agent engine).*

### 4. Run the development servers

**Terminal 1: Start Backend API**
```bash
node server/index.js
```

**Terminal 2: Start Frontend**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 License

MIT License © 2026 ClientFlow
