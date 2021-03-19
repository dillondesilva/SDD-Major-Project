from flask import request, url_for, jsonify, send_from_directory
from pymongo import MongoClient
from flask_api import FlaskAPI, status, exceptions
from argparse import ArgumentParser

from core.api.userbase import userbase_api
from core.api.wordlist import wordlist_api

# /static/css/a.css -> static/css/a.css
# /static/css/a.css -> static/static/css/a.css
app = FlaskAPI(__name__, static_url_path="/client", static_folder="client")
app.register_blueprint(userbase_api, url_prefix="/api/userbase")
app.register_blueprint(wordlist_api, url_prefix="/api/wordlist")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def init(path):
    return app.send_static_file('index.html')

@app.route("/test", methods=['GET', 'POST'])
def hello_world():
    response = jsonify(message="hello,world")
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")