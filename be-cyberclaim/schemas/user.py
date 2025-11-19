from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid

class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    pass

class RoleResponse(RoleBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    facility_id: Optional[uuid.UUID] = None
    role_id: uuid.UUID

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    facility_id: Optional[uuid.UUID] = None
    role_id: Optional[uuid.UUID] = None

class UserResponse(UserBase):
    id: uuid.UUID
    is_active: bool
    last_login: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    role: RoleResponse
    facility_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    username: Optional[str] = None
    user_id: Optional[uuid.UUID] = None
    role: Optional[str] = None
    facility_id: Optional[uuid.UUID] = None