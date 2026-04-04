# Insight Design & Construction | Ultra-Premium Architecture CMS

An extreme high-contrast, architectural management platform and portfolio built with **Next.js 15**, **Firebase**, and **Tailwind CSS**. This project features a custom-built theme engine and a robust administrative dashboard for real-time site control.

## 🏗️ Architectural Core Features

- **Extreme High-Contrast UI**: A zero-gray, monochromatic design system following strict architectural geometry.
- **Dynamic Theme Lab**: Real-time control of site colors, fonts (Montserrat), and spacing via Firestore.
- **Before/After Transformation Viewer**: Interactive sliding comparison tool for project renovations.
- **Elite Media Management**: Centralized high-performance image uploader supporting Direct Upload, URL Ingestion, and Clipboard Paste (Ctrl+V).
- **Meta Pixel Integration**: Built-in marketing sector for automated Facebook tracking injection.
- **Dynamic Navbar Logo**: Real-time logo scaling (20px to 200px) controlled from the dashboard.

## 🛠️ Technological Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database**: [Firebase Firestore](https://firebase.google.com/products/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/products/auth) (Google OAuth with Admin strict whitelist)
- **Media Engine**: [Cloudinary](https://cloudinary.com/) (Optimization & Storage)
- **Styling**: Tailwind CSS & Framer Motion for architectural micro-interactions.

## 🚀 Execution Guide

### Prerequisites

Create a `.env.local` file with the following environment variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Deployment

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🔐 Administrative Security

Dashboard access is restricted to authorized Gmail accounts defined in `AuthStatus.tsx`. Current admins:
- `montasrrm@gmail.com`
- `bayansads2000@gmail.com`

---
*Crafted for architectural precision and extreme performance.*
