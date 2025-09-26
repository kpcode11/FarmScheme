import json
from pymongo import MongoClient

# Connect to Atlas
client = MongoClient("mongodb+srv://username: Password@clustername.rqu43sk.mongodb.net")
db = client["farmers"]
collection = db["schemes"]

# Export as JSON
docs = list(collection.find({}))
with open("myCollection.json", "w") as f:
    json.dump(docs, f, default=str, indent=4)
