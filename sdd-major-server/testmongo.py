from pymongo import MongoClient

client = MongoClient("mongodb+srv://admin:admin@sdd-major.ktcef.mongodb.net/test?retryWrites=true&w=majority")
db = client.test

serverStatusResult = db.command("serverStatus")
print(serverStatusResult)
