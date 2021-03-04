class User:
    def __init__(self, email, username, pwd):
        self.email = email
        self.pwd = pwd
        self.username = username

    @property
    def to_dict(self):
        return {
            "email": self.email,
            "pwd": self.pwd,
            "username": self.username
        }