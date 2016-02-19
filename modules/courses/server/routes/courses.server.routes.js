'use strict';

/**
 * Module dependencies.
 */
var coursesPolicy = require('../policies/courses.server.policy'),
  courses = require('../controllers/courses.server.controller');

module.exports = function (app) {
  // Courses collection routes
  app.route('/api/courses').all(coursesPolicy.isAllowed)
    .get(courses.list)
    .post(courses.create);

  // Single course routes
  app.route('/api/courses/:courseId').all(coursesPolicy.isAllowed)
    .get(courses.read)
    .put(courses.update)
    .delete(courses.delete);
    //.post(couses.join); //Student enroll in a selected course

  //api for students updating enrolledStudents field of course
  app.route('/api/courses/enrolledStu/:courseId').all(coursesPolicy.isAllowed)
      .get(courses.read)
      .put(courses.updateEnrolledStudents);


  // Finish by binding the course middleware
  app.param('courseId', courses.courseByID);
};
