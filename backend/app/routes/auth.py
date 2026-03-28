from fastapi import APIRouter, HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests
from dotenv import load_dotenv
from app.utils.jwt_handler import create_token
import os

load_dotenv()

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

if not GOOGLE_CLIENT_ID:
    raise RuntimeError("GOOGLE_CLIENT_ID is not set in .env file")

ADMIN_EMAIL = "nagolkarrahul88@gmail.com"


@router.post("/google-login")
async def google_login(data: dict):
    id_token_value = data.get("idToken")

    if not id_token_value:
        raise HTTPException(status_code=400, detail="Missing Google ID token")

    try:
        idinfo = id_token.verify_oauth2_token(
            id_token_value,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo.get("email")
        name = idinfo.get("name")

        if not email or not name:
            raise HTTPException(
                status_code=400,
                detail="Invalid Google token payload"
            )

        # Normalize email
        email = email.strip().lower()

        # Admin check
        if email == ADMIN_EMAIL.lower():
            role = "admin"

        # YBIT domain check
        elif email.endswith("@ybit.ac.in"):
            role = "user"

        else:
            raise HTTPException(
                status_code=403,
                detail="Only YBIT emails allowed"
            )

        jwt_token = create_token({
            "email": email,
            "name": name,
            "role": role
        })

        return {
            "token": jwt_token,
            "name": name,
            "email": email,
            "role": role
        }

    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired Google token"
        )

    except Exception as e:
        print("Auth Error:", str(e))
        raise HTTPException(
            status_code=500,
            detail="Authentication failed"
        )