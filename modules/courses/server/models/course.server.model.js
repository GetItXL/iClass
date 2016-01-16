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
/*    ,date: { //course validation date , may need it later.
    type: {
        semester: {
            type  String,
            enum:[Spring, Summer, Fall],
        },
        year: {
          type: Number
        }
    },
    default: {
      semester: 'Spring',
      year: '2016'
    },
  }
  */
  /*, //Not sure if it's needed, may need it later for efficiency
  enrolledStudents: [{
    type: Schema.ObjectId,
    ref: 'User'
  }]*/ 

});

mongoose.model('Course', CourseSchema);
