from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from pymongo import MongoClient
from ..classes.user import User
import json

# Specifying this file as an API subsection blueprint
userbase_api = Blueprint('userbase_api', __name__)

db = MongoClient("mongodb://localhost:27017/?retryWrites=true&w=majority")["DEV"]

# Creates a new user instance in MongoDB
@userbase_api.route("/create_user", methods=["POST"])
@cross_origin()
def create_user():
    email = request.json["emailValue"]
    username = request.json["usernameValue"]
    pwd = request.json ["pwdValue"]
    confirm_pwd = request.json["pwdConfirmValue"]

    response = ""
    if pwd == confirm_pwd:
        hashed_pwd = hash(pwd)
        db.users.insert_one({
            "email": email,
            "username": username,
            "pwd": hashed_pwd
        })

        response = jsonify("New user created")

    return response

# Verifies given user details exist in database
@userbase_api.route("/create_user", methods=["POST"])
@cross_origin()
def create_user():
    email = request.json["emailValue"]
    username = request.json["usernameValue"]
    pwd = request.json ["pwdValue"]
    confirm_pwd = request.json["pwdConfirmValue"]

    response = ""
    if pwd == confirm_pwd:
        hashed_pwd = hash(pwd)
        db.users.insert_one({
            "email": email,
            "username": username,
            "pwd": hashed_pwd
        })

        response = jsonify("New user created")

    return response