# Cyclops AI — Backend Service
> *"See the Threat. Stop the Harm."*

AI-Powered Cyberbullying & Online Threat Detection backend built with Node.js, Express, and Hugging Face text-classification models.

---

## 1. Quick Start

### Installation
```bash
cd server
npm install
```

### Environment Configuration
Copy the template and configure your Hugging Face API token:
```bash
cp .env.example .env
```
Edit `.env` and set:
```ini
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
HF_TOKEN=hf_your_personal_token_here
HF_MODEL=unitary/toxic-bert
HF_PROVIDER=hf-inference
HF_TIMEOUT_MS=20000
```
*(Get a free token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens))*

### Run the Server
```bash
# Production mode
npm start

# Development mode with live reload
npm run dev
```

The server listens by default on `http://localhost:5000`.

---

## 2. API Contract

### Health Check
- **Endpoint:** `GET /api/health`
- **Response:**
```json
{
  "success": true,
  "status": "healthy",
  "service": "Cyclops AI Backend",
  "version": "1.0.0",
  "modelConfiguration": {
    "configured": true,
    "model": "unitary/toxic-bert"
  },
  "timestamp": "2026-11-05T05:40:00.000Z"
}
```

### Analyze Message
- **Endpoint:** `POST /api/analyze`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "message": "You better watch your back tomorrow after school."
}
```
- **Success Response (HTTP 200):**
```json
{
  "success": true,
  "data": {
    "id": "analysis_d4e3f2...",
    "message": "You better watch your back tomorrow after school.",
    "category": "threat",
    "riskScore": 85,
    "riskLevel": "high",
    "isToxic": true,
    "confidence": 0.89,
    "detectedSignals": [
      {
        "name": "Threat-related language",
        "description": "Potential indication of physical harm, violence, or intimidation.",
        "severity": "high"
      }
    ],
    "explanation": "The message contains language that may indicate threatening communication or potential harm.",
    "recommendations": [
      "Preserve the message and capture full screenshots with timestamps.",
      "Avoid engaging or confronting the sender directly.",
      "Reach out to trusted security personnel, school administrators, or workplace HR.",
      "Contact local emergency services immediately if you feel in imminent physical danger."
    ],
    "analyzedAt": "2026-11-05T05:40:00.000Z"
  }
}
```

- **Error Response (HTTP 4xx / 5xx):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_MESSAGE",
    "message": "Please provide a valid message string in the request body."
  }
}
```

---

## 3. Model & Scoring Methodology

### AI Model: `unitary/toxic-bert`
A specialized transformer model trained on multi-label toxic comment classification:
- `toxic` (general hostility)
- `severe_toxic` (extreme aggression)
- `threat` (physical harm/intimidation)
- `insult` (targeted demeaning language)
- `identity_hate` (bias, hate speech)
- `obscene` (profanity)

### Risk Scoring (0–100)
- Scores are calculated deterministically from model label probabilities. Critical harms (threats, severe hostility, identity hate) elevate the risk score directly.
- **Prototype Risk Levels:**
  - `0 – 30`: Low Risk (Safe / Benign)
  - `31 – 60`: Medium Risk (Abrasive / Mild Toxicity)
  - `61 – 100`: High Risk (Severe Harassment / Threat / Hate Speech)

---

## 4. Responsible AI & Limitations
- AI classifications are probabilistic estimations of linguistic patterns, not a replacement for human judgment or professional safety services.
- The classifier does not determine real-world legal intent or context.
- For emergency situations or imminent physical danger, always contact local emergency services immediately.

