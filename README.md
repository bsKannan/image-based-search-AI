# Image-Based Search AI# Image-Based Search AI



An AI-powered image search application with a Node.js/Express backend and a React/Vite frontend. This project uses ChromaDB for vector embeddings and OpenAI for image analysis.An AI-powered image search application with a Node.js/Express backend and a React/Vite frontend. This project uses ChromaDB for vector embeddings and OpenAI for image analysis.



## 📋 Project Structure## 📋 Project Structure



``````

image-based-search-AI/image-based-search-AI/

├── backend/                           # Node.js Express server (modular architecture)├── backend/                    # Node.js Express server

│   ├── server.js                      # Main entry point│   ├── server.js

│   ├── package.json│   ├── package.json

│   ├── .env                           # Environment variables│   ├── uploads/               # Uploaded images

│   ├── .gitignore│   ├── assets/

│   ├── data/│   ├── src/

│   │   └── products.js               # Sample product data│   ├── package.json

│   ├── services/│   └── .gitignore

│   │   ├── openaiService.js          # OpenAI API calls (embeddings, vision)├── package.json               # Root package.json for running both services

│   │   └── chromaService.js          # ChromaDB initialization & queries└── README.md

│   ├── routes/```

│   │   └── search.js                 # API endpoints

│   ├── uploads/                      # Uploaded images directory## 🚀 Quick Start

│   └── assets/

├── image-search-frontend/             # React + Vite + TypeScript frontend### Prerequisites

│   ├── src/

│   ├── package.json- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)

│   ├── vite.config.ts- **npm** (comes with Node.js)

│   └── .gitignore- **.env file** in the backend directory with API keys (see Backend Setup)

├── package.json                       # Root package.json for running both services

└── README.md# Install all dependencies

```npm run install-all



## 🚀 Quick Start# Start both backend and frontend with one command

- ✅ Start the **backend** on `http://localhost:3000` (or your configured port)

### Prerequisites- ✅ Start the **frontend** on `http://localhost:5173` (Vite default)

- ✅ Both services run concurrently in the same terminal

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)

- **npm** (comes with Node.js)#### Run Backend Only

- **.env file** in the backend directory with API keys (see Backend Setup)```bash

```

### Option 1: Run Both Backend & Frontend (Recommended)Backend will be available at `http://localhost:3000`



From the root directory:#### Run Frontend Only

npm install

```bashnpm run dev

# Install all dependencies```

npm run install-allFrontend will be available at `http://localhost:5173`



# Start both backend and frontend with one command## 🔧 Backend Setup

npm run dev

```### Installation



This will:```bash

- ✅ Start the **backend** on `http://localhost:3000` (or your configured port)cd backend

- ✅ Start the **frontend** on `http://localhost:5173` (Vite default)npm install

- ✅ Both services run concurrently in the same terminal```



### Option 2: Run Services Separately

Create a `.env` file in the `backend/` directory:

#### Run Backend Only

```bash```env

cd backendPORT=3000

npm installOPENAI_API_KEY=your_openai_key_here

npm run devCHROMA_API_URL=http://localhost:8000

``````

Backend will be available at `http://localhost:3000````bash

npm run dev

#### Run Frontend Only```

```bash

cd image-search-frontend### API Endpoints

npm install

npm run dev- `GET /` - Health check

```- `POST /upload` - Upload image for search

Frontend will be available at `http://localhost:5173`- `GET /search?query=...` - Search similar images

- `GET /images` - List all indexed images

---

---

## 🔧 Backend Setup

## 🎨 Frontend Setup

### Installation

### Installation

```bash

cd backend```bash

npm installcd image-search-frontend

```npm install

```

### Environment Variables

### Available Scripts

Create a `.env` file in the `backend/` directory with your configuration:

- `npm run dev` - Start development server (Vite)

```env- `npm run build` - Build for production

PORT=3000- `npm run preview` - Preview production build

OPENAI_API_KEY=sk-proj-your-key-here- `npm run lint` - Run ESLint

UPLOAD_DIR=uploads

CROMADB_API_URL=http://localhost:8000### Run Frontend

ASSETS_DIR=assets

``````bash

npm run dev

### Run Backend```



```bashFrontend will open at `http://localhost:5173`

npm run dev

```---



---## 📦 Dependencies



## 🏗️ Backend Architecture### Backend

- **Express** ^5.1.0 - Web framework

The backend is organized into **modular, reusable components** for better maintainability and testability:- **ChromaDB** ^3.1.2 - Vector database

- **OpenAI** ^6.7.0 - AI embeddings and analysis

### 📁 **`server.js`** — Main Entry Point- **Multer** ^2.0.2 - File upload handling

- Initializes Express app- **CORS** ^2.8.5 - Cross-origin requests

- Loads middleware (CORS, JSON parsing)- **dotenv** ^17.2.3 - Environment variables

- Registers routes

- Starts ChromaDB and server### Frontend

- **React** ^19.1.1 - UI library

### 📁 **`services/`** — Business Logic- **Vite** ^7.1.7 - Build tool

- **TypeScript** ~5.9.3 - Type safety

**`openaiService.js`** — OpenAI API Integration- **Tailwind CSS** ^4.1.16 - Styling

- `createEmbedding(text)` — Generate embeddings for text input- **Axios** ^1.13.1 - HTTP client

- `analyzeImage(imagePath, prompt)` — Use GPT-4 Vision to analyze and describe images

---

**`chromaService.js`** — ChromaDB Vector Database

- `initializeChromaDB()` — Initialize ChromaDB collection with product embeddings## 🎯 All Available Commands

- `getCollection()` — Get the initialized collection instance

- `querySimilarProducts(embedding, topN)` — Query similar products by vector similarity### From Root Directory



### 📁 **`routes/`** — API Endpoints| Command | Description |

|---------|-------------|

**`search.js`**| `npm run dev` | Run backend + frontend concurrently |

- `POST /api/search` — Upload image and search for similar products| `npm run backend` | Run backend only |

- `GET /api/health` — Health check endpoint| `npm run frontend` | Run frontend only |

| `npm run install-all` | Install dependencies for all services |

### 📁 **`data/`** — Data Layer

### Backend Directory

**`products.js`**

- Sample automotive product data (SKU, name, description, image)| Command | Description |

- Can be easily replaced with database queries|---------|-------------|

| `npm run dev` | Start Express server |

### How It Works| `npm test` | Run tests (not configured) |



1. **User uploads image** → `POST /api/search`### Frontend Directory

2. **Vision analysis** → OpenAI describes the image content

3. **Create embedding** → Convert description + query to vector| Command | Description |

4. **Query ChromaDB** → Find similar products in vector space|---------|-------------|

5. **Return results** → Best match + top similar products with similarity scores| `npm run dev` | Start Vite dev server |

| `npm run build` | Create production build |

### API Endpoints| `npm run preview` | Preview production build |

| `npm run lint` | Run ESLint |

| Method | Endpoint | Description |

|--------|----------|-------------|---

| `GET` | `/` | Root endpoint with API info |

| `GET` | `/api/health` | Health check |## 📝 Usage Example

| `POST` | `/api/search` | Upload image and search for similar products |

1. **Start the application:**

**POST /api/search**   ```bash

- **Request:**    npm run dev

  ```json   ```

  {

    "sku": "SKU1001",2. **Upload an image** via the frontend UI at `http://localhost:5173`

    "query": "ceramic brakes (optional)",

    "image": "<file>"3. **Search for similar images** using AI-powered embeddings

  }

  ```4. **View results** in the frontend interface

- **Response:** 

  ```json---

  {

    "uploadedSKU": "SKU1001",## 🔍 Troubleshooting

    "imageDescription": "Ceramic brake pad for vehicles...",

    "isMatch": true,### Port Already in Use

    "similarity": "0.95",If port 3000 (backend) or 5173 (frontend) is already in use:

    "bestMatch": { "sku": "SKU1001", "name": "Brake Pad", ... },

    "topResults": [...]```bash

  }cd backend

  ```PORT=3001 npm run dev

```

---

**Frontend:**

## 🎨 Frontend Setup```bash

cd image-search-frontend

### Installationnpm run dev -- --port 5174

```

```bash

cd image-search-frontend### Module Not Found

npm installIf you get module errors, reinstall dependencies:

``````bash

npm run install-all

### Available Scripts```



- `npm run dev` - Start development server (Vite)### CORS Issues

- `npm run build` - Build for productionEnsure the frontend URL matches the CORS configuration in `backend/server.js`

- `npm run preview` - Preview production build

- `npm run lint` - Run ESLint---



### Run Frontend## 📚 Additional Resources



```bash- [Vite Documentation](https://vitejs.dev/)

npm run dev- [Express Documentation](https://expressjs.com/)

```- [ChromaDB Documentation](https://docs.trychroma.com/)

- [OpenAI API Documentation](https://platform.openai.com/docs/)

Frontend will open at `http://localhost:5173`- [React Documentation](https://react.dev/)



------



## 📦 Dependencies## 📄 License



### BackendISC

- **Express** ^5.1.0 - Web framework

- **ChromaDB** ^3.1.2 - Vector database## 👤 Author

- **OpenAI** ^6.7.0 - AI embeddings and vision analysis

- **Multer** ^2.0.2 - File upload handlingBSK

- **CORS** ^2.8.5 - Cross-origin requests

- **dotenv** ^17.2.3 - Environment variables---



### Frontend**Last Updated:** November 2025
- **React** ^19.1.1 - UI library
- **Vite** ^7.1.7 - Build tool
- **TypeScript** ~5.9.3 - Type safety
- **Tailwind CSS** ^4.1.16 - Styling
- **Axios** ^1.13.1 - HTTP client

---

## 🎯 All Available Commands

### From Root Directory

| Command | Description |
|---------|-------------|
| `npm run dev` | Run backend + frontend concurrently ⭐ |
| `npm run backend` | Run backend only |
| `npm run frontend` | Run frontend only |
| `npm run install-all` | Install dependencies for all services |

### Backend Directory

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Express server |
| `npm test` | Run tests (not configured) |

### Frontend Directory

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🏗️ Architecture Benefits

✅ **Separation of Concerns** — Each module has a single responsibility  
✅ **Reusable Services** — OpenAI/ChromaDB logic can be used anywhere  
✅ **Easy to Test** — Mock services independently  
✅ **Easy to Extend** — Add new routes and services without touching `server.js`  
✅ **Maintainable** — Code is well-organized and easy to navigate  

### How to Extend

**Add a new API endpoint:**
```javascript
// routes/products.js
import express from "express";
export const router = express.Router();

router.get("/products/:sku", (req, res) => {
  // Your logic here
});
```

Then import in `server.js`:
```javascript
import productsRoutes from "./routes/products.js";
app.use("/api", productsRoutes);
```

**Add a new service:**
```javascript
// services/myService.js
export async function myFunction() {
  // Your logic here
}
```

Then import where needed:
```javascript
import { myFunction } from "../services/myService.js";
```

---

## 📝 Usage Example

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Upload an image** via the frontend UI at `http://localhost:5173`

3. **Search for similar images** using AI-powered embeddings

4. **View results** showing best matches and similarity scores

---

## 🔍 Troubleshooting

### Port Already in Use
If port 3000 (backend) or 5173 (frontend) is already in use:

**Backend:**
```bash
cd backend
PORT=3001 npm run dev
```

**Frontend:**
```bash
cd image-search-frontend
npm run dev -- --port 5174
```

### Module Not Found
If you get module errors, reinstall dependencies:
```bash
npm run install-all
```

### CORS Issues
Ensure the frontend URL matches the CORS configuration in `backend/server.js`

### OpenAI API Key Error
Make sure your `.env` file has a valid `OPENAI_API_KEY`. Get one from [OpenAI API](https://platform.openai.com/)

---

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [Express Documentation](https://expressjs.com/)
- [ChromaDB Documentation](https://docs.trychroma.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [React Documentation](https://react.dev/)

---

## 📄 License

ISC

## 👤 Author

BSK

---

**Last Updated:** November 15, 2025
