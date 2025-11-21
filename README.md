#  TinyLink — URL Shortener (React + Node + Express)

TinyLink is a lightweight and fully functional URL shortening application.

Features:

- Shorten long URLs
- Custom short codes (`[A-Za-z0-9]{6–8}`)
- Track clicks & timestamps
- Redirect handler (`GET /:code`)
- REST API (Create / List / Get / Delete)
- Fully responsive React frontend
- JSON-based persistent storage (lowdb)
- Production-ready structure
<!-- - Ready for deployment on Render + Vercel -->

---

##  Tech Stack

### **Backend**
- Node.js
- Express
- LowDB (JSON database)
- NanoID

### **Frontend**
- React
- React Router
- Fetch API
- Accessible + responsive UI

---

#  Getting Started (Local Setup)

## 1️ Clone the Repository
```bash
cd TinyLink
```

---

## 2️ Backend Setup
```bash
cd backend
npm install
cp  .env
```

Default `.env`:
```
PORT=5000
BASE_URL=http://localhost:5000
DATA_FILE=./data/db.json
```

Start the backend:
```bash
npm run dev
```

Backend runs at:  
 **http://localhost:5000**

---

## 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
```

Default `.env`:
```
REACT_APP_API_BASE=http://localhost:5000/api
REACT_APP_BASE_URL=http://localhost:5000
```

Start the frontend:
```bash
npm start
```

Frontend runs at:  
 **http://localhost:3000**

---

#  API Endpoints

### **Health Check**
```
GET /healthz
```

### **Create Short Link**
```
POST /api/links
{
  "target": "https://example.com",
  "code": "custom12" (optional)
}
```

### **List All Links**
```
GET /api/links
```

### **Get Link Details**
```
GET /api/links/:code
```

### **Delete Link**
```
DELETE /api/links/:code
```

### **Redirect**
```
GET /:code → 302 Redirect
```

---

<!-- #  Deployment Guide

## 🟦 Backend Deployment — Render (Recommended)

1. Go to https://render.com
2. Click **New → Web Service**
3. Choose your GitHub repo
4. Configure:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
5. Add environment variables:
```
PORT=10000
BASE_URL=https://your-backend.onrender.com
DATA_FILE=./data/db.json
```

Click **Deploy**.

Backend URL example:
```
https://tinylink-backend.onrender.com
```

---

## 🟩 Frontend Deployment — Vercel (Recommended)

1. Go to https://vercel.com
2. Import your GitHub repo
3. Select **frontend** folder as project root
4. Add environment variables:

```
REACT_APP_API_BASE=https://tinylink-backend.onrender.com/api
REACT_APP_BASE_URL=https://tinylink-backend.onrender.com
```

5. Build command: automatic (`npm run build`)
6. Output folder: `build/`

After deployment, Vercel gives a URL like:
```
https://tinylink-frontend.vercel.app
``` -->

---

#  Production Build (Backend serving frontend)

You may choose to let the backend serve the compiled React build.

### Build frontend:
```bash
cd frontend
npm run build
```

Copy build folder into backend root:
```
TinyLink/
│
├── backend/
│   ├── index.js
│   
```

Backend automatically serves it using:
```js
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));
```

Now the entire app runs at:
```
http://localhost:5000
```

---

# 🧹 .gitignore

### Root `.gitignore`
```
node_modules
.env
dist
build
data/*.json
```

### Backend `.gitignore`
```
node_modules
.env
data/db.json
```

### Frontend `.gitignore`
```
node_modules
.env
build
```

---

# 🛠 Future Improvements
- PostgreSQL / Prisma support  
- Authentication (admin dashboard)  
- Analytics graphs  
- Rate limiting  
- QR code generator  

---

#  Contribute
Pull requests are welcome!

---

#  License
MIT License © 2025
