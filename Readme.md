# My website

Welcome all!




## Neko Pet Counter Server

This is a simple Node.js and Express API designed to serve a globally shared counter for tracking clicks on an element (e.g., a "pet me" image) on a website.

**⚠️ IMPORTANT NOTE:** This initial version uses an **in-memory variable** (`globalPetCounter`). This means the count will **reset every time the server restarts**. For a production environment, you **must** integrate a proper database (like PostgreSQL, MongoDB, or Redis) to ensure the count is persistent.

---

## 🚀 Quick Start (Local Setup)

Follow these steps to get the server running on your local machine.

### 1. Prerequisites

You must have **Node.js** and **npm** (Node Package Manager) installed on your system.

To check if they are installed, open your terminal and run:

```bash
node -v
npm -v
```

---

### 2. Setup

Initialize npm: This creates the package.json file.

```bash
npm init -y
```

Install Dependencies: Install the necessary packages: Express for the server framework and CORS to allow your website (on a different domain) to make requests.

```bash
npm install express cors
```

---

### 3. Start the Server

Run the server from your terminal:

```bash
node server.js
```

You should see the message: Server running on http://localhost:3000

The API is now running locally!

---