var express = require('express');
var app = express();
const port = 3000;

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'twitterdb';


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

function getConsulta(query, callback) {
  MongoClient.connect('mongodb://localhost:27017/' + dbName, function (err, client) {
    const db = client.db(dbName);
    findDocuments(query, db, callback);
  })
}

function getConsultAggregate(query, callback) {
  MongoClient.connect('mongodb://localhost:27017/' + dbName, function (err, client) {
    const db = client.db(dbName);
    aggregateDocuments(query, db, callback);
  })
}




const findDocuments = function (query, db, callback) {
  
  const collection = db.collection('twitter_search');
  collection.find(query).toArray(function (err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs.length)
    callback(docs);
  });
}


const aggregateDocuments = function (query, db, callback) {
  
  const collection = db.collection('twitter_search');
  collection.aggregate(query).toArray(function (err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs.length)
    callback(docs);
  });
}

app.get('/', function (req, res) {
  res.send('Hello World!');
});

/*
app.get('/', (req, res) => {
  console.log("entro" + req.params.tipo);
  getConsulta({ "tipo": req.params.tipo }, (documentos) => {
    res.send(documentos);
  })
})

*/

// cantidad de tweet por candidato

app.get('/maxTweets', (req, res) => {
  console.log("entro" + req.params.tipo);
  getConsultAggregate(
    [
    {
         $group : {
             _id : "$user.name",
             "tweets" : { $sum : 1} 
             
             }
     }
 
 ], 
 (documentos) => {
    res.send(documentos);
  })
});

app.get('/maxRetweets', (req, res) => {
  console.log("entro" + req.params.tipo);
  getConsultAggregate(
    [
      {
        $group : {
            _id : "$user.name",
            "tweets" : { $sum : "$retweet_count"} 
            
            }
    }
 
 ], 
 (documentos) => {
    res.send(documentos);
  })
});


app.get('/tweetsDate', (req, res) => {
  console.log("entro" + req.params.tipo);
  getConsultAggregate(
    [
      {$project: { nombre: "$user.name" , date: { $dateFromString: { dateString: "$created_at"} } } },
        {$group : { _id : { nombre: "$nombre" ,month : {$month : "$date"} }, "mencion" : { $sum : 1} } },
        { $sort : { _id : 1 } }
        
 
 ], 
 (documentos) => {
    res.send(documentos);
  })
});


app.get('/hashtag', (req, res) => {
  console.log("entro" + req.params.tipo);
  getConsultAggregate(
  [
       
    { $unwind : { path: "$entities.hashtags" } }, 
    { $group : {_id : "$entities.hashtags.text", "htmas" : { $sum : 1} } },
    { $sort : { htmas : -1 } }, 
    { $limit : 25 }
        
 
 ], 
 (documentos) => {
    res.send(documentos);
  })
});


app.get('/maxUser', (req, res) => {
  console.log("entro" + req.params.tipo);
  getConsultAggregate(
    [
      { $unwind : { path: "$entities.user_mentions" } }, 
      { $group : {_id : "$entities.user_mentions.name", "mencion" : { $sum : 1} } },
      { $sort : { mencion : -1 } }, 
      { $limit : 15 }
        
 
 ], 
 (documentos) => {
    res.send(documentos);
  })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

