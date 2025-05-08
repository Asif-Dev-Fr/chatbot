from flask import Blueprint, request, jsonify, current_app
from services.openai_service import get_openai_response

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/', methods=['POST'])
def receive_message():
    try:
        data = request.get_json()
        message = data.get('message')
        if message:
            print(f"Received message from frontend: {message}")
            result = get_openai_response(message)
            if result:
                return jsonify({"response": result }), 200
            else:
                return jsonify({"error": "No response received"}), 400    
        else:
            return jsonify({"error": "No message received"}), 400
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "Failed to process the request"}), 500

        