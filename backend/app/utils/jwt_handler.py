from jose import jwt
from datetime import datetime, timedelta
import os

SECRET = os.getenv("JWT_SECRET")

if not SECRET:
    raise RuntimeError("JWT_SECRET not found in environment variables")

ALGORITHM = "HS256"

def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=5)
    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)