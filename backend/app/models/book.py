def book_serializer(book) -> dict:
    return {
        "_id": str(book["_id"]),  # VERY IMPORTANT
        "title": book.get("title"),
        "author": book.get("author"),
        "department": book.get("department"),
        "cover_url": book.get("cover_url"),
        "pdf_url": book.get("pdf_url"),
        "created_at": book.get("created_at"),
        "updated_at": book.get("updated_at")
    }