'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Course = mongoose.model('Course'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, course;

/**
 * Course routes tests
 */
describe('Course CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username111',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test123111@ufl.edu',
      username: credentials.username,
      password: credentials.password,
      provider: 'local',
      roles: ['professor']
    });

    // Save a user to the test db and create new course
    user.save(function () {
      course = {
        name: 'testCourseName',
        number: 'testCourseNum'
      };

      done();
    });
  });

  // it('should be able to save an course if logged in', function (done) {
  //   agent.post('/api/auth/signin')
  //     .send(credentials)
  //     .expect(200)
  //     .end(function (signinErr, signinRes) {
  //       // Handle signin error
  //       if (signinErr) {
  //         return done(signinErr);
  //       }

  //       // Get the userId
  //       var userId = user.id;

  //       // Save a new course
  //       agent.post('/api/courses')
  //         .send(course)
  //         .expect(200)
  //         .end(function (courseSaveErr, courseSaveRes) {
  //           // Handle course save error
  //           if (courseSaveErr) {
  //             return done(courseSaveErr);
  //           }

  //           // Get a list of courses
  //           agent.get('/api/courses')
  //             .end(function (coursesGetErr, coursesGetRes) {
  //               // Handle course save error
  //               if (coursesGetErr) {
  //                 return done(coursesGetErr);
  //               }

  //               // Get courses list
  //               var courses = coursesGetRes.body;

  //               // Set assertions
  //               (courses[0].user._id).should.equal(userId);
  //               (courses[0].title).should.match('Course Title');

  //               // Call the assertion callback
  //               done();
  //             });
  //         });
  //     });
  // });

  it('should not be able to save an course if not logged in', function (done) {
    agent.post('/api/courses')
      .send(course)
      .expect(403)
      .end(function (courseSaveErr, courseSaveRes) {
        // Call the assertion callback
        done(courseSaveErr);
      });
  });

   it('should not be able to save an course if no title is provided', function (done) {
     // Invalidate title field
     course.name = '';

     agent.post('/api/auth/signin')
       .send(credentials)
       .expect(200)
       .end(function (signinErr, signinRes) {
         // Handle signin error
         if (signinErr) {
           return done(signinErr);
         }

         // Get the userId
         var userId = user.id;

         // Save a new course
         agent.post('/api/courses')
           .send(course)
           .expect(400)
           .end(function (courseSaveErr, courseSaveRes) {
             // Set message assertion
             (courseSaveRes.body.message).should.match('Course name cannot be blank');

             // Handle course save error
             done(courseSaveErr);
           });
       });
   });

   //it('should be able to update an course if signed in', function (done) {
   //  agent.post('/api/auth/signin')
   //    .send(credentials)
   //    .expect(200)
   //    .end(function (signinErr, signinRes) {
   //      // Handle signin error
   //      if (signinErr) {
   //        return done(signinErr);
   //      }
   //
   //      // Get the userId
   //      var userId = user.id;
   //
   //      // Save a new course
   //      agent.post('/api/courses')
   //        .send(course)
   //        .expect(200)
   //        .end(function (courseSaveErr, courseSaveRes) {
   //          // Handle course save error
   //          if (courseSaveErr) {
   //            return done(courseSaveErr);
   //          }
   //
   //          // Update course title
   //          course.passcode = '12345';
   //
   //          // Update an existing course
   //          agent.put('/api/courses/' + courseSaveRes.body._id)
   //            .send(course)
   //            .expect(200)
   //            .end(function (courseUpdateErr, courseUpdateRes) {
   //              // Handle course update error
   //              if (courseUpdateErr) {
   //                return done(courseUpdateErr);
   //              }
   //
   //              // Set assertions
   //              (courseUpdateRes.body._id).should.equal(courseSaveRes.body._id);
   //              (courseUpdateRes.body.passcode).should.passcode('12345');
   //
   //              // Call the assertion callback
   //              done();
   //            });
   //        });
   //    });
   //});

   it('should be able to get a list of courses if not signed in', function (done) {
     // Create new course model instance
     var courseObj = new Course(course);


     // Save the course
     courseObj.save(function () {
       // Request courses
       request(app).get('/api/courses')
          .expect(403)
         .end(function (req, res) {
           // Set assertion
             done(req);
         });

     });
   });

   it('should not be able to get a single course if not signed in', function (done) {
     // Create new course model instance
     var courseObj = new Course(course);

     // Save the course
     courseObj.save(function () {
       request(app).get('/api/courses/' + courseObj._id)
           .expect(403)
         .end(function (req, res) {

           done(req);
         });
     });
   });

  it('should return proper error for single course with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/courses/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Course is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single course which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent course
    request(app).get('/api/courses/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No course with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  // it('should be able to delete an course if signed in', function (done) {
  //   agent.post('/api/auth/signin')
  //     .send(credentials)
  //     .expect(200)
  //     .end(function (signinErr, signinRes) {
  //       // Handle signin error
  //       if (signinErr) {
  //         return done(signinErr);
  //       }

  //       // Get the userId
  //       var userId = user.id;

  //       // Save a new course
  //       agent.post('/api/courses')
  //         .send(course)
  //         .expect(200)
  //         .end(function (courseSaveErr, courseSaveRes) {
  //           // Handle course save error
  //           if (courseSaveErr) {
  //             return done(courseSaveErr);
  //           }

  //           // Delete an existing course
  //           agent.delete('/api/courses/' + courseSaveRes.body._id)
  //             .send(course)
  //             .expect(200)
  //             .end(function (courseDeleteErr, courseDeleteRes) {
  //               // Handle course error error
  //               if (courseDeleteErr) {
  //                 return done(courseDeleteErr);
  //               }

  //               // Set assertions
  //               (courseDeleteRes.body._id).should.equal(courseSaveRes.body._id);

  //               // Call the assertion callback
  //               done();
  //             });
  //         });
  //     });
  // });

  it('should not be able to delete an course if not signed in', function (done) {
    // Set course user
    course.user = user;

    // Create new course model instance
    var courseObj = new Course(course);

    // Save the course
    courseObj.save(function () {
      // Try deleting course
      request(app).delete('/api/courses/' + courseObj._id)
        .expect(403)
        .end(function (courseDeleteErr, courseDeleteRes) {
          // Set message assertion
          (courseDeleteRes.body.message).should.match('User is not authorized');

          // Handle course error error
          done(courseDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Course.remove().exec(done);
    });
  });
});
