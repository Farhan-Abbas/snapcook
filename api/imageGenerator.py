# /api/chat.py
from flask import Flask, request
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app, origins=['https://mike-tyson-chatbot.vercel.app'])

client = OpenAI()

@app.route('/api/chat', methods=['POST'])
def chat():
    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {
            "role": "user",
            "content": [
                {"type": "text", "text": "What food items are in this image? If there are any food items, then what recipes can be made with them? List the ingredients and the steps to make the recipe."},
                {
                "type": "image_url",
                "image_url": {
                    "url": "https://www.eatingwell.com/thmb/3QenNO2yD-LEvVpbElxQY8OKKwU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-486196614-960x960-9391da4b3ad64126af78be8f86e06378.jpg",
                },
                },
            ],
            }
        ],
        max_tokens=300,
    )

    return response.choices[0]

if __name__ == '__main__':
  app.run(debug=True)