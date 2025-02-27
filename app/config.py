import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'  # 这里是数据库配置
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')  # JWT 密钥
