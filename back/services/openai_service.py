import openai
import os  # For accessing environment variables

def get_openai_response(user_question):
    try:
        if not user_question:
            return jsonify({"error": "No question provided"}), 400

        # API key
        openai.api_key = os.environ.get("OPENAI_API_KEY")

        if not openai.api_key:
            return jsonify({"error": "OpenAI API key not configured"}), 500

        # Define a default maximum number of tokens for the response
        MAX_RESPONSE_TOKENS = 50

        completion = openai.chat.completions.create(
            model="gpt-4.1-nano",  # Or another available model
            messages=[
                {"role": "user", "content": f"In less than {MAX_RESPONSE_TOKENS} tokens, please respond to the following : {user_question}"}
            ],
            max_tokens=MAX_RESPONSE_TOKENS
        )
        # print("completion", completion)
        bot_response = completion.choices[0].message.content
        return bot_response
    except openai.APIError as e:
        print(f"OpenAI API error: {e}")
        return f"Error from OpenAI: {e}"
    except Exception as e:
        print(f"Error in get_openai_response: {e}")
        return f"An error occurred while getting the AI response: {e}"