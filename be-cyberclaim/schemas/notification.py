# schemas/notification.py
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class NotificationBase(BaseModel):
    user_id: UUID
    claim_id: Optional[UUID] = None
    type: str
    title: str
    message: str
    is_read: bool = False

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase):
    id: UUID
    created_at: datetime
    read_at: Optional[datetime]
    
    class Config:
        from_attributes = True