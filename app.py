from flask import Flask, request, jsonify, Response
import openai
import os

app = Flask(__name__)

openai.api_key = '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'

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message', '')

    def generate_response():
        try:
            response = openai.Completion.create(
                engine="davinci-codex",  # Use "text-davinci-003" for standard GPT-3 models
                prompt=user_input,
                max_tokens=50,
                stream=True
            )
            for message in response:
                if 'choices' in message:
                    for choice in message['choices']:
                        if 'text' in choice:
                            yield f"data: {choice['text']}\n\n"
        except Exception as e:
            yield f"data: Error: {str(e)}\n\n"

    return Response(generate_response(), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
