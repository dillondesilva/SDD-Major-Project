from flask import Blueprint, jsonify
from pymongo import MongoClient

userbase_api = Blueprint('userbase_api', __name__)

db = MongoClient("mongodb://localhost:27017/?retryWrites=true&w=majority")

# Test API to MongoDB
@userbase_api.route("/create_user", methods=["POST"])
def accountList():
    db.userbase.users.insert_one({
        "name": "test"
    })
    response = jsonify("user added")
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response