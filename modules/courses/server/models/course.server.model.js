'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Course Schema
 */
var CourseSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  number: { //course number
    type: String,
    default: '',
    trim: true,
    required: 'Course number cannot be blank'
  },
  name:{
    type: String,
    default: '',
    trim: true,
    required: 'Course name cannot be blank'
  },
  passcode:{
    type: String,
    default: '0000',
    //Doesn't need to be required..
  },
  professor: { //Professor who created the course
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Course', CourseSchema);
