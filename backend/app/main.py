from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Import Routers
from app.routes import auth, admin, books


# =====================================================
# CREATE APP
# =====================================================

app = FastAPI(
    title="YBIT Digital Library API",
    description="Backend API for Digital Library System",
    version="1.0.0"
)


# =====================================================
# CORS CONFIGURATION
# =====================================================

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://amazing-churros-9d1905.netlify.app/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# STATIC FILES (UPLOADS)
# =====================================================

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory=UPLOAD_DIR),
    name="uploads"
)


# =====================================================
# ROUTES
# =====================================================

# 🔐 Auth routes -> /auth/google-login
app.include_router(auth.router, prefix="/auth", tags=["Auth"])

# 📚 Admin routes -> /admin/upload, /admin/update
app.include_router(admin.router)

# 📖 Books routes -> /books/
app.include_router(books.router)


# =====================================================
# ROOT ROUTE
# =====================================================

@app.get("/")
async def root():
    return {
        "message": "🚀 YBIT Digital Library Backend Running",
        "status": "success"
    }


# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/health")
async def health_check():
    return {"status": "healthy"}