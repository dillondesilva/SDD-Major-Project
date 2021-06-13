# Import flask dependencies and others (encryption, time, etc)
# For a full list search online for corresponding packages
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
import boto3

# Specifying this file as an API subsection blueprint
translate_api = Blueprint('translate_api', __name__)

# Basic API Endpoint for translation
@translate_api.route("/basic_translate", methods=["POST"])
@cross_origin()
def basic_translate():
    text_to_translate = request.json["textToTranslate"]
    target_lan = request.json["targetLanguage"]
    print(text_to_translate, target_lan)
    client = boto3.client('translate')
    response = client.translate_text(
        Text= text_to_translate,
        SourceLanguageCode='en',
        TargetLanguageCode= target_lan
    )   

    return jsonify(res=response)