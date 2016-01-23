'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Quiz Schema
 */
var QuizSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  question: {
    type: String,
    default: '',
    trim: true
  },
  choices: { /* limit possible choices to 5? */
    type: [{
      letter: {
        type: String //Should be auto assigned by system - A, B, C, D....
      },
      description: {
        type: String,
        required: 'Answer description cannot be blank'
      }
    }]
  },
  correctAnswer: {
    type: String, //A, B, C, D,
    required: 'Please select a correct answer'
  },
  user: { //The professor who created the quiz
    type: Schema.ObjectId,
    ref: 'User'
  },
  courseID: {
    type: String
  } /* May need to modify later */
});

mongoose.model('Quiz', QuizSchema);
