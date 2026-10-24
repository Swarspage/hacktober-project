# 🛡️ Agreement RedFlag Reader
### Dynamic Contract Risk Analysis & Interactive Negotiation Studio

[![Live Demo](https://img.shields.io/badge/Live_Demo-hacktober.swarshinde.dev-1E40AF?style=for-the-badge&logo=google-chrome&logoColor=white)](https://hacktober.swarshinde.dev)
[![GitHub Stars](https://img.shields.io/github/stars/Swarspage/hacktober-project?style=for-the-badge&logo=github&color=0F172A)](https://github.com/Swarspage/hacktober-project/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge&logo=git&logoColor=white)](https://github.com/Swarspage/hacktober-project/pulls)
[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2026_Hack_Day-FF7A00?style=for-the-badge&logo=hacktoberfest&logoColor=white)](https://hacktoberfest.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Open Issues](https://img.shields.io/github/issues/Swarspage/hacktober-project?style=for-the-badge&logo=github)](https://github.com/Swarspage/hacktober-project/issues)

> **An open-source LegalTech AI initiative for Hacktoberfest 2026 Hack Day Mumbai.**  
> **Author & Lead Maintainer:** [Swar Shinde](https://github.com/Swarspage)  
> **Live Web App:** [https://hacktober.swarshinde.dev](https://hacktober.swarshinde.dev)  
> **Repository:** [https://github.com/Swarspage/hacktober-project](https://github.com/Swarspage/hacktober-project)

---

## 📌 The Problem & Mission

The legal technology landscape suffers from a massive information asymmetry: institutional landlords and corporate property managers routinely use dense, one-sided boilerplate agreements packed with traps, while everyday tenants lack the legal expertise or budget to analyze and negotiate them.

**Agreement RedFlag Reader** is an open-source LegalTech AI application built to level the playing field. Tailored for Maharashtra Leave & Licence agreements and residential leases, it automates clause verification, calculates an explainable mathematical risk score (0–100), and equips tenants with an interactive studio to redline terms and export legally sound counter-proposals.

### 🌟 Core Architectural Highlights
1. **Verbatim Quote Verification & Hallucination Filter**: Strictly extracts only clauses that physically exist in the source document. If a flagged quote cannot be matched verbatim against the text, it is automatically purged.
2. **Dynamic Risk Score Calculation Engine**: A transparent mathematical index (0–100) and letter grades (`A+` to `F`), powered by severity weighting, category multipliers, and compound penalty calculations.
3. **User-Configurable Risk Engine**: Signatories can fine-tune severity penalties, category sensitivity multipliers, and risk boundaries to match their personal risk tolerance.
4. **Interactive Negotiation & Legal Redlining Studio**: Mark clauses as `To Negotiate`, `Dealbreaker`, `Agreed by Owner`, or `Waived`. Watch your projected risk score drop in real-time as terms are resolved.
5. **Multi-Format Export Hub**: Instant generation of:
   - 📑 **Formal Lease Addendum / Amendment Document** (Formal legal wording ready to attach to lease)
   - 📧 **Executive Landlord Negotiation Email**
   - 💬 **WhatsApp / Broker Mobile Summary**
   - 📊 **Full Risk & Compliance Audit Record**
6. **Bring Your Own API Key (BYOK)**: Privacy-first architecture allowing users on public deployments to safely use their personal free Google Gemini API key securely stored in browser `localStorage`.
7. **Bilingual Engine (English & हिन्दी)**: Full localization for the Mumbai and Maharashtra tenancy ecosystems.

---

## ⚡ System Architecture

```mermaid
flowchart TD
    A[Contract Text / Sample Lease] --> B[Express / Node API Server]
    B --> C[Google Gemini Minimal-Thinking Engine]
    C --> D[Verbatim Quote Grounding Filter]
    D --> E[Mathematical Risk Score Engine 0-100]
    
    subgraph Frontend Studio [Inspection & Negotiation Workspace]
        E --> F1[Document Viewer with In-Text Highlights]
        E --> F2[Dynamic Circular Risk Gauge & Letter Grade]
        E --> F3[6-Dimension Category Risk Breakdown]
        E --> F4[Interactive Negotiation Cards & Redlines]
        E --> F5[Missing Safeguards Detector & Clause Inserter]
    end
    
    F4 --> G[Post-Negotiation Projected Risk Reduction]
    F4 --> H[Export Hub: Addendum, Email & WhatsApp]
    Frontend Studio -. User Tunable Weights .-> I[Risk Model Configuration Drawer]
```

---

## 📊 Dynamic Risk Engine & Categorical Breakdown

The dynamic risk calculation system operates across **6 core legal dimensions**:

| Dimension | Icon | Evaluated Traps & Liabilities |
| :--- | :---: | :--- |
| **Financial & Deposit** | 💰 | Delayed refund timelines, discretionary painting deductions, unagreed rent escalations. |
| **Lock-in & Termination** | 🔒 | Mandatory lock-in durations, premature exit fees, asymmetric notice clauses. |
| **Repairs & Maintenance** | 🛠️ | Shifting major structural issues, seepages, or society pipelines onto the licensee. |
| **Privacy & Landlord Entry** | 👁️ | Unannounced visits at any time of day/night, broker walkthroughs without notice. |
| **Rules, Guests & Subletting** | 👥 | Arbitrary restrictions on guests, visitors, bachelor occupancy, or family visits. |
| **Legal & Compliance** | ⚖️ | Stamp duty cost split, police verification duties, unilateral indemnity clauses. |

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite 8, React Router v7, Vanilla CSS (Design Tokens, Glassmorphism, Responsive Grid)
- **Backend**: Node.js, Express, CORS, Dotenv
- **AI & Reasoning**: Google GenAI SDK (`@google/genai`) using Gemini / Gemma minimal-thinking model
- **Linter & Code Quality**: Oxlint (High-performance linter, 0 errors)
- **Privacy & Security**: Ephemeral memory processing, client-side BYOK `localStorage`, zero document persistence

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [Google AI Studio API Key](https://aistudio.google.com/app/apikey) (Free tier available)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Swarspage/hacktober-project.git
cd hacktober-project

# 2. Install client and server dependencies
npm install --prefix client
npm install --prefix server

# 3. Configure backend environment
cp server/.env.example server/.env
```

Add your Gemini API key inside `server/.env`:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
PORT=5000
GEMMA_MODEL=gemma-4-26b-a4b-it
```
*(Note: If you run without `GOOGLE_API_KEY` on the server, you can supply your key directly in the web app UI using the Bring Your Own Key modal!)*

### Running Locally

```bash
# Start backend API (Port 5000)
npm run server

# In a separate terminal, start frontend dev server (Port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Benchmark Verification Agreements

The project includes 6 benchmark agreements in the studio dropdown for immediate testing:

| Sample Agreement | Target Profile | Benchmark Key Indicators |
| :--- | :--- | :--- |
| **Agreement 1: Safe & Balanced** | Low (~15/100, `A+`) | 7-day refund deadline, mutual 1-month notice, fair wear-and-tear. |
| **Agreement 2: Standard Safe** | Low (~22/100, `A`) | 11-month term, standard society maintenance split. |
| **Agreement 3: Moderate Lock-in** | Moderate (~42/100, `B`) | 6-month lock-in penalty, 30-day refund window. |
| **Agreement 4: Deductions & Escalation** | Moderate (~54/100, `B-`) | 10% annual rent hike, non-negotiable painting charges. |
| **Agreement 5: High Risk Penalties** | High (~76/100, `C`) | Full deposit forfeiture on early exit, unrestricted landlord entry. |
| **Agreement 6: Critical Predatory Traps** | Critical (~92/100, `F`) | Structural repairs shifted to tenant, deposit refund at owner's sole discretion. |

---

## 🤝 Contributing to Agreement RedFlag Reader

Contributions are warmly welcomed from developers, legal practitioners, and designers! We actively participate in **Hacktoberfest** and welcome Pull Requests of all experience levels.

### 🌟 How to Contribute

1. **Fork the Repository**  
   Click the **Fork** button at the top right of [this repo](https://github.com/Swarspage/hacktober-project).

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/<your-username>/hacktober-project.git
   cd hacktober-project
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes & Test**
   - Ensure the frontend builds cleanly:
     ```bash
     npm run build --prefix client
     ```
   - Run the linter to verify code cleanliness:
     ```bash
     npm run lint --prefix client
     ```

5. **Commit & Push**
   ```bash
   git commit -m "feat: describe your change concisely"
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**  
   Navigate to the [Pull Requests](https://github.com/Swarspage/hacktober-project/pulls) tab and open a PR with a description of what you improved and screenshots if applicable!

---

## 💡 Ideas for Contributions & Roadmap

Looking for inspiration? Here are some great areas to contribute to:

- [ ] **State-Specific Legal Adapters**: Extend verification beyond Maharashtra (e.g. Karnataka / Bengaluru, Delhi NCR, Telangana tenancy rules).
- [ ] **Document Ingestion**: Support PDF and DOCX file upload with client-side OCR / PDF text extraction.
- [ ] **Additional Indian Languages**: Add native support for Marathi (मराठी), Gujarati (ગુજરાતી), or Tamil (தமிழ்).
- [ ] **Multi-Agreement Comparative Diff**: Compare two revisions of an agreement side-by-side to highlight what changed after landlord negotiations.
- [ ] **PWA / Offline Mode**: Enable offline reviewing of cached agreements.
- [ ] **New Benchmark Datasets**: Add specialized commercial leases or student PG / co-living agreements to `samples/`.

---

## 🐛 Issues & Bug Reports

Found a bug or have a suggestion?
- Check existing [GitHub Issues](https://github.com/Swarspage/hacktober-project/issues) to see if it's already being tracked.
- If not, [Open a New Issue](https://github.com/Swarspage/hacktober-project/issues/new) using descriptive details, steps to reproduce, and screenshots.

---

## 📜 Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all contributors regardless of background or experience level. Please treat fellow contributors with respect, offer constructive feedback, and collaborate in good faith.

---

## ⚖️ License

This project is licensed under the **[MIT License](LICENSE)** — feel free to use, modify, and distribute it for both open-source and commercial applications.

---

## 👨‍💻 Maintainer & Acknowledgments

- **Lead Author & Maintainer:** **[Swar Shinde](https://github.com/Swarspage)**
- **Event:** Built for **Hacktoberfest 2026 Hack Day Mumbai**
- **Live Deployment:** [https://hacktober.swarshinde.dev](https://hacktober.swarshinde.dev)

⭐ If you find this project helpful or inspiring, please give it a star on GitHub!
