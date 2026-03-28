from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URL = "mongodb+srv://nagolkarrahul88_db_user:Rahul12345@cluster0.wxuit4u.mongodb.net/?appName=Cluster0"

client = AsyncIOMotorClient(MONGO_URL)
db = client["digital_library"]

books_collection = db["books"]