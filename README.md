# MicroMaster: 8085 & 8086 Microprocessor Tutor

MicroMaster is a comprehensive, interactive web application designed to help students, hobbyists, and engineers master the Intel 8085 and 8086 microprocessor architectures. 

Whether you are learning about basic instruction sets, memory management, or complex assembly language programming, MicroMaster provides the tools and guidance you need.

## 🚀 Features

- **AI Micro Tutor:** An intelligent, context-aware AI assistant powered by NVIDIA's Nemotron-3 120B reasoning model (via OpenRouter). It can explain complex architectural concepts, debug assembly code, and answer specific questions about 8085/8086 microprocessors.
- **Deep Reasoning:** The AI Tutor utilizes advanced reasoning capabilities to think step-by-step through complex microprocessor problems before answering.
- **Modern UI/UX:** A clean, responsive interface built with React and Tailwind CSS, featuring full Dark Mode support.
- **Interactive Learning:** Ask questions and get immediate, educational, and professional responses tailored to microprocessor studies.

## 🛠️ Tech Stack

- **Frontend:** React 19, Tailwind CSS v4, Framer Motion, Lucide Icons
- **Backend:** Express.js (adapted for Vercel Serverless Functions)
- **AI Integration:** OpenRouter API (`nvidia/nemotron-3-super-120b-a12b:free`)
- **Deployment:** Vercel

## ⚙️ Local Development

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Live Application

Check out the live deployed application here:
**[https://microprocessor-eight.vercel.app](https://microprocessor-eight.vercel.app)**
