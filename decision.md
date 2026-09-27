# TruthLens Architecture & Engineering Decisions

## 1. Purpose

This document records the major architectural and engineering decisions made during the development of TruthLens.

The purpose is to explain:
* why specific technologies were selected
* why the system uses multiple evidence providers
* why Gemini is separated from retrieval
* how evidence reliability is handled
* how failures are handled
* why the frontend follows an investigation workflow
* how the system prevents unsupported AI output

---

## 2. Decision: Evidence-First Architecture

### Decision
TruthLens uses an evidence-first architecture.

```text
Claim
 ↓
External Evidence Retrieval
 ↓
Evidence Processing
 ↓
AI Synthesis
 ↓
Validation
 ↓
Result
```

### Why
A language model can generate a plausible answer without having retrieved supporting evidence. For a fact-checking product, this creates a reliability problem. Therefore, the system separates:
* `Evidence Retrieval`
from
* `AI Reasoning`

### Result
Gemini receives retrieved evidence rather than being treated as the primary source of truth.

---

## 3. Decision: Multi-Source Search

### Decision
TruthLens uses multiple evidence sources rather than depending on a single API. Current integration includes:
* News
* Government
* Research/OpenAlex

### Why
Different claims require different evidence. For example:
* Breaking event → News
* Official policy/announcement → Government source
* Scientific/research claim → Research source

Using multiple sources also provides the ability to compare potentially conflicting information.

---

## 4. Decision: Separate Provider Services

### Decision
Each external provider is handled through a dedicated service layer. Conceptually:
* news service
* government service
* research service

### Why
Provider APIs have different request formats, response structures, rate limits, metadata, and failure conditions. Keeping them separate prevents provider-specific logic from spreading throughout controllers and frontend code.

### Result
A provider can be modified or replaced without redesigning the entire claim-processing pipeline.

---

## 5. Decision: Search Orchestration Layer

### Decision
A central search orchestration layer coordinates multiple providers.

```text
Claim
 ↓
Search Orchestrator
 ├── News
 ├── Government
 └── Research
```

### Why
The frontend should not know how external APIs work; it only needs a stable backend response. The orchestrator handles provider execution, result collection, normalization, provider status, partial failures, and aggregation.

---

## 6. Decision: Partial Failure Instead of Complete Failure

### Decision
One failed provider should not automatically fail the entire investigation.

Example:
* News → SUCCESS
* Government → FAILURE
* Research → SUCCESS

The system continues using available evidence.

### Why
External APIs are independent systems. A temporary provider failure should not make the entire product unusable. 

### Safety Rule
A failed provider must never be replaced by fabricated evidence.

---

## 7. Decision: No Evidence Fabrication

### Decision
TruthLens does not fabricate evidence when external APIs fail. If no reliable evidence is available, `insufficient_evidence` is returned.

### Why
For a fact-checking product, a fabricated citation is more dangerous than an incomplete result. Therefore, `No evidence ≠ false`. The system communicates the limitation instead.

---

## 8. Decision: Evidence Normalization

### Decision
All provider results are converted into a common evidence representation.

```json
{
  "title": "...",
  "url": "...",
  "source": "...",
  "sourceType": "...",
  "publishedAt": "...",
  "snippet": "..."
}
```

### Why
Without normalization, every downstream component would need provider-specific logic. Normalization allows a common evidence model to feed into the AI, Frontend, and Database consistently.

---

## 9. Decision: Evidence Deduplication

### Decision
Duplicate evidence is removed before AI synthesis.

### Why
The same article or research item may appear multiple times. If duplicates are retained, the same information can receive disproportionate weight.

### Strategy
Where possible, deduplication uses the canonical URL, normalized title, and source information.

---

## 10. Decision: Relevance Filtering

### Decision
Search results are filtered before final AI synthesis.

### Why
Keyword matching does not guarantee actual relevance. A search result may mention the same words while discussing a completely different event. The system applies relevance-oriented filtering before the final reasoning stage.

---

## 11. Decision: Supporting / Contradicting / Unclear

### Decision
Evidence is represented using three categories:
* Supporting
* Contradicting
* Unclear

### Why
Binary classification is too restrictive for real-world information. Some sources support a claim, some contradict it, and others provide related information without resolving it. The `Unclear` category preserves uncertainty instead of forcing an incorrect classification.

---

## 12. Decision: `insufficient_evidence` Verdict

### Decision
TruthLens includes `insufficient_evidence` as a valid outcome.

### Why
A system should not force a conclusion when evidence is missing. This is especially important when APIs fail, sources disagree, evidence is too weak/incomplete, or the claim cannot be resolved from available sources.

---

## 13. Decision: Gemini as Synthesis Layer

### Decision
Gemini is used for evidence interpretation and synthesis. It is not used as an independent internet search engine.

```text
External APIs
     ↓
Retrieved Evidence
     ↓
Gemini
     ↓
Structured Analysis
```

### Why
This makes the role of AI explicit: Sources provide evidence, AI interprets evidence, and the Backend validates AI output.

---

## 14. Decision: Strict Gemini JSON Output

### Decision
Gemini is instructed to return structured JSON.

### Why
Free-form natural language makes reliable frontend rendering difficult. Structured output allows the application to consistently process verdict, riskLevel, confidence, summary, reasoning, supportingEvidence, contradictingEvidence, unclearEvidence, and limitations.

---

## 15. Decision: Validate Gemini Output

### Decision
The backend validates Gemini output before returning it to the frontend.

### Why
Even when instructed to return JSON, AI output can be malformed, incomplete, incorrectly typed, or missing required fields. 

```text
Gemini Output → Schema/Business Validation → Accepted Result (or Controlled Error)
```

---

## 16. Decision: Validate Evidence References

### Decision
AI-generated evidence references must correspond to evidence retrieved by the backend.

### Why
An AI model could theoretically generate a plausible URL or source name that was never retrieved. TruthLens treats the retrieved evidence set as the allowed evidence universe. Unsupported references are rejected or removed.

---

## 17. Decision: Confidence Validation

### Decision
Confidence is validated before being displayed.

### Why
AI-generated numerical values cannot be trusted blindly. The backend validates type, range, and presence before the frontend displays confidence.

---

## 18. Decision: Backend Owns API Credentials

### Decision
External API keys remain in backend environment variables.

### Why
Putting API keys in the frontend exposes them to users. The architecture strictly follows: `Frontend → Backend → External API`.

---

## 19. Decision: Environment Variables

### Decision
Sensitive configuration (e.g., `MONGO_URI`, `JWT_SECRET`, `NEWS_API_KEY`, `OPENALEX_API_KEY`, `GEMINI_API_KEY`) is managed through environment variables.

### Why
Secrets should not be hardcoded into source code or committed to version control.

---

## 20. Decision: MongoDB for Persistence

### Decision
MongoDB is used as the application database.

### Why
TruthLens deals with flexible investigation data containing claims, evidence arrays, provider metadata, AI analysis, limitations, and timestamps. A document-oriented database fits this evolving structure well.

---

## 21. Decision: Persist Complete Investigation Results

### Decision
Investigation results are stored in MongoDB.

### Why
The application needs to support history and repeated access to previous investigations, keeping the claim, evidence, and analysis connected after the original API request finishes.

---

## 22. Decision: JWT Authentication

### Decision
JWT is used for authentication.

### Why
The frontend and backend communicate through REST APIs. JWT provides a straightforward mechanism for login, protected requests, user identification, and history access.

---

## 23. Decision: User-Specific History

### Decision
Investigation history is associated with authenticated users.

### Why
A user's private investigations should not be visible to another user. History queries must be scoped to the authenticated user.

---

## 24. Decision: Frontend Investigation Experience

### Decision
The frontend is designed as an investigation experience rather than a simple search form.

### Why
Fact-checking involves multiple stages (Search, Evidence Collection, Analysis, Synthesis, Result). Showing this progression improves transparency and makes the AI process easier to understand.

---

## 25. Decision: Dynamic Investigation UI

### Decision
The frontend uses dynamic components and animation for the investigation pipeline (e.g., `InvestigationPanel`, `InvestigationPipeline`, `EvidenceCard`).

### Why
The interface should visually communicate that the platform is actively investigating a claim rather than simply generating a chatbot response.

---

## 26. Decision: Source-Level Evidence Display

### Decision
Evidence is displayed at the source level instead of showing only an AI-generated paragraph.

### Why
A user should be able to understand what the AI used, where it came from, and whether it was supporting or contradicting. This makes the system more explainable.

---

## 27. Decision: Controlled Loading States

### Decision
The frontend represents investigation progress dynamically.

### Why
External APIs and AI inference take time. Showing the actual processing stages creates a clearer user experience and prevents the interface from appearing frozen.

---

## 28. Decision: Backend as Single Integration Boundary

### Decision
The backend acts as the central integration layer between frontend, external APIs, Gemini, and MongoDB.

### Why
This centralizes authentication, API credentials, validation, orchestration, persistence, and error handling, keeping the frontend simpler and safer.

---

## 29. Decision: Health Endpoint

### Decision
A backend health endpoint is implemented (`GET /api/health`).

### Why
It provides a quick way to determine whether the Backend and MongoDB are operational during local development, integration testing, and deployment verification.

---

## 30. Decision: Graceful Error Handling

### Decision
External failures are converted into controlled application responses.

### Why
A production application should not crash simply because one external dependency is unavailable.

---

## 31. Decision: Frontend Does Not Own Business Logic

### Decision
The frontend handles UI, interaction, and state. The backend handles provider integration, AI orchestration, validation, and authorization.

### Why
This separation improves maintainability and security.

---

## 32. Decision: API Contract Between Frontend and Backend

### Decision
Frontend components consume a structured backend response rather than making individual external API calls.

### Why
This prevents the frontend from becoming tightly coupled to external APIs (News, Gov, OpenAlex, Gemini) and relies on a stable application-level contract.

---

## 33. Decision: No Hardcoded Investigation Results

### Decision
The production investigation interface must render actual backend results.

### Why
Hardcoded examples hide integration failures. The final system depends on real API responses, real evidence, and real AI synthesis.

---

## 34. Decision: Testing Strategy

### Decision
TruthLens testing follows multiple levels:
* **Provider Testing:** Verify each external API independently.
* **Backend Testing:** Verify routes, validation, and orchestration.
* **AI Testing:** Verify structured output, malformed handling, and reference validation.
* **Frontend Testing:** Verify UI states, routing, and history.
* **End-to-End Testing:** Validate the complete flow from Signup to Frontend rendering.

---

## 35. Decision: External API Failure Must Be Observable

### Decision
Provider-level status is retained in the application response.

### Why
If one source fails, the user and development team should be able to distinguish "No evidence found" from "Provider unavailable".

---

## 36. Decision: Security Over Convenience

### Decision
Credentials and sensitive backend configuration remain server-side.

### Why
Accidentally exposing MongoDB credentials, JWT secrets, or API keys could compromise the application, especially during public hackathon demonstrations.

---

## 37. Decision: Hackathon Scope

### Decision
The architecture was designed to support multiple evidence providers while keeping the MVP implementable within the hackathon environment.

### Why
The system focuses on core verifiable fact-checking features rather than attempting to build a full universal search engine in a limited time frame.

---

## 38. Final Architectural Decision

The central architectural decision of TruthLens is:

> **DO NOT ASK AI TO BE THE SOURCE.**  
> **ASK SOURCES FOR EVIDENCE, THEN ASK AI TO REASON OVER THAT EVIDENCE, THEN VALIDATE THE AI OUTPUT.**

### Architecture Flow:
```text
                    ┌───────────────┐
                    │   Frontend    │
                    │ React + Vite  │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Node/Express  │
                    │  REST API     │
                    └───────┬───────┘
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
             News       Government   Research
                │           │           │
                └───────────┼───────────┘
                            ▼
                  Evidence Normalization
                            │
                            ▼
                       Deduplication
                            │
                            ▼
                    Relevance Filtering
                            │
                            ▼
                 Supporting / Contradicting
                         / Unclear
                            │
                            ▼
                        Gemini AI
                            │
                            ▼
                    Output Validation
                            │
                            ▼
              Evidence Reference Validation
                            │
                            ▼
                         MongoDB
                            │
                            ▼
                     History / Result
                            │
                            ▼
                       Frontend UI
```

---

## 39. Final Principle

TruthLens is designed around a simple reliability model:

```text
Retrieve → Normalize → Compare → Reason → Validate → Explain
```

The AI is therefore one component of the investigation system, not the entire investigation system. This architecture provides a stronger foundation for explainable, evidence-backed AI claim analysis.