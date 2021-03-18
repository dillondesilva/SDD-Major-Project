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
        "words": []
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

# Gets words from a given wordlist code
@wordlist_api.route("/get_words", methods=["POST"])
@cross_origin()
def get_word():
    uid = request.json["uid"]
    wordlist_code = request.json["wordlistCode"]

    user_query = {
        "uid": uid
    }

    response = ""
    requested_user = db.wordlists.find(user_query)
    if requested_user.count() != 0:
        # Getting the current existing wordlists
        requested_wordlist = requested_user[0]["wordlists"][wordlist_code]
        words_to_return = requested_wordlist["words"]
        response = words_to_return

    return jsonify(words=response)

# Creates a word for a given wordlist code
@wordlist_api.route("/add_word", methods=["POST"])
@cross_origin()
def add_word():
    uid = request.json["uid"]
    wordlist_code = request.json["wordlistCode"]
    word_to_add = request.json["wordToAdd"]
    definition_to_add = request.json["definitionToAdd"]
    translated_word_to_add = request.json["wordTranslationToAdd"]
    definition_translation_to_add = request.json["definitionTranslationToAdd"]

    word_data = {
        "word": word_to_add,
        "word_translation": translated_word_to_add,
        "definition": definition_to_add,
        "translated_definition": definition_translation_to_add
    }

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
        print(wordlist_to_add)
        existing_words = wordlist_to_add["words"]
        print(existing_words)
        existing_words.append(word_data)
        print(existing_words)
        existing_wordlists[wordlist_code]["words"] = existing_words
        print(existing_wordlists)

        insert_obj = {
            "wordlists": existing_wordlists
        }
        
        db.wordlists.update_one(user_query, {"$set": insert_obj})

    return jsonify(message="success")


