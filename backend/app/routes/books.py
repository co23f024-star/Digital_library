from fastapi import APIRouter, Query
from app.services.db import books_collection
from app.models.book import book_serializer
from typing import List

router = APIRouter(
    prefix="/books",
    tags=["Books"]
)


# =====================================================
# GET ALL BOOKS (SEARCH + FILTER)
# =====================================================

@router.get("/", response_model=List[dict])
async def get_books(
    search: str = Query(default="", description="Search by title"),
    department: str = Query(default="", description="Filter by department")
):
    try:
        query = {}

        # 🔎 Search filter (case insensitive)
        if search.strip():
            query["title"] = {
                "$regex": search.strip(),
                "$options": "i"
            }

        # 🎓 Department filter
        if department and department != "All Departments":
            query["department"] = department

        books = []

        async for book in books_collection.find(query).sort("created_at", -1):
            books.append(book_serializer(book))

        return books

    except Exception as e:
        print("Error fetching books:", str(e))
        return []