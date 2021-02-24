from flask import Blueprint, jsonify

userbase_api = Blueprint('userbase_api', __name__)

@userbase_api.route("/create_user", methods=["POST"])
def accountList():
    response = jsonify("user added")
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response