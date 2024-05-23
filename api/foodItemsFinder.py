from flask import Flask, request
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app, origins=['https://snapcook-bice.vercel.app'])

# Use an environment variable for the API key
api_key = os.getenv("OPENAI_API_KEY")

@app.route('/api/foodItemsFinder', methods=['POST'])
def foodItemsFinder():
    base64_image = request.json.get('data')
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "What food-related items are in this image? List all of them in the form of a list."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 300
    }

    foodItemsResponse = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    return {'data': foodItemsResponse.json()['choices'][0]['message']['content']}

# if __name__ == '__main__':
#     app.run(debug=True)