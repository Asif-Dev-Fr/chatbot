from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os  # For accessing environment variables
from dotenv import load_dotenv
from routes.chat import chat_bp
from utils.config import load_config, Config
from routes.conversation_history import conversation_history_bp # Import the new blueprint
from routes.authentification import auth_bp  # Import the authentication blueprint
from flask_sqlalchemy import SQLAlchemy

# Load environment variables first, before anything else
load_dotenv()

# Debug - print out the DATABASE_URL to verify it's loaded
database_url = os.environ.get('DATABASE_URL')
if database_url:
    print(f"Database URL loaded")

# Create the Flask app
app = Flask(__name__)

# Configure CORS with specific allowed origins and proper credentials support
CORS(app, 
     origins=["http://localhost:5173"],  # List your allowed origins here
     allow_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     supports_credentials=True)

# Configure the app
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY') or 'votre_clé_secrète_jwt'

# Load other configurations
config = load_config()

# Initialize the database
db = SQLAlchemy(app)

"""
# Add a global after_request handler for CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response
"""

## Routes
# Register the chat blueprint for handling standard chat requests
app.register_blueprint(chat_bp, url_prefix='/api/chat')

# Register the conversation history blueprint for managing conversation files
app.register_blueprint(conversation_history_bp, url_prefix='/api/conversation-history')

# Register the authentication blueprint
#  app.register_blueprint(auth_bp, url_prefix='/api/auth')

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Create database tables
    print("Flask backend is running...")
    app.run(debug=True, port=5000)