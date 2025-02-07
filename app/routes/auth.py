from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from datetime import timedelta
from app.models.user import User
from app import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({
                'success': False,
                'message': '请提供用户名和密码'
            }), 400

        user = User.query.filter_by(username=username).first()
        
        if not user or not user.verify_password(password):
            return jsonify({
                'success': False,
                'message': '用户名或密码错误'
            }), 401

        access_token = create_access_token(
            identity=user.id,
            additional_claims={
                'username': user.username,
                'role': user.role
            },
            expires_delta=timedelta(hours=24)
        )

        return jsonify({
            'success': True,
            'token': access_token,
            'user': user.to_dict()
        })

    except Exception as e:
        print('登录错误:', str(e))
        return jsonify({
            'success': False,
            'message': '服务器错误'
        }), 500 

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        if not username or not password or not email:
            return jsonify({
                'success': False,
                'message': '请提供所有必需的信息'
            }), 400

        if User.query.filter_by(username=username).first():
            return jsonify({
                'success': False,
                'message': '用户名已存在'
            }), 400

        if User.query.filter_by(email=email).first():
            return jsonify({
                'success': False,
                'message': '邮箱已被注册'
            }), 400

        new_user = User(
            username=username,
            password=password,
            email=email
        )
        
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': '注册成功',
            'user': new_user.to_dict()
        })

    except Exception as e:
        db.session.rollback()
        print('注册错误:', str(e))
        return jsonify({
            'success': False,
            'message': '服务器错误'
        }), 500