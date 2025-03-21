from sqlalchemy import String,Integer,Column,Boolean,ForeignKey
from database import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid
class Peoples(Base):
    __tablename__="peoples"

    id=Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    email=Column(String,index=True)
    password=Column(String,index=True)

