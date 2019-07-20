var express = require('express');
var app = express();
const port = 3000;


var fs = require('fs');
var request = require('request');

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



const findDocuments = function (query, db, callback) {
  
  const collection = db.collection('twitter_search');
  collection.find(query).toArray(function (err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs.length)
    callback(docs);
  });
}


app.get('/', function (req, res) {
  res.send('Hello World!');
});


app.get('/noticia/:tipo', (req, res) => {
  console.log("entro" + req.params.tipo);
  getConsulta({ "tipo": req.params.tipo }, (documentos) => {
    res.send(documentos);
  })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

