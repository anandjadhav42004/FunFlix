<div align="center">

# 🎬 FunFlix

### A Netflix-inspired streaming experience, built with React & TMDB

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TMDB](https://img.shields.io/badge/TMDB-API-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org)

</div>

---

## ✨ Overview

**FunFlix** is a fully functional, Netflix-style streaming UI clone. It pulls real movie and TV show data from **TMDB**, complete with a cinematic intro animation, hero banner, genre rows, trailer playback, and a personal watchlist — all wrapped in a sleek, responsive dark UI.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🎞️ **Cinematic Intro** | Netflix-style "ta-dum" opening animation with synthesized sound, plays once per session |
| 🏠 **Dynamic Home** | Hero banner + horizontally scrollable rows (Trending, Top Rated, Action, Comedy, Horror, Romance, Documentaries, Originals) |
| 🔍 **Live Search** | Real-time search across TMDB's catalog |
| 📋 **Detail Modal** | Synopsis, rating, runtime, genres & embedded YouTube trailers |
| ❤️ **My List** | Add/remove favorites — persisted locally |
| 📱 **Responsive Design** | Optimized for desktop, tablet & mobile |
| ⚡ **Loading & Error States** | Smooth spinners and graceful API failure handling |
| 🧭 **Custom 404 Page** | Styled "Lost Your Way?" fallback for unmatched routes |

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Routing:** React Router
- **HTTP Client:** Axios
- **Data Source:** [TMDB API](https://www.themoviedb.org/documentation/api)
- **Icons:** Lucide React
- **Styling:** Custom CSS (Netflix-inspired design system)

---

## 📦 Getting Started

### Prerequisites

- Node.js v16 or higher
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/funflix.git
cd funflix
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file in the project root:

```env
REACT_APP_TMDB_KEY=your_tmdb_api_key_here
```

> ⚠️ **Never commit your `.env` file** — it's already excluded via `.gitignore`.

### 4️⃣ Run the development server

```bash
npm run dev
```

Visit **http://localhost:5173** 🎉

### 5️⃣ Build for production

```bash
npm run build
```

---

## 📁 Project Structure

```
funflix/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx / Navbar.css
│   │   ├── Banner.jsx / Banner.css
│   │   ├── Row.jsx / Row.css
│   │   ├── MovieCard.jsx / MovieCard.css
│   │   ├── DetailModal.jsx / DetailModal.css
│   │   ├── Intro.jsx / Intro.css
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Search.jsx / Search.css
│   │   ├── MyList.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   └── tmdb.js
│   ├── index.css
│   └── App.jsx
├── .env.example
├── vite.config.js
└── README.md
```

---

## 🌐 Deployment

Deploy in minutes using **Vercel** or **Netlify**:

1. Push your code to GitHub
2. Import the repository into Vercel/Netlify
3. Add the environment variable `REACT_APP_TMDB_KEY` in your project settings
4. Click **Deploy** 🚀

---

## 🙏 Acknowledgements

This product uses the **TMDB API** but is not endorsed or certified by TMDB.

---

## 📄 License

This project is created for **educational and portfolio purposes** only. Not affiliated with Netflix.

---

<div align="center">

Made with ❤️ and ☕ by **Anand & Sakshi**

</div>
