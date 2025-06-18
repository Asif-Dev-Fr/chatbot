from flask import Blueprint, request, jsonify, make_response
from services.auth_service import register_user, login_user

auth_bp = Blueprint('auth', __name__)

# Helper function to handle CORS preflight requests
def handle_preflight():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@auth_bp.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    # Handle preflight request
    if request.method == 'OPTIONS':
        return handle_preflight()
    
    # Get the JSON data
    data = request.get_json()
    print("Received data:", data)  # Debug print
    
    # Check if email and password are provided
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        response = jsonify({'message': 'Email and password are required'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 400
    
    from app import db
    # Call the register_user function and get the result
    result, status_code = register_user(email, password, db.session)
    
    # Return the result with CORS headers
    response = jsonify(result)
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response, status_code

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    # Handle preflight request
    if request.method == 'OPTIONS':
        return handle_preflight()
    
    # Get the JSON data
    data = request.get_json()
    print("Received login data:", data)  # Debug print
    
    # Check if email and password are provided
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        response = jsonify({'message': 'Email and password are required'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 400
    
    # Call the login_user function and get the result
    # Implement the login_user function in your auth_service.py file
    from app import db
    result, status_code = login_user(email, password, db.session)
    
    # Return the result with CORS headers
    response = jsonify(result)
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response, status_code