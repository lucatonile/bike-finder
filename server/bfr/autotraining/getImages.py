import pymongo, os, settings
from pprint import pprint

import urllib.parse
username = urllib.parse.quote_plus('adrian')
password = urllib.parse.quote_plus('adrian123')
myclient = pymongo.MongoClient(os.getenv("DATABASE_URL"))


storage_client = storage.Client("[Your project name here]")
# Create a bucket object for our bucket
bucket = storage_client.get_bucket(bucket_name)
# Create a blob object from the filepath
blob = bucket.blob("folder_one/foldertwo/filename.extension")
# Download the file to a destination
blob.download_to_filename(destination_file_name)

#myclient = pymongo.MongoClient('mongodb://%s:%s@ds063879.mlab.com:63879' % (username , password))
#myclient = pymongo.MongoClient('mongodb://%s:%s@ds063879.mlab.com:63879/heroku_s6frx9gr' % (username , password))
#client = pymongo.MongoClient("ds063879.mlab.com:63879", username = "adrian", password =  "adrian123", authSource = "heroku_s6frx9gr")
#mongodb://henrik:henrik1@ds063879.mlab.com:63879/heroku_s6frx9gr

#get collection
db = myclient.heroku_s6frx9gr
collection = db['bikes']

#print all pikes

cursor = collection.find({"keywords": {"$exists":True}, "color": {"$exists":True}, "image_url": {"$exists":True}}, { "_id": 0, "keywords": 1, "color": 1, "image_url": 1 })
for document in cursor: 

    pprint(document)



#get all red bikes
#pprint(collection.find_one({'frame_number': 1231337}))



#mydb = myclient["mydatabase"]