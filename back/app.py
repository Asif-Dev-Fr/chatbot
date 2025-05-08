from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os  # For accessing environment variables
from dotenv import load_dotenv
from routes.chat import chat_bp
from utils.config import load_config
from routes.conversation_history import conversation_history_bp # Import the new blueprint

load_dotenv()  # Load environment variables from .env file
config = load_config()
app = Flask(__name__)
CORS(app) # Enable CORS for local development

# app.config['OPENAI_API_KEY'] = config['openai_api_key']

# Register the chat blueprint for handling standard chat requests
app.register_blueprint(chat_bp, url_prefix='/api/chat')

# Register the conversation history blueprint for managing conversation files
app.register_blueprint(conversation_history_bp, url_prefix='/api/conversation-history')

if __name__ == '__main__':
    print("Flask backend is running...")
    app.run(debug=True, port=5000)