from flask import Flask, request
from flask_cors import CORS
from openai import OpenAI
import os
import requests

app = Flask(__name__)
CORS(app, origins=['https://snapcook-bice.vercel.app'])
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

    foodItemsResponse = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    responseReturn.append(foodItemsResponse.json()['choices'][0]['message']['content'])

    response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": f"Please list up to 5 creative and simple recipes that can be made with the available food items: {responseReturn[0]}. Start your message directly with the recipe name, followed by a concise set of instructions formatted with numbered bullet points. Provide as many recipes as possible up to 5. If no recipes can be formulated, please explain why. The response should begin with the recipe name without any introductory messages."
            }
        ]
        }
    ],
    temperature=1,
    max_tokens=256*3,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0
    )

    betterFormatofRecipeResponse = response.choices[0].message.content.split("\n")

    responseReturn.append(betterFormatofRecipeResponse)

    return {'data': responseReturn}

if __name__ == '__main__':
    app.run(debug=True)


