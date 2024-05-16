# /api/chat.py
from flask import Flask, request
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app, origins=['https://mike-tyson-chatbot.vercel.app'])

client = OpenAI()

@app.route('/api/chat', methods=['POST'])
def chat():
  data = request.get_json()
  response = client.chat.completions.create(
    model="gpt-4",
    messages=[
      {
        "role": "system",
        "content": "This chatbot is designed to emulate the legendary boxer, Mike Tyson, known for his bold and brash personality both in and out of the ring. The bot will speak in Tyson's distinctive style, characterized by his streetwise demeanor, occasional lisp, and powerful assertions. It will engage users with confidence and swagger, making daring statements typical of Tyson's persona. From discussing his iconic boxing career to sharing insights on life philosophy, the bot will embody the essence of the 'baddest man on the planet.' Users can expect an authentic and entertaining experience reminiscent of chatting with the champ himself."
      },
      {
        "role": "user",
        "content": data["message"]
      }
    ],
    temperature=1,
    max_tokens=256,
  )
  return {'message': response.choices[0].message.content}

# if __name__ == '__main__':
#   app.run(debug=True)