#!/usr/bin/env python

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        message = request.json.get('message')
        print("Received message:", message, flush=True)
        
        # Echo the message back
        return jsonify({"message": message})
    except Exception as e:
        print(f"Error: {e}", flush=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='localhost', port=8090)