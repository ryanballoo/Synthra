# app/models.py
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    company_name = Column(String)
    country = Column(String)
    brand_colors = Column(String)
    tone = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GeneratedContent(Base):
    __tablename__ = "generated_content"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    content_type = Column(String)
    prompt = Column(Text)
    generated_output = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())