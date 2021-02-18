from flask import request, url_for
from pymongo import MongoClient
from flask_api import FlaskAPI, status, exceptions
from argparse import ArgumentParser

app = FlaskAPI(__name__)

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
    return db.command("serverStatus")

app.run(debug=True)
if __name__ == "__main__":
    app.run(debug=True)