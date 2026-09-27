# TruthLens
> **Evidence-First AI Fact-Checking and Claim Investigation Platform**

---

## 🏆 Hackathon Details
* **Hackathon Portal:** [Azisly Hackathon](https://hackathon.azisly.ai)
* **Hackathon ID:** AZIS-2A4NRJ
* **Team Name:** Shivam's Team
* **College:** NITRA Technical Campus
* **Team Members:**
  * Shivam Maurya (shivammaurya13681@gmail.com)
  * Sachin Yadav
  * Karan

---

TruthLens is a misinformation-triage platform designed to help users investigate factual claims using retrieved external evidence rather than relying solely on AI model knowledge. By separating **evidence retrieval** from **AI reasoning**, TruthLens provides a transparent, auditable, and uncertainty-aware fact-checking experience.

## 📌 Overview

The modern information ecosystem is flooded with misleading, incomplete, and contradictory claims. A conventional AI chatbot can generate confident answers even when reliable evidence is unavailable, leading to hallucinations. 

TruthLens solves this by forcing the AI to reason *only* over retrieved, validated evidence from multiple sources. If the evidence is insufficient or contradictory, TruthLens communicates uncertainty instead of forcing a binary "True" or "False" conclusion.

## 🧠 Core Philosophy

1. **Evidence First:** The AI reasons over retrieved evidence, not its internal training data.
2. **Source Transparency:** Users see exactly which sources support, contradict, or leave a claim unclear.
3. **Uncertainty Awareness:** If external sources lack information, the system returns an `insufficient_evidence` verdict rather than fabricating proof.
4. **Non-Fabrication Architecture:** If the system did not retrieve the evidence, the AI cannot present it as a citation or URL.

## ⚙️ How It Works: The Investigation Pipeline

TruthLens converts a user claim into a structured investigation through a multi-stage pipeline:

```text
User Claim Submitted
       │
       ▼
Search Orchestrator
       │
 ┌─────┼─────┐
 │     │     │
 ▼     ▼     ▼
News  PIB   OpenAlex  (Parallel fetching with partial-failure handling)
 │     │     │
 └─────┼─────┘
       │
       ▼
Evidence Normalization (Standardizing metadata, titles, URLs)
       │
       ▼
Deduplication & Relevance Filtering (Removing duplicates & low-relevance matches)
       │
       ▼
Gemini AI Synthesis (Classifying evidence & generating structured analysis)
       │
       ▼
Strict Output Validation (Ensuring valid JSON, real citations, and logical verdicts)
       │
       ▼
MongoDB Persistence & Frontend Rendering
```

## ✨ Features

* **Multi-Source Evidence Retrieval:** 
  * **News:** Recent reporting via NewsAPI.
  * **Government:** Official announcements and schemes via PIB RSS.
  * **Research:** Academic and scientific evidence via OpenAlex.
* **Partial-Failure Handling:** If one provider goes down, the investigation continues with available data.
* **Evidence Classification:** Categorizes retrieved data into *Supporting*, *Contradicting*, or *Unclear*.
* **Strict AI Output Guardrails:** Validates risk levels, confidence scores, and prevents hallucinated URLs.
* **Interactive Investigation UI:** Real-time visual progress from claim submission to final evidence cards.
* **Investigation History:** Authenticated users can save and revisit previous fact-checks.

## 🛠 Tech Stack

| Layer               | Technology                          |
| ------------------- | ----------------------------------- |
| **Frontend**        | React, Vite, Tailwind CSS, Framer Motion, React Router |
| **Backend**         | Node.js, Express                    |
| **Database**        | MongoDB, Mongoose                   |
| **Authentication**  | JWT (JSON Web Tokens)               |
| **Evidence Sources**| NewsAPI, PIB RSS, OpenAlex          |
| **AI Synthesis**    | Google Gemini API                   |

## 🔐 Environment Variables (.env Setup)

To run TruthLens locally, create a `.env` file in the root of your backend directory and populate it with the following keys. **Never commit this file to version control.**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string_here

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# External APIs for Evidence Retrieval
NEWS_API_KEY=your_news_api_key_here
OPENALEX_API_KEY=your_openalex_api_key_here  # Optional depending on OpenAlex tier

# AI Synthesis
GEMINI_API_KEY=your_google_gemini_api_key_here
```

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB instance (local or Atlas)
* API keys for Gemini and NewsAPI

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/truthlens.git
   cd truthlens
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create your .env file here based on the template above
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the platform:**
   Open `http://localhost:5173` in your browser.
