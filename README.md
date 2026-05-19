# AI Research Paper Summarizer Agent

An AI-powered web application that allows users to upload research paper PDFs or paste ArXiv links, and automatically generates AI-powered summaries, ELI5 explanations, methodology extraction, and more. It also supports saving these insights to a Notion database.

## 🚀 Features

- **Upload PDF**: Direct upload of research papers.
- **Paste ArXiv Link**: Fetch papers automatically from ArXiv.
- **AI Summary**: Get structured summaries using Anthropic's Claude.
- **ELI5 Explanation**: "Explain Like I'm 5" simplified breakdowns.
- **Methodology & Results**: Extract key insights (Problem, Methodology, Results, Limitations).
- **Save to Notion**: Automatically sync summaries to your Notion workspace.
- **3D Animated UI**: Modern, glassmorphism-based UI with interactive 3D elements using React Three Fiber.

## 🛠️ Technology Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Framer Motion
- React Three Fiber / Three.js
- Lucide React

**Backend:**
- Flask (Python)
- LangChain
- Claude API (Anthropic)
- PyPDF2
- ArXiv API
- Notion API

## 📂 Project Structure

```
ai-research-agent/
│
├── frontend/          # React + Vite Application
│   ├── src/           # Components, Pages, 3D Canvas
│   └── package.json
│
├── backend/           # Flask Application
│   ├── app.py         # Main server
│   ├── requirements.txt
│   └── venv/          # Python virtual environment
│
├── README.md
└── IMPLEMENTATION_PLAN.md
```

## ⚙️ Setup Instructions

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### 3. Environment Variables
Create a `.env` file in the `backend/` directory:
```
ANTHROPIC_API_KEY=your_claude_api_key
NOTION_TOKEN=your_notion_api_token
NOTION_DATABASE_ID=your_notion_database_id
```
# AI-Research-Paper-Summarizer-Agent
