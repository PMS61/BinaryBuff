from sqlalchemy import String, Integer, Column, Boolean, ForeignKey
from database import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Users(Base):  # Changed from Peoples to Users to match database table name
    __tablename__ = "users"  # Changed from "peoples"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, index=True)
    password = Column(String, index=True)
    name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    provider = Column(String, nullable=True)  # "email", "google", etc.

