<<<<<<< HEAD
# 🛍️ NexusShop — Tailwind CSS Version

Same full-stack app, now styled with **Tailwind CSS**. Clean, minimal, realistic design inspired by modern retail stores.

## Setup

### Backend (same as before)
```bash
cd backend
npm install
cp .env.example .env   # fill in your MONGODB_URI + JWT_SECRET
node seed.js           # seed products + admin user
npm run dev            # runs on :5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # runs on :5173
```

## Tailwind setup included
- `tailwind.config.js` — custom colors, fonts, animations
- `postcss.config.js` — required for Tailwind to process
- `src/index.css` — Tailwind directives + custom component classes

## Login
| Role  | Email          | Password |
|-------|----------------|----------|
| Admin | admin@shop.com | admin123 |
| User  | Register any   | 4+ chars |
=======
# 🛒 NexusShop

NexusShop is a robust, responsive full-stack e-commerce web application designed to provide a seamless shopping experience. Built from the ground up using modern web technologies, it features a dynamic frontend interface, a scalable backend architecture, and an integrated AI shopping assistant.

## ✨ Features

*   **User & Admin Authentication:** Secure login and registration system with role-based access control using JWT.
*   **Dynamic Product Catalog:** Responsive grid layouts for browsing products with interactive product cards.
*   **Intelligent AI Assistant:** Built-in AI chat interface to guide users, answer questions, and recommend products.
*   **Interactive Cart Management:** Sleek, slide-out cart sidebar that updates in real-time.
*   **Order Tracking:** Dedicated "My Orders" section for users to view purchase history and fulfillment status.
*   **Admin Dashboard:** Protected management portal for administrators to oversee inventory, add/edit products, and monitor incoming orders.
*   **Modern UI/UX:** Styled entirely with Tailwind CSS, featuring custom themes, responsive modals, and toast notifications.

## 💻 Tech Stack

**Frontend:**
*   React.js (Functional Components & Hooks)
*   Vite (Build Tool)
*   Tailwind CSS & PostCSS (Styling)
*   Context API (State Management)

**Backend:**
*   Node.js & Express.js
*   MongoDB & Mongoose (Database & ORM)
*   JSON Web Tokens (Authentication)

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
*   Node.js installed on your machine
*   MongoDB database (local or MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/nexusshop.git](https://github.com/your-username/nexusshop.git)
cd nexusshop
>>>>>>> 4afed53b4f54d198633d8e8a8f75e2868803aa45
