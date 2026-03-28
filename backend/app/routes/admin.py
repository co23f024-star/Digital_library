from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.db import books_collection
from bson import ObjectId
from datetime import datetime
import os
import shutil
import uuid

router = APIRouter(prefix="/admin", tags=["Admin"])

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# =====================================================
# HELPER FUNCTIONS
# =====================================================

def save_file(file: UploadFile) -> str:
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return unique_filename


def delete_file(file_url: str):
    if not file_url:
        return

    file_path = os.path.join("app", file_url.lstrip("/"))

    if os.path.exists(file_path):
        os.remove(file_path)


# =====================================================
# UPLOAD BOOK
# =====================================================

@router.post("/upload")
async def upload_book(
    title: str = Form(...),
    author: str = Form(...),
    department: str = Form(...),
    cover: UploadFile = File(...),
    pdf: UploadFile = File(...)
):

    if not title or not author:
        raise HTTPException(status_code=400, detail="Title and Author required")

    cover_filename = save_file(cover)
    pdf_filename = save_file(pdf)

    book_data = {
        "title": title,
        "author": author,
        "department": department,
        "cover_url": f"/uploads/{cover_filename}",
        "pdf_url": f"/uploads/{pdf_filename}",
        "created_at": datetime.utcnow()
    }

    await books_collection.insert_one(book_data)

    return {"message": "Book uploaded successfully"}


# =====================================================
# DELETE BOOK
# =====================================================

@router.delete("/delete/{book_id}")
async def delete_book(book_id: str):

    if not ObjectId.is_valid(book_id):
        raise HTTPException(status_code=400, detail="Invalid Book ID")

    book = await books_collection.find_one({"_id": ObjectId(book_id)})

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    delete_file(book.get("cover_url"))
    delete_file(book.get("pdf_url"))

    await books_collection.delete_one({"_id": ObjectId(book_id)})

    return {"message": "Book deleted successfully"}


# =====================================================
# UPDATE BOOK
# =====================================================

@router.put("/update/{book_id}")
async def update_book(
    book_id: str,
    title: str = Form(...),
    author: str = Form(...),
    department: str = Form(...),
    cover: UploadFile = File(None),
    pdf: UploadFile = File(None)
):

    if not ObjectId.is_valid(book_id):
        raise HTTPException(status_code=400, detail="Invalid Book ID")

    book = await books_collection.find_one({"_id": ObjectId(book_id)})

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    update_data = {
        "title": title,
        "author": author,
        "department": department,
        "updated_at": datetime.utcnow()
    }

    # If new cover uploaded
    if cover:
        delete_file(book.get("cover_url"))
        cover_filename = save_file(cover)
        update_data["cover_url"] = f"/uploads/{cover_filename}"

    # If new PDF uploaded
    if pdf:
        delete_file(book.get("pdf_url"))
        pdf_filename = save_file(pdf)
        update_data["pdf_url"] = f"/uploads/{pdf_filename}"

    await books_collection.update_one(
        {"_id": ObjectId(book_id)},
        {"$set": update_data}
    )

    return {"message": "Book updated successfully"}