from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,Session
from fastapi import Depends
from sqlalchemy.ext.declarative import declarative_base
from typing import Annotated
import models
import os
from dotenv import load_dotenv
load_dotenv()
url_database=os.getenv("DATABASE_URL")
engine=create_engine(url_database)
sessionlocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base=declarative_base()

def db_connect():
    db=sessionlocal()
    try:
        yield db
    finally:
        db.close()

db_dependancy=Annotated[Session,Depends(db_connect)]
