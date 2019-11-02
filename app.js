const express=require('express');
const mongodb=require('mongodb').MongoClient;
const bodyParser=require('body-parser');
const JSON = require('circular-json');
const path=require('path');//to access public directory
const cors=require('cors');

const router = express.Router();

const app=express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());//initializing bodyParser middleware

const db=require('./config/db');

const port=5020;

mongodb.connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err)
    return console.log(err);
    const database =db.db("quizOn").collection("questions");
    require('./routesJS/routes')(app, database);
    app.listen(port, () => {
        console.log(`Server up on port no  ${port}`);
        console.log('Database Connected Successfully');
    });
});
