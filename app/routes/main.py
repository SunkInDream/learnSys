from flask import Blueprint, jsonify, send_from_directory
import os

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return jsonify({
        'message': '欢迎使用学习助手API',
        'status': 'running',
        'endpoints': {
            'auth': {
                'login': '/api/auth/login',
                'register': '/api/auth/register'
            },
            'feedback': '/api/feedback'
        }
    })

@main_bp.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'version': '1.0.0'
    })

@main_bp.route('/favicon.ico')
def favicon():
    return send_from_directory(
        os.path.join(main_bp.root_path, '..', 'static'),
        'favicon.ico',
        mimetype='image/vnd.microsoft.icon'
    ) 