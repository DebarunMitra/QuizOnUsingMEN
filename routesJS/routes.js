const path = require('path'); //to access public directory
const bcrypt = require('bcrypt');
const jsonwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../config/key').secret;
const mongoose = require('mongoose');
const Questions = mongoose.model('questions');
const Users = mongoose.model('user');
const Question = require('./Question');
const auth = require('../middleware/auth');
module.exports = (app, db) => {
  var noq = 8,
    topic;

  //registration api start
  app.post('/registration', (req, res) => {
    console.log(req.body);
    Users.findOne({
      email: req.body.email
    }).then(user => {
      if (user) {
        return res.status(400).json({
          exist: 'User with the same username already exists'
        });
      } else {
        const newUser = new Users({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err)
              throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                if (user) {
                  const savedDetails = {
                    id: user.id,
                    username: user.username,
                    email: user.email
                  }
                  jsonwt.sign(savedDetails, key, {
                    expiresIn: 15000
                  }, (err, token) => {
                    if (err) throw err;
                    res.json({
                      success: true,
                      token: "Bearer " + token
                    });
                  })
                }
              })
              .catch(err => console.log("Error occure while storing user after hashing password " + err));
          })
        });
      }
    }).catch(err => console.log("Error occured while checking email for availability " + err));
  });


  //login api start
  app.post('/login', (req, res) => {
    Users.findOne({
        email: req.body.email
      })
      .then(user => {
        if (!user)
          return res.status(404).send({
            error:'User Not Exists! Please Sign Up...'
          });
        bcrypt.compare(req.body.password, user.password).then(correct => {
          if (correct) {
            const payload = {
              id: user.id,
              username: user.username,
              email: user.email
            }
            jsonwt.sign(payload, key, {
              expiresIn: 10800
            }, (err, token) => {
              if (err) throw err;
              res.json({
                success: true,
                token: "Bearer " + token
              });
            })
          } else {
            res.status(401).json({
              failed: 'Invalid user credentials'
            });
          }
        }).catch(err => console.log("error generating token " + err));
      });
  });

  //randon question answar set
  app.post('/ranQue',auth,(req, res) => {
  //  console.log(req.body);
//    console.log(req.headers);
    var dbVal;
    topic = req.body.topic;
    Questions.find({
      "q_set": topic
    }, {
      "_id": 0,
      "questions": 1
    }, (err, result) => {
      if (err === true)
        console.log(err + " this error has occured");
      else {
        let question = result[0].questions;
        const qno = new Question(noq);
        let len = result[0].questions.length;
        let getQandO = qno.randomQueSet(topic, question, len);
        //console.log(JSON.stringify(getQandO));
        res.send(JSON.stringify(getQandO));
      }
    }).catch(err => console.log('Random Question Finding Error !!' + err));
  });

  //check answer
  app.post('/checkAns',auth,(req, res) => {
     console.log(req.body);
     console.log(req.headers);
    let reqData = req.body;
    topic = reqData[0].q_set;
    if (reqData) {
      let userAns;
      Questions.find({
        "q_set": topic
      }, {
        "_id": 0,
        "questions": 1
      }, (err, result) => {
        if (err === true)
          console.log(err + " this error has occured");
        else {
          let question = result[0].questions;
          const qno = new Question(noq);
          let len = result[0].questions.length;
          let pointAns = qno.checkAns(topic, question, len, reqData, reqData.length - 1);
          //console.log(pointAns);
          res.send(JSON.stringify(pointAns));
        }
      });
    }
  });
};
