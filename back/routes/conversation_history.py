# routes/conversation_history.py
from flask import Blueprint, request, jsonify
from services.conversation_service import save_message, load_conversation_history, list_conversation_files, create_new_conversation_file, delete_conversation_file
from services.openai_service import get_openai_response
from datetime import datetime

# Create a blueprint for conversation history routes
conversation_history_bp = Blueprint('conversation_history', __name__)

@conversation_history_bp.route('/new', methods=['POST'])
def new_conversation():
    # Create new conversation
    data = request.get_json()
    first_message = data.get('message')
    if not first_message:
        return jsonify({"error": "Missing 'message' in request"}), 400

    filename = create_new_conversation_file(first_message)
    if filename:
        return jsonify({"filename": filename}), 201
    else:
        return jsonify({"error": "Failed to create new conversation"}), 500

@conversation_history_bp.route('/<filename>', methods=['POST'])
def save_chat_message(filename: str):
    # Save message
    data = request.get_json()
    user_message = data.get('message')
    if not user_message:
        return jsonify({"error": "Missing 'message' in request"}), 400

    user_message_data = {"sender": "user", "text": user_message, "timestamp": datetime.now().isoformat()}
    if not save_message(filename, user_message_data):
        return jsonify({"error": f"Failed to save user message to {filename}"}), 500

    ai_response = get_openai_response(user_message)
    if ai_response:
        ai_message_data = {"sender": "ai", "text": ai_response, "timestamp": datetime.now().isoformat()}
        if not save_message(filename, ai_message_data):
            return jsonify({"error": f"Failed to save AI response to {filename}"}), 500
        return jsonify({"status": "messages saved"}), 200
    else:
        return jsonify({"error": "Failed to get response from AI"}), 500

@conversation_history_bp.route('/<filename>', methods=['GET'])
def get_conversation(filename: str):
    # Get current conversation
    history = load_conversation_history(filename)
    if history is not None:
        return jsonify(history), 200
    else:
        return jsonify({"error": f"Conversation history not found for {filename}"}), 404

@conversation_history_bp.route('/', methods=['GET'])
def list_conversations():
    # Lists all available conversation files 
    files = list_conversation_files()
    return jsonify(files), 200

@conversation_history_bp.route('/<filename>', methods=['DELETE'])
def delete_conversation(filename: str):
    #  Deletes the specified conversation file
    if delete_conversation_file(filename):
        return jsonify({"message": f"Conversation {filename} deleted successfully"}), 200
    else:
        return jsonify({"error": f"Failed to delete conversation {filename}"}), 404    