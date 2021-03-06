from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from pymongo import MongoClient
from ..classes.user import User
from uuid import uuid4
import time
import bcrypt
import json
import os
import hashlib

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
    uid = str(uuid4()) # Generate UUID
    salt = os.urandom(32) # New salt per user

    response = ""
    if pwd == confirm_pwd:
        hashed_pwd = hashlib.pbkdf2_hmac("sha256", pwd.encode("utf-8"), salt, 100000)
        db.users.insert_one({
            "uid": uid,
            "email": email,
            "username": username,
            "pwd": hashed_pwd,
            "salt": salt
        })

        response = jsonify("New user created")

    return response

# Verifies given user details exist in database
@userbase_api.route("/verify_user", methods=["POST"])
@cross_origin()
def verify_user():
    email = request.json["emailValue"]
    pwd = request.json ["pwdValue"]

    user_query = {
        "email": email
    }

    requested_user = db.users.find(user_query)
    users_found = requested_user.count()

    response = ""
    # No user was found with the given email
    if users_found == 0:
        response = jsonify(empty="invalid email")
        return response
    else:
        # Get salt from db to verify via hashes
        salt = requested_user[0]["salt"]
        valid_pwd_hash = requested_user[0]["pwd"]

        pwd_hashed = hashlib.pbkdf2_hmac('sha256', pwd.encode('utf-8'), salt, 100000)
        if pwd_hashed == valid_pwd_hash:
            uid = requested_user[0]["uid"]
            token = User.gen_token(uid)
            response = jsonify(access_token=token, uid=uid)
    
    return response