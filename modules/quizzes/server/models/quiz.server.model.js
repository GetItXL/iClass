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
  user: { //The professor who created the quiz
    type: Schema.ObjectId,
    ref: 'User'
  },
  courseID: {
    type: String
  } /* May need to modify later */
});

mongoose.model('Quiz', QuizSchema);
