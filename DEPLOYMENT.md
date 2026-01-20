# Student Feedback App - Deployment Guide

This guide describes how to deploy your **Full Stack Application** for free using **Render (Backend)** and **Netlify (Frontend)**.

---

## ✅ Deployment Checklist

### Part 1: Deploy Backend (Render)
- [ ] Create a GitHub repository and push your code.
- [ ] Sign up/Login to [Render.com](https://render.com).
- [ ] Click **"New +"** -> **"Web Service"**.
- [ ] Connect your repository.
- [ ] **Configure Service**:
  - **Name**: `student-feedback-backend` (or similar)
  - **Root Directory**: `backend`  <-- IMPORTANT
  - **Environment**: `Node`
  - **Build Command**: `npm install`
  - **Start Command**: `node server.js`
- [ ] **Environment Variables** (Advanced):
  - Add `MONGO_URI` -> Paste your MongoDB connection string.
  - Add `NODE_ENV` -> `production`.
- [ ] Click **"Create Web Service"**.
- [ ] **Copy URL**: Once deployed, copy the URL (e.g., `https://student-feedback-backend.onrender.com`).

### Part 2: Connect Frontend to Backend
- [ ] Open `script.js` in your project.
- [ ] Find the line `const PRODUCTION_API_URL = ...`.
- [ ] Replace `https://YOUR_BACKEND_URL_HERE/api/feedback` with your copied Render URL + `/api/feedback`.
  - Example: `const PRODUCTION_API_URL = 'https://student-feedback-backend.onrender.com/api/feedback';`
- [ ] Commit and push this change to GitHub.

### Part 3: Deploy Frontend (Netlify)
- [ ] Login to [Netlify.com](https://netlify.com).
- [ ] Click **"Add new site"** -> **"Import from existing project"** -> **"GitHub"**.
- [ ] Select your repository.
- [ ] **Configure Build**:
  - **Base directory**: (Leave empty or `/`)
  - **Publish directory**: (Leave empty or `/`) — *Netlify naturally serves index.html*
- [ ] Click **"Deploy"**.
- [ ] Your site is now live! 🚀

---

## ⚠️ Common Deployment Issues

1.  **"Backend deployment failed"**:
    *   Did you set the **Root Directory** to `backend`? Render needs to know where `package.json` is.
    *   Did you add the `MONGO_URI` environment variable in Render dashboard?

2.  **"Frontend cannot connect to Backend"** (Network Error):
    *   Did you update `PRODUCTION_API_URL` in `script.js`?
    *   Double-check that you did not accidentally delete `/api/feedback` from the end of the URL.

3.  **"CORS Error" in Browser Console**:
    *   Your backend is already configured with `cors()`, so this usually means the backend crashed or the URL is wrong. Check Render logs.
