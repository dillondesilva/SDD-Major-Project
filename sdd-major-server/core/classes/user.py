from time import time
import jwt

class User:
    # Generates a unique token for authentication
    def gen_token(uid):
        # Payload for our JSON-Web Token
        token_payload = {
            "id": uid,
            "iat": time(),
            "type": "access/student",
        }

        encoded_token = jwt.encode(token_payload, 'secret', algorithm='HS256')
        return encoded_token