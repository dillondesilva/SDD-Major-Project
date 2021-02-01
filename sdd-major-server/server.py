from flask import request, url_for
from flask_api import FlaskAPI, status, exceptions

app = FlaskAPI(__name__)

@app.route("/")
def init():
    return 'server running at ' + request.base_url

app.run(debug=True)