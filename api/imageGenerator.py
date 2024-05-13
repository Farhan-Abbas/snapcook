from flask import Flask, request
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app, origins=['https://mike-tyson-chatbot.vercel.app'])

# Use an environment variable for the API key
api_key = os.getenv("OPENAI_API_KEY")

@app.route('/api/foodItemsFinder', methods=['POST'])
def foodItemsFinder():
    # Ensure you get the base64 image from the request data
    base64_image = request.json.get('image_base64')

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "model": "gpt-4-turbo",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "What’s in this image?"
                    },
                    {
                        "type": "image",
                        "data": base64_image
                    }
                ]
            }
        ],
        "max_tokens": 300
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    return response.json()

if __name__ == '__main__':
    app.run(debug=True)