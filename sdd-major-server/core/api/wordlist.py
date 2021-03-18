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
wordlist_api = Blueprint('wordlist_api', __name__)

db = MongoClient("mongodb://localhost:27017/?retryWrites=true&w=majority")["DEV"]

# Creates a new wordlist instance in Mongo
@wordlist_api.route("/create_wordlist", methods=["POST"])
@cross_origin()
def create_wordlist():
    wordlist_name = request.json["wordlistName"]
    wordlist_des = request.json["wordlistDescription"]
    wordlist_code = request.json["wordlistCode"]
    uid = request.json["uid"]

    wordlist_data = {
        "wordlist_name": wordlist_name,
        "wordlist_des": wordlist_des,
        "words": {}
    }

    user_query = {
        "uid": uid
    }

    requested_user = db.wordlists.find(user_query)

    if requested_user.count() == 0:
        db.wordlists.insert_one({
            "uid": uid,
            "wordlists": {
                wordlist_code: wordlist_data
            }
        })
    else:
        existing_wordlists = requested_user[0]
        existing_wordlists["wordlists"][wordlist_code] = wordlist_data
        db.wordlists.update_one(user_query, {"$set": existing_wordlists})


    return jsonify(message="hello")

# Gets all the wordlists for a uid in Mongo
@wordlist_api.route("/get_all_wordlists", methods=["POST"])
@cross_origin()
def get_all_wordlists():
    uid = request.json["uid"]

    user_query = {
        "uid": uid
    }

    response = ""
    requested_user = db.wordlists.find(user_query)
    if requested_user.count() != 0:
        existing_wordlists = requested_user[0]["wordlists"]
        response = existing_wordlists

    return jsonify(wordlists=response)

# Creates a word for a given wordlist code
@wordlist_api.route("/add_word", methods=["POST"])
@cross_origin()
def get_all_wordlists():
    uid = request.json["uid"]
    wordlist_code = request.json["wordlistCode"]

    user_query = {
        "uid": uid,
    }

    response = ""
    requested_user = db.wordlists.find(user_query)
    if requested_user.count() != 0:
        existing_wordlists = requested_user[0]["wordlists"]
        response = existing_wordlists

    return jsonify(wordlists=response)


