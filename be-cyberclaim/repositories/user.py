from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime
import uuid
from app.models.user import User, Role
from app.schemas.user import UserCreate, UserUpdate
from app.utils.security import get_password_hash

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user(db: Session, user_id: uuid.UUID):
    return db.query(User).filter(User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        password=hashed_password,
        facility_id=user.facility_id,
        role_id=user.role_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: uuid.UUID, user_update: UserUpdate):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    
    update_data = user_update.dict(exclude_unset=True)
    if 'password' in update_data:
        update_data['password'] = get_password_hash(update_data['password'])
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_last_login(db: Session, user_id: uuid.UUID):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db_user.last_login = datetime.utcnow()
        db.commit()
        db.refresh(db_user)
    return db_user

def get_roles(db: Session):
    return db.query(Role).all()

def get_role(db: Session, role_id: uuid.UUID):
    return db.query(Role).filter(Role.id == role_id).first()

def create_role(db: Session, role_data):
    db_role = Role(**role_data.dict())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role