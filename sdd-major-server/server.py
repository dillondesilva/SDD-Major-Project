# Import flask dependencies
import os
from flask import request, url_for, jsonify, send_from_directory
from pymongo import MongoClient
from flask_api import FlaskAPI, status, exceptions
from argparse import ArgumentParser

# Importing API Blueprints from other files
from core.api.userbase import userbase_api
from core.api.wordlist import wordlist_api
from core.api.translate import translate_api

# Instantiate a new flask server and register API blueprints
# from other files
app = FlaskAPI(__name__, static_url_path="/client", static_folder="client")
app.register_blueprint(userbase_api, url_prefix="/api/userbase")
app.register_blueprint(wordlist_api, url_prefix="/api/wordlist")
app.register_blueprint(translate_api, url_prefix="/api/translate")

# Serving the app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def init(path):
    return app.send_static_file('index.html')

# Testing mode and run server
if __name__ == "__main__":
    port = os.getenv("PORT") or "5000"
    app.run(debug=True, host=f"0.0.0.0", port=port)