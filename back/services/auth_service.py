from models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from utils.config import Config
from flask import current_app


def register_user(email, password, session):
    # Check if user already exists
    if session.query(User).filter_by(email=email).first():
        return {'message': 'User with that email already exists'}, 409
    
    # Hash the password and create a new user
    hashed_password = generate_password_hash(password)
    new_user = User(email=email, password_hash=hashed_password)
    
    try:
        # Add the user to the database
        session.add(new_user)
        session.commit()
        
        # Generate JWT token for the new user
        token = create_jwt_token(new_user.id)
        
        # Return success message with token
        return {
            'message': 'User created successfully',
            'token': token,
            'user': {
                'id': new_user.id,
                'email': new_user.email
            }
        }, 201
    
    except Exception as e:
        # Log the error
        print(f"Error creating user: {str(e)}")
        session.rollback()
        return {'message': 'An error occurred while creating the user'}, 500

def login_user(email, password, session):
    # Find the user with the given email
    user = session.query(User).filter_by(email=email).first()
    
    # Check if user exists and password is correct
    if not user or not check_password_hash(user.password_hash, password):
        return {'message': 'Invalid email or password'}, 401
    
    # Generate JWT token
    token = create_jwt_token(user.id)
    
    # Return success message with token
    return {
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email
        }
    }, 200

def create_jwt_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=1)  # Token expires after 1 hour
    }
    token = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')
    return token

def decode_jwt_token(token):
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
        return payload['user_id'], None
    except jwt.ExpiredSignatureError:
        return None, 'Token has expired'
    except jwt.InvalidTokenError:
        return None, 'Invalid token'