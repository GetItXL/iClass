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
  title: { //name of the quiz
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  question: {
    type: String,
    default: '',
    trim: true,
    required: 'You must enter a question for the quiz'
  },
  choices: { /* limit possible choices to 5? */
    type: [{
      letter: {
        type: String //Should be auto assigned by system - A, B, C, D....
      },
      description: {
        type: String,
        required: 'Answer description cannot be blank',
        trim: true
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
  },/* May need to modify later */
  quizDuration: { //convert duration into millisecond and store as number
    type: Number  //if quizDuration = -1, means user selected manually hit stop quiz button
  },
  quizType: {
    type: String //"MC", vs "attendence"
  },
  quizOpen: { //marks whether a quiz is open or closed
    type: Boolean,
    default: false
  },
  quizEnded: { //Marks whether a quiz has ended
    type: Boolean,
    default: false
  },
  scores: { //ARRAY of Objects with properties: {studentID, selectedAnswer, quizScore}
    type: [{
      studentID: { //TODO: don't need can remove
        type: String
      },
      student: { //The professor who created the quiz
        type: Schema.ObjectId,
        ref: 'User'
      },
      selectedAnswer: {
        type: String,
        default: ''
      },
      quizScore: {
        type: Number,
        default: 0 //can be 0 or 1
      }
    }]
  },
  totalParticipant:{ //total number of students answered the quiz
    type: Number,     //Figured out why we needed this!
    default: 0        //because score.length != totalParticipant!
  }                   //Not all students in class must take the quiz but all students in class need score!


});

mongoose.model('Quiz', QuizSchema);
