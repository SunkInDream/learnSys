from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

# 初始化扩展
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__,
                static_folder='../frontpages/build/static',  # React 静态文件夹
                template_folder='../frontpages/build')       # React index.html

    # 加载配置
    app.config.from_object('app.config.Config')  # 配置从 Config 文件加载

    # 初始化扩展
    db.init_app(app)  # 初始化数据库
    jwt.init_app(app)  # 初始化 JWT
    CORS(app, resources={r"/api/*": {"origins": "*"}})  # 配置 CORS，允许所有来源访问 API

    # 注册蓝图
    from app.routes import bp  # 引入 routes.py 中定义的蓝图
    app.register_blueprint(bp, url_prefix='/api/routes')  # 注册蓝图并设置前缀

    # 创建数据库表
    with app.app_context():
        db.create_all()  # 确保数据库表创建

    # 静态文件和 React 前端的 index.html
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)  # 返回静态文件
        return send_from_directory(app.template_folder, 'index.html')  # 返回 React 前端的 index.html

    return app
