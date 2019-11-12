const express=require('express');
//const mongodb=require('mongodb').MongoClient;
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const JSON = require('circular-json');
const path=require('path');//to access public directory
const cors=require('cors');

// Load User Model
require('./models/Questions');
require('./models/User');

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



const port=process.env.PORT || 5020;

mongoose.connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err)
    return console.log(err);
    //const database =db.collection("questions");
    require('./routesJS/routes')(app);
    app.listen(port, () => {
        console.log(`Server up on port no  ${port}`);
        console.log('Database Connected Successfully');
    });
});
