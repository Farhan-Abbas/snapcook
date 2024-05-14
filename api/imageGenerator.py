from flask import Flask, request
from flask_cors import CORS
from openai import OpenAI
import os
import requests

app = Flask(__name__)
CORS(app, origins=['http://127.0.0.1:5500'])
client = OpenAI()

# Use an environment variable for the API key
api_key = os.getenv("OPENAI_API_KEY")

@app.route('/api/foodItemsAndRecipesFinder', methods=['POST'])
def foodItemsAndRecipesFinder():
    responseReturn = []
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

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    responseReturn.append(response.json()['choices'][0]['message']['content'])

    response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": f"List up to 5 good recipes that are possible to make using the given food items. Be concise. Here are the food items available: {responseReturn[0]}"
            }
        ]
        }
    ],
    temperature=1,
    max_tokens=256,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0
    )

    responseReturn.append(response.choices[0].message.content)

    print(responseReturn)
    return {'data': responseReturn}

if __name__ == '__main__':
    app.run(debug=True)


