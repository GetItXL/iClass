'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Quiz = mongoose.model('Quiz'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a quiz
 */
exports.create = function (req, res) {
  var quiz = new Quiz(req.body);
  quiz.user = req.user;

  quiz.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(quiz);
    }
  });
};

/**
 * Show the current quiz
 */
exports.read = function (req, res) {
  res.json(req.quiz);
};

/**
 * Update a quiz
 */
exports.update = function (req, res) {
  var quiz = req.quiz;

  quiz.title = req.body.title;
  quiz.question = req.body.question;
  quiz.choices = req.body.choices;
  quiz.correctAnswer = req.body.correctAnswer;

  quiz.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(quiz);
    }
  });
};

//update quiz score + participant
exports.submit = function(req, res){
  var quiz = req.quiz;
  var user = req.user;

  //Used to check if student's answer already exists in db
  var answerExists = false;

  for(var i = 0; i < quiz.scores.length; i++){
    if(quiz.scores[i].studentID.toString() === user._id.toString()){
      answerExists = true;
    }
  }

  //Be sure to pass in an answer from client controller when student submit answer
  if(!answerExists){

    quiz.totalParticipant++;

    if(req.answer === quiz.correctAnswer){
      quiz.scores.push({ studentID : user._id, quizScore : 1});
    }else{
      quiz.scores.push({ studentID : user._id, quizScore : 0});
    }

    //TODO: check if student score already exists in the database in the front as well


    quiz.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(quiz);
      }
    });

  }else{
    res.json(quiz);
  }
};



/**
 * Delete an quiz
 */
exports.delete = function (req, res) {
  var quiz = req.quiz;

  quiz.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(quiz);
    }
  });
};

/**
 * List of Quizzes
 */
exports.list = function (req, res) {
  Quiz.find().sort('-created').populate('user', 'displayName').exec(function (err, quizzes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(quizzes);
    }
  });
};

/**
 * Quiz middleware
 */
exports.quizByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Quiz is invalid'
    });
  }

  Quiz.findById(id).populate('user', 'displayName').exec(function (err, quiz) {
    if (err) {
      return next(err);
    } else if (!quiz) {
      return res.status(404).send({
        message: 'No quiz with that identifier has been found'
      });
    }
    req.quiz = quiz;
    next();
  });
};
