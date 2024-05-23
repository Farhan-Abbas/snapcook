from flask import Flask, request
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app, origins=['https://snapcook-bice.vercel.app'])
client = OpenAI()

@app.route('/api/recipesGenerator', methods=['POST'])
def recipesGenerator():
    foodItems = request.json.get('data')

    response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": f"Please list up to 5 creative and simple recipes that can be made with the available food items: {foodItems}. Start your message directly with the recipe name, followed by a concise set of instructions formatted with numbered bullet points. Provide as many recipes as possible up to 5. If no recipes can be formulated, please explain why. The response should begin with the recipe name without any introductory messages."
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

    return {'data': betterFormatofRecipeResponse}

# if __name__ == '__main__':
#     app.run(debug=True)