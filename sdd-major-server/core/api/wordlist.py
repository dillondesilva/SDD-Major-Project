# Import flask dependencies and others (encryption, time, etc)
# For a full list search online for corresponding packages
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

# Specifying this file as an API subsection blueprint
MONGO_HOST = os.getenv("MONGO_HOST") or "localhost"
db = MongoClient(f"mongodb://{MONGO_HOST}:27017/?retryWrites=true&w=majority")["DEV"]

# Creates a new wordlist instance in Mongo
@wordlist_api.route("/create_wordlist", methods=["POST"])
@cross_origin()
def create_wordlist():
    # Getting the wordlist metadata from JSON request
    wordlist_name = request.json["wordlistName"]
    wordlist_des = request.json["wordlistDescription"]
    wordlist_code = request.json["wordlistCode"]
    uid = request.json["uid"]

    # Creating a dictionary to later convert to JSON with the
    # wordlist metadata
    wordlist_data = {
        "wordlist_name": wordlist_name,
        "wordlist_des": wordlist_des,
        "words": [],
        "assignedStudents": []
    }

    # Search for the user in the database. 
    user_query = {
        "uid": uid
    }

    requested_user = db.wordlists.find(user_query)

    if requested_user.count() == 0:
        # If we find a matching user who has already created a wordlist, 
        # insert a new wordlist with the new wordlist code in the database
        db.wordlists.insert_one({
            "uid": uid,
            "wordlists": {
                wordlist_code: wordlist_data
            }
        })
    else:
        # Create a brand new wordlist user in the wordlist section of 
        # the database and add the list
        existing_wordlists = requested_user[0]
        existing_wordlists["wordlists"][wordlist_code] = wordlist_data
        db.wordlists.update_one(user_query, {"$set": existing_wordlists})


    return jsonify(message="hello")

# Gets all the wordlists for a uid in Mongo
@wordlist_api.route("/get_all_wordlists", methods=["POST"])
@cross_origin()
def get_all_wordlists():
    uid = request.json["uid"]

    # Search for the user in the database. 
    user_query = {
        "uid": uid
    }

    response = ""
    requested_user = db.wordlists.find(user_query)
    if requested_user.count() != 0:
        existing_wordlists = requested_user[0]["wordlists"]
        response = existing_wordlists

    return jsonify(wordlists=response)

# Gets words from a given wordlist code
@wordlist_api.route("/get_words", methods=["POST"])
@cross_origin()
def get_words():
    # uid = request.json["uid"]
    wordlist_code = request.json["wordlistCode"]

    # # Search for the user in the database.
    # user_query = {
    #     "uid": uid
    # }

    response = ""

    wordlist_db = db.wordlists.find({})
    for user_obj in wordlist_db:
        if wordlist_code in user_obj["wordlists"]:
            words_to_return = user_obj["wordlists"][wordlist_code]["words"]
            response = words_to_return
            return jsonify(words=response)

    return response

# Creates a word for a given wordlist code
@wordlist_api.route("/add_word", methods=["POST"])
@cross_origin()
def add_word():
    # Getting word data based of JSON request from users
    uid = request.json["uid"]
    wordlist_code = request.json["wordlistCode"]
    word_to_add = request.json["wordToAdd"]
    definition_to_add = request.json["definitionToAdd"]
    translated_word_to_add = request.json["wordTranslationToAdd"]
    definition_translation_to_add = request.json["definitionTranslationToAdd"]
    img_to_add = request.json["imageToAdd"]

    # Putting JSON word data into a python dictionary for database
    word_data = {
        "word": word_to_add,
        "translated_word": translated_word_to_add,
        "definition": definition_to_add,
        "translated_definition": definition_translation_to_add,
        "img": img_to_add
    }

    # Search for the user in the database.
    user_query = {
        "uid": uid
    }

    response = ""
    requested_user = db.wordlists.find(user_query)
    if requested_user.count() != 0:
        # Getting the current existing wordlists
        existing_wordlists = requested_user[0]["wordlists"]
        print(existing_wordlists)
        # wordlist_to_add just retrieves the wordlist we want to
        # add a word to via wordlist_code
        wordlist_to_add = existing_wordlists[wordlist_code]
        # existing_words obtains a list of words which are
        # already apart of the wordlist
        existing_words = wordlist_to_add["words"]
        existing_words.append(word_data)
        existing_wordlists[wordlist_code]["words"] = existing_words

        # The object to insert back into the database
        insert_obj = {
            "wordlists": existing_wordlists
        }
        
        # Update user wordlists
        db.wordlists.update_one(user_query, {"$set": insert_obj})

    return jsonify(message="success")