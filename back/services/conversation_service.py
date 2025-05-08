import os
import json
import openai
from datetime import datetime
from flask import current_app
import re

HISTORY_FOLDER = 'historique'

def generate_conversation_title(prompt: str) -> str:
    # Generates a title for the conversation using OpenAI

    # Define a default maximum number of tokens for the response
    MAX_RESPONSE_TOKENS = 100

    # API key
    openai.api_key = os.environ.get("OPENAI_API_KEY")
    try:
        response = openai.chat.completions.create(
            model="gpt-4.1-nano",
            messages=[
                {"role": "user", "content": f"Please generate a very short title (max {MAX_RESPONSE_TOKENS} tokens) for the following conversation starter: '{prompt}'"}
            ],
            max_tokens=MAX_RESPONSE_TOKENS
        )
        #print("response", response)

        ai_title = response.choices[0].message.content.strip().replace(' ', '_')
        pattern = r'[?!:;.,\'"]'
        remove_special_character = re.sub(pattern, '', ai_title).strip()
        title = f"{remove_special_character[0:20]}....json" if len(remove_special_character) > 20 else f"{remove_special_character}.json"
        return title
    except Exception as e:
        print(f"Error generating title: {e}")
        return f"conversation_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

def save_message(filename: str, message: dict):
    # Saves a message to the specified JSON file
    filepath = os.path.join(HISTORY_FOLDER, filename)
    try:
        with open(filepath, 'a+') as f:
            f.seek(0)
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = []
            data.append(message)
            f.seek(0)
            f.truncate()
            json.dump(data, f, indent=4)
        return True
    except Exception as e:
        print(f"Error saving message to {filename}: {e}")
        return False

def create_new_conversation_file(first_message: str) -> str:
    # Creates a new conversation file and saves the first message
    # title = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    # title = generate_conversation_title(first_message)

    pattern = r'[?!:;.,\'"]'
    remove_special_character = re.sub(pattern, '', first_message).strip()
    title = f"{remove_special_character[0:20].strip().replace(" ", "_")}....json" if len(remove_special_character) > 20 else f"{remove_special_character.strip().replace(" ", "_")}.json"
    filepath = os.path.join(HISTORY_FOLDER, title)
    try:
        with open(filepath, 'w') as f:
            json.dump([{"sender": "user", "text": first_message, "timestamp": datetime.now().isoformat()}], f, indent=4)
        return title
    except Exception as e:
        print(f"Error creating new conversation file: {e}")
        return None

def load_conversation_history(filename: str) -> list | None:
    # Loads the conversation history from the specified JSON file
    filepath = os.path.join(HISTORY_FOLDER, filename)
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
            return data
    except FileNotFoundError:
        print(f"File not found: {filepath}")
        return None
    except Exception as e:
        print(f"Error loading conversation history from {filepath}: {e}")
        return None        

def list_conversation_files() -> list:
    # Lists all conversation files in the history folder with their creation dates
    files = []
    try:
        for filename in os.listdir(HISTORY_FOLDER):
            if filename.endswith(".json"):
                filepath = os.path.join(HISTORY_FOLDER, filename)
                creation_time = os.path.getctime(filepath)
                files.append({"filename": filename, "created_at": datetime.fromtimestamp(creation_time).isoformat()})
        # Sort files by creation date, newest first
        files.sort(key=lambda x: datetime.fromisoformat(x['created_at']), reverse=True)
    except FileNotFoundError:
        print(f"History folder not found: {HISTORY_FOLDER}")
    except Exception as e:
        print(f"Error listing conversation files: {e}")
    return files


def delete_conversation_file(filename: str) -> bool:
    # Deletes the specified conversation file
    filepath = os.path.join(HISTORY_FOLDER, filename)
    try:
        os.remove(filepath)
        return True
    except FileNotFoundError:
        print(f"File not found for deletion: {filepath}")
        return False
    except Exception as e:
        print(f"Error deleting file {filepath}: {e}")
        return False    