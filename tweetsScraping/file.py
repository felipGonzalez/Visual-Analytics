import sys
import tweepy
import datetime, time
import json
from pymongo import MongoClient

MONGO_HOST= 'mongodb://localhost:27017/twitterdb' 

CONSUMER_KEY = "bucLNflwW68Aj7LVTWigzughW"
CONSUMER_SECRET = "VamnexxhkvnP1fbbovEiQqC35fUUyDCai2SyIheuzVExWyJ3jP"
ACCESS_TOKEN = "1120132574662332417-vZDryGJp91tFjW4lWVRb4KP2HfuSnp"
ACCESS_TOKEN_SECRET = "f3GIO2hnhe4GnojmcrZMa7GjRa1oTnWIiNe2OIjyhxDuV"

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
api = tweepy.API(auth)

def get_tweets(api, username):
    page = 1
    client = MongoClient(MONGO_HOST)
    db = client.twitterdb
    while page < 20 :
        tweets = api.user_timeline(username, page = page)

        for tweet in tweets:
            if(datetime.datetime.now() - tweet.created_at).days < 1000 :
                obj = {"tweet" : tweet.text +""}
                #datajson = json.dumps(obj)
                db.twitter_search.insert_one(tweet._json)
           
        
        page = page+1
        print (page)

get_tweets(api, 'JuanManSantos')
get_tweets(api, 'oizuluaga')
get_tweets(api, 'AlvaroUribeVel')
get_tweets(api, 'petrogustavo')
get_tweets(api, 'German_Vargas')
get_tweets(api, 'AABenedetti')
get_tweets(api, 'JERobledo')
get_tweets(api, 'IvanCepedaCast')
get_tweets(api, 'sergio_fajardo')
get_tweets(api, 'SimonGaviria')
get_tweets(api, 'ginaparody')
get_tweets(api, 'ClaraLopezObre')
get_tweets(api, 'ClaudiaLopez')
get_tweets(api, 'OIZuluaga')
get_tweets(api, 'EnriquePenalosa')
get_tweets(api, 'AntanasMockus')