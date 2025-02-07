# 这个文件可以为空，但必须存在 

from .auth import auth_bp
from .main import main_bp

__all__ = ['auth_bp', 'main_bp'] 