"""
Authentication API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import uuid
from jose import JWTError, jwt

from app.core.config import settings
from app.core.database import get_db, cache
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, Token, UserResponse
from app.services.email import send_verification_email

router = APIRouter()
security = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

def get_current_user(user_id: str = Depends(verify_token), db: Session = Depends(get_db)):
    """Get current authenticated user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    return user

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    # Create new user
    user = User(
        id=str(uuid.uuid4()),
        email=user_data.email,
        username=user_data.username,
        hashed_password=User.get_password_hash(user_data.password),
        first_name=user_data.first_name,
        last_name=user_data.last_name
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Send verification email (async)
    # await send_verification_email(user.email, user.id)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    # Create initial wallets for the user
    from app.models.wallet import Wallet, WalletType
    
    # Create USD wallet
    usd_wallet = Wallet(
        id=str(uuid.uuid4()),
        user_id=user.id,
        currency="USD",
        wallet_type=WalletType.FIAT
    )
    db.add(usd_wallet)
    
    # Create BTC wallet
    btc_wallet = Wallet(
        id=str(uuid.uuid4()),
        user_id=user.id,
        currency="BTC",
        wallet_type=WalletType.CRYPTO,
        address=f"0x{uuid.uuid4().hex}"  # Mock address
    )
    db.add(btc_wallet)
    
    db.commit()
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    }

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    # Find user by email or username
    user = db.query(User).filter(
        (User.email == user_data.email_or_username) | 
        (User.username == user_data.email_or_username)
    ).first()
    
    if not user or not user.verify_password(user_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    # Cache user session
    cache.set(f"user_session:{user.id}", access_token, expire=3600)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "kyc_status": user.kyc_status.value
        }
    }

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout user"""
    # Clear user session from cache
    cache.delete(f"user_session:{current_user.id}")
    
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "avatar": current_user.avatar,
        "kyc_status": current_user.kyc_status.value,
        "email_verified": current_user.email_verified is not None,
        "created_at": current_user.created_at
    }

@router.post("/refresh")
async def refresh_token(current_user: User = Depends(get_current_user)):
    """Refresh access token"""
    access_token = create_access_token(data={"sub": current_user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/verify-email/{token}")
async def verify_email(token: str, db: Session = Depends(get_db)):
    """Verify user email"""
    # Decode verification token
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification token"
            )
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user.email_verified = datetime.utcnow()
        db.commit()
        
        return {"message": "Email verified successfully"}
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )

@router.post("/request-password-reset")
async def request_password_reset(email: str, db: Session = Depends(get_db)):
    """Request password reset"""
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Don't reveal if user exists
        return {"message": "If the email exists, a reset link has been sent"}
    
    # Create reset token
    reset_token = create_access_token(
        data={"user_id": user.id, "type": "password_reset"},
        expires_delta=timedelta(hours=1)
    )
    
    # Send reset email (would be implemented)
    # await send_password_reset_email(user.email, reset_token)
    
    return {"message": "If the email exists, a reset link has been sent"}

@router.post("/reset-password")
async def reset_password(token: str, new_password: str, db: Session = Depends(get_db)):
    """Reset user password"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("user_id")
        token_type = payload.get("type")
        
        if not user_id or token_type != "password_reset":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset token"
            )
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user.hashed_password = User.get_password_hash(new_password)
        db.commit()
        
        return {"message": "Password reset successfully"}
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
