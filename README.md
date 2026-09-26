# AI-Powered Document Summarizer

A full-stack web application that allows users to input text or upload documents (PDF, DOCX, TXT) to generate AI summaries powered by the Google Gemini API, with persistent history storage in MongoDB.

---

## Live Links

* **Live Web Application (Vercel):** https://doc-summarizer-ai-tau.vercel.app/
* **Backend API Service (Render):** https://docsummarizer-backend.onrender.com
* **GitHub Repository:** https://github.com/sheebudevina7/DocSummarizer_AI

---

## Features

1. **Text & File Summarization:** Supports plain text pasting as well as `.pdf`, `.docx`, and `.txt` document uploads.
2. **Google Gemini AI Integration:** Uses `gemini-3.8-flash` for high-speed, intelligent text processing.
3. **Persistent History:** Automatically stores all generated summaries in MongoDB Atlas for later review.
4. **Responsive UI:** Modern React interface built with Vite and Tailwind CSS.
5. **Robust Error Handling:** Built-in safeguards for API quota limits (429/503 capacity errors) and document parsing edge cases.

---

## Tech Stack

1. **Frontend:** React, Vite, Axios, Tailwind CSS (Hosted on Vercel)
2. **Backend:** Node.js, Express.js, Multer, `pdf-parse` (Hosted on Render)
3. **Database:** MongoDB Atlas (Mongoose ODM)
4. **AI Model:** Google Gemini API (`@google/genai`)

---

## Project Workflow

1. **Input Submission:** The user enters raw text or uploads a document via the React UI.
2. **Backend Processing:**
   * Text payloads are processed directly by Express controllers.
   * Document uploads are handled by Multer; text buffers or raw binary data are prepared for AI ingestion.
3. **AI Generation:** Express sends the payload to Google Gemini API, which generates a structured summary.
4. **Database Persistence:** The original input title, summary output, and timestamp are saved to MongoDB Atlas.
5. **UI Rendering:** The frontend receives the response, displays the summary card, and updates the history feed dynamically.

---

## Local Setup Instructions

### 1. Prerequisites
* Node.js (v18 or higher)
* MongoDB Atlas connection URI
* Google Gemini API Key

### 2. Clone Repository
```bash
git clone [https://github.com/sheebudevina7/DocSummarizer_AI](https://github.com/sheebudevina7/DocSummarizer_AI)
cd DocSummarizer_AI