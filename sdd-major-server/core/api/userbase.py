# Import flask dependencies and others (encryption, time, etc)
# For a full list search online for corresponding packages
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from pymongo import MongoClient
from ..classes.user import User
from uuid import uuid4
import shortuuid
import time
import bcrypt
import json
import os
import hashlib
import re

# Specifying this file as an API subsection blueprint
userbase_api = Blueprint('userbase_api', __name__)

# Establish connection with mongo server
MONGO_HOST = os.getenv("MONGO_HOST") or "localhost"
db = MongoClient(f"mongodb://{MONGO_HOST}:27017/?retryWrites=true&w=majority")["DEV"]

# Creates a new user instance in MongoDB
@userbase_api.route("/create_user", methods=["POST"])
@cross_origin()
def create_user():
    # Getting the user details from JSON request
    email = request.json["emailValue"] # User email
    username = request.json["usernameValue"] # User username
    pwd = request.json ["pwdValue"] # User password
    confirm_pwd = request.json["pwdConfirmValue"] # User password confirm
    account_type = request.json["accountType"] # User account type
    uid = str(uuid4()) # Generate UUID
    add_code = shortuuid.ShortUUID().random(length=6)
    salt = os.urandom(32) # New salt per user

    # Email regex string (it is very long)
    email_re = '^(\w|\.|\_|\-)+[@](\w|\_|\-|\.)+[.]\w{2,3}$'
   
    valid_email = (re.search(email_re, email) != None)

    response = ""
    # Only continue through if the passwords match and email is valid
    if not valid_email:
        # Returns an error message for invalid emails
        response = jsonify({"error": "Email is not valid"})
    elif pwd == confirm_pwd:
        # Hash password
        hashed_pwd = hashlib.pbkdf2_hmac("sha256", pwd.encode("utf-8"), salt, 100000)
        # Store user details in DB
        db.users.insert_one({
            "uid": uid,
            "email": email,
            "username": username,
            "pwd": hashed_pwd,
            "account_type": account_type,
            "add_code": add_code,
            "salt": salt,
            "students": []
        })
        # Return 200 and let frontend know user was created
        response = jsonify("New user created")
    else:
        # Returns an error message for passwords that don't match
        response = jsonify({"error": "Passwords don't match"})
    return response

# Verifies given user details exist in database
@userbase_api.route("/verify_user", methods=["POST"])
@cross_origin()
def verify_user():
    email = request.json["emailValue"] # User typed in email value
    pwd = request.json ["pwdValue"] # User typed in pwd value
 
    # Search for the user in the database. Use this result
    # to check if passwords match
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

        # Hash passwords and verify
        pwd_hashed = hashlib.pbkdf2_hmac('sha256', pwd.encode('utf-8'), salt, 100000)
        if pwd_hashed == valid_pwd_hash:
            # If we hit this stage, return UID and a token
            uid = requested_user[0]["uid"]
            token = User.gen_token(uid)
            response = jsonify(access_token=token, uid=uid)
    
    return response

# Verifies given user details exist in database
@userbase_api.route("/get_user_by_uid", methods=["POST"])
@cross_origin()
def get_user_by_uid():
    uid = request.json["uid"]

    user_query = {
        "uid": uid
    }

    requested_user = db.users.find(user_query)
    users_found = requested_user.count()

    response = ""
    # No user was found with the given email
    if users_found == 0:
        response = jsonify(empty="invalid uid")
        return response
    else:
        user = requested_user[0]
        response = jsonify({
            "email": user["email"],
            "username": user["username"],
            "accountType": user["account_type"],
            "addCode": user["add_code"]
        })
    
    return response

# Adds a student to a teacher account
@userbase_api.route("/add_student", methods=["POST"])
@cross_origin()
def add_student():
    uid = request.json["uid"]
    add_code = request.json["studentCode"]
    # Querying for the student to add
    student_query = {
        "add_code": add_code
    }

    # Querying for the current user's profile
    user_query = {
        "uid": uid
    }

    requested_student = db.users.find(student_query)
    student_found = requested_student.count()

    response = ""
    # No student was found with that code
    if student_found == 0:
        response = jsonify(error="We couldn't find a student with that code.")
        return response
    else:
        requested_user = db.users.find(user_query)[0]

        if "students" in requested_user:
            current_students = requested_user["students"]
            print(current_students)
            print(add_code)
            current_students.append(add_code)
            insert_obj = {
                "students": current_students
            }

            db.users.update_one({
                "uid": uid
            }, {"$set": insert_obj})
        else:
            insert_obj = {
                "students": [add_code]
            }
            db.users.update_one({
                "uid": uid
            }, {"$set": insert_obj})

    return response 

# Gets all the students connected with a teacher account
@userbase_api.route("/get_students", methods=["POST"])
@cross_origin()
def get_students():
    print("regrs")
    uid = request.json["uid"]

    # Querying for the current user's profile
    user_query = {
        "uid": uid
    }

    requested_user = db.users.find(user_query)
    user_found = requested_user.count()

    response = ""
    # No student was found with that code
    if user_found == 0:
        response = jsonify(error="We couldn't find a student with that code.")
        return response
    else:
        student_codes = requested_user[0]["students"]
        student_data = []
        print(student_codes)
        for code in student_codes:
            # Querying for student profile
            student_query = {
                "add_code": code
            }

            requested_student = db.users.find(student_query)
            student_name = requested_student[0]["username"]
            student_data.append([code, student_name])

        response = jsonify(students=student_data)
    return response 

# Assigns students to wordlist
@userbase_api.route("/add_students_to_wordlist", methods=["POST"])
@cross_origin()
def add_students_to_wordlist():
    students_to_add = request.json["studentsToAdd"]
    wordlist_code = request.json["wordlistCode"]
    print("u")
    response = ""

    for student in students_to_add:
        student_code = student[0]
        insert_obj = {
            "wordlists": [wordlist_code]
        }

        db.users.update_one({
            "add_code": student_code
        }, {"$set": insert_obj})

    return response

# Retrieves wordlist data from a single code given
# a database snapshot
def retrieve_wordlists_from_code(code, db_snapshot):
    for user_obj in db_snapshot:
        if code in user_obj["wordlists"]:
            return user_obj["wordlists"][code]
    return

# Gets wordlists for a student account
@userbase_api.route("/get_assigned_wordlists", methods=["POST"])
@cross_origin()
def get_assigned_wordlists():
    uid = request.json["uid"]
    response = ""

    # Querying for the current user's profile
    user_query = {
        "uid": uid
    }

    requested_user = db.users.find(user_query)[0]
    wordlist_codes = requested_user["wordlists"]
    wordlists = {}
    wordlist_db = db.wordlists.find({})
    for code in wordlist_codes:
        wordlist_data = retrieve_wordlists_from_code(code, wordlist_db)
        wordlists[code] = wordlist_data
  
    return jsonify(wordlists=wordlists)