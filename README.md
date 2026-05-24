<div align="center">

![Header](https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=200&section=header&text=Zova%20AI&fontSize=80&fontAlignY=35&desc=AI-Powered%20Chatbot%20SaaS%20Platform&descAlignY=55&descSize=20&fontColor=ffffff&animation=twinkling)

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=Build+AI+Chatbots+in+Minutes;Train+on+Your+Documents;Embed+Anywhere+on+the+Web;Powered+by+Llama+3.3+%26+Groq+AI" alt="Typing SVG" />

<br/>

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3-F55036?style=for-the-badge&logo=groq&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_DB-FF6B6B?style=for-the-badge)

<br/>

[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/zova-ai?style=social)](https://github.com/YOUR_USERNAME/zova-ai)
[![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/zova-ai?style=social)](https://github.com/YOUR_USERNAME/zova-ai)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Author](#-author)

---

## 🚀 Overview

**Zova AI** is a full-stack AI SaaS platform that allows businesses to create
custom AI chatbots trained on their own documents. Upload PDFs, train your
chatbot instantly, and embed it on any website with a single line of code.

> Built with **Next.js 14**, **FastAPI**, **Groq (Llama 3.3)**, **ChromaDB**,
> and **Supabase** — completely free APIs, no paid services required.

---

## 🎯 Live Demo

> 🔗 Coming Soon

---

## ✨ Features

<table>
<tr>
<td>

### 🤖 AI Chatbot
- RAG-powered responses
- Trained on your documents
- Markdown formatted answers
- Context-aware conversations

</td>
<td>

### 📄 Document Management
- PDF upload & processing
- Automatic text chunking
- Vector embeddings storage
- Multiple documents per bot

</td>
</tr>
<tr>
<td>

### 💬 Chat Experience
- Persistent chat history
- Sessions sidebar like ChatGPT
- Copy / Edit / Retry messages
- Typing indicators

</td>
<td>

### 🎨 Customization
- Custom bot name & color
- Custom personality instructions
- Embeddable widget
- Live preview

</td>
</tr>
<tr>
<td>

### 🔐 Authentication
- Supabase Auth
- Email & password
- Protected routes
- User dashboard

</td>
<td>

### 📊 Dashboard
- Analytics overview
- Chatbot management
- Document list & delete
- Session management

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 | React Framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Markdown | Markdown Rendering |
| Supabase JS | Auth & Database Client |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API Framework |
| Groq + Llama 3.3 | LLM (Free) |
| ChromaDB | Vector Database |
| Sentence Transformers | Embeddings (Free) |
| PDFPlumber | PDF Processing |
| Supabase Python | Database |

---

## 📁 Project Structure

```
zova-ai/
│
├── frontend/                        
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/               # Login page
│   │   │   └── signup/              # Signup page
│   │   ├── dashboard/
│   │   │   ├── layout.tsx           # Dashboard layout + sidebar
│   │   │   ├── page.tsx             # Chatbots grid
│   │   │   ├── analytics/           # Analytics page
│   │   │   └── chatbots/
│   │   │       ├── create/          # Create chatbot
│   │   │       └── [id]/            # Chatbot settings
│   │   ├── chat/[botId]/            # Public chat page
│   │   └── page.tsx                 # Landing page
│   ├── components/ui/               # Reusable components
│   └── lib/                         # API & Supabase clients
│
└── backend/                         
    ├── routes/
    │   ├── chatbot.py               # Chatbot CRUD
    │   ├── chat.py                  # Chat + sessions
    │   └── upload.py                # PDF upload
    ├── services/
    │   ├── gemini_service.py        # Groq LLM service
    │   ├── rag_service.py           # RAG pipeline
    │   └── pdf_service.py           # PDF processing
    ├── db/
    │   └── supabase_client.py       # Database client
    └── main.py                      # FastAPI entry point
```

---

## ⚡ Getting Started

### Prerequisites
```bash
node >= 18.0.0
python >= 3.10
git
```

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/zova-ai.git
cd zova-ai
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Environment Variables
Create `.env` in `backend/` and `.env.local` in `frontend/`
(See [Environment Variables](#-environment-variables) section)

### 5. Run the Application

**Backend:**
```bash
cd backend
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Open in browser
```
http://localhost:3000
```

---

## 🔑 Environment Variables

### `backend/.env`
```env
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

### `frontend/.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Free API Keys:
| Service | Link |
|---|---|
| Groq API | https://console.groq.com |
| Supabase | https://supabase.com |

---

## 📡 API Endpoints

### Chatbot Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chatbot/create` | Create new chatbot |
| GET | `/api/chatbot/user/{user_id}` | Get all chatbots |
| GET | `/api/chatbot/{id}` | Get single chatbot |
| PUT | `/api/chatbot/{id}` | Update chatbot |
| DELETE | `/api/chatbot/{id}` | Delete chatbot |

### Chat Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat/message` | Send message |
| GET | `/api/chat/sessions/{chatbot_id}` | Get all sessions |
| GET | `/api/chat/history/{session_id}` | Get session messages |
| DELETE | `/api/chat/sessions/{session_id}` | Delete session |

### Upload Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload/{chatbot_id}` | Upload PDF |
| GET | `/api/upload/{chatbot_id}` | Get documents |
| DELETE | `/api/upload/{id}/delete` | Delete document |

---

## 📸 Screenshots

> Screenshots will be added after deployment

---

## 🗺️ Roadmap

- [x] Core chatbot functionality
- [x] PDF upload and RAG system
- [x] Persistent chat history
- [x] Dashboard with analytics
- [ ] Dark/Light mode toggle
- [ ] Multiple file upload
- [ ] Website URL as knowledge base
- [ ] Export chat history as PDF
- [ ] Voice input for chat
- [ ] Chatbot response rating

---

## 👨‍💻 Author

<div align="center">

### Farhan Naeem

**Full Stack Developer & AI Engineer**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/farhannaeem00)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/farhan-naeem-297bb1373)

</div>

---

![Footer](https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=120&section=footer&animation=twinkling)
