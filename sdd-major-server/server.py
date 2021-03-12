from flask import request, url_for, jsonify
from pymongo import MongoClient
from flask_api import FlaskAPI, status, exceptions
from argparse import ArgumentParser

from core.api.userbase import userbase_api
from core.api.wordlist import wordlist_api

app = FlaskAPI(__name__)
app.register_blueprint(userbase_api, url_prefix="/api/userbase")
app.register_blueprint(wordlist_api, url_prefix="/api/wordlist")

# def main():
#     client = MongoClient("mongodb://localhost:27017/users?retryWrites=true&w=majority")
#     db = client.users

#     serverStatusResult = db.command("serverStatus")
#     print(serverStatusResult)
#     app.run(debug=True)


@app.route("/")
def init():
    client = MongoClient("mongodb://localhost:27017/users?retryWrites=true&w=majority")
    db = client.users
    serverStatus = db.command("serverStatus") 
    return "Current server status: \n" + str(serverStatus)

@app.route("/test", methods=['GET', 'POST'])
def hello_world():
    response = jsonify(message="hello,world")
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == "__main__":
    app.run(debug=True)