'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Quiz = mongoose.model('Quiz'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, quiz;

/**
 * Quiz routes tests
 */
describe('Quiz CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username1111111',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@ufl.edu',
      username: credentials.username,
      password: credentials.password,
      provider: 'local',
      roles: 'professor'
    });

    // Save a user to the test db and create new quiz
    user.save(function () {
      quiz = {
        title: 'Quiz Title',
        question: 'Quiz Content',
        choices: [{ letter:'A', description:'asdf' }],
        correctAnswer: 'A'
      };

      done();
    });
  });

  it('should be able to save a quiz if logged in', function (done) {
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

        // Save a new quiz
        agent.post('/api/quizzes')
          .send(quiz)
          .expect(200)
          .end(function (quizSaveErr, quizSaveRes) {
            // Handle quiz save error
            if (quizSaveErr) {
              return done(quizSaveErr);
            }

            // Get a list of quizzes
            agent.get('/api/quizzes')
              .end(function (quizzesGetErr, quizzesGetRes) {
                // Handle quiz save error
                if (quizzesGetErr) {
                  return done(quizzesGetErr);
                }

                // Get quizzes list
                var quizzes = quizzesGetRes.body;

                // Set assertions
                (quizzes[0].user._id).should.equal(userId);
                (quizzes[0].title).should.match('Quiz Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an quiz if not logged in', function (done) {
    agent.post('/api/quizzes')
      .send(quiz)
      .expect(403)
      .end(function (quizSaveErr, quizSaveRes) {
        // Call the assertion callback
        done(quizSaveErr);
      });
  });

  it('should not be able to save an quiz if no title is provided', function (done) {
    // Invalidate title field
    quiz.title = '';

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

        // Save a new quiz
        agent.post('/api/quizzes')
          .send(quiz)
          .expect(400)
          .end(function (quizSaveErr, quizSaveRes) {
            // Set message assertion
            (quizSaveRes.body.message).should.match('Title cannot be blank');

            // Handle quiz save error
            done(quizSaveErr);
          });
      });
  });

  it('should be able to update an quiz if signed in', function (done) {
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

        // Save a new quiz
        agent.post('/api/quizzes')
          .send(quiz)
          .expect(200)
          .end(function (quizSaveErr, quizSaveRes) {
            // Handle quiz save error
            if (quizSaveErr) {
              return done(quizSaveErr);
            }

            // Update quiz title
            quiz.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing quiz
            agent.put('/api/quizzes/' + quizSaveRes.body._id)
              .send(quiz)
              .expect(200)
              .end(function (quizUpdateErr, quizUpdateRes) {
                // Handle quiz update error
                if (quizUpdateErr) {
                  return done(quizUpdateErr);
                }

                // Set assertions
                (quizUpdateRes.body._id).should.equal(quizSaveRes.body._id);
                (quizUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

    /* TODO: change to should not
  it('should be able to get a list of quizzes if not signed in', function (done) {
    // Create new quiz model instance
    var quizObj = new Quiz(quiz);

    // Save the quiz
    quizObj.save(function () {
      // Request quizzes
      request(app).get('/api/quizzes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });*/

    /*
  it('should be able to get a single quiz if not signed in', function (done) {
    // Create new quiz model instance
    var quizObj = new Quiz(quiz);

    // Save the quiz
    quizObj.save(function () {
      request(app).get('/api/quizzes/' + quizObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', quiz.title);

          // Call the assertion callback
          done();
        });
    });
  });*/

  it('should return proper error for single quiz with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/quizzes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Quiz is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single quiz which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent quiz
    request(app).get('/api/quizzes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No quiz with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an quiz if signed in', function (done) {
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

        // Save a new quiz
        agent.post('/api/quizzes')
          .send(quiz)
          .expect(200)
          .end(function (quizSaveErr, quizSaveRes) {
            // Handle quiz save error
            if (quizSaveErr) {
              return done(quizSaveErr);
            }

            // Delete an existing quiz
            agent.delete('/api/quizzes/' + quizSaveRes.body._id)
              .send(quiz)
              .expect(200)
              .end(function (quizDeleteErr, quizDeleteRes) {
                // Handle quiz error error
                if (quizDeleteErr) {
                  return done(quizDeleteErr);
                }

                // Set assertions
                (quizDeleteRes.body._id).should.equal(quizSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an quiz if not signed in', function (done) {
    // Set quiz user
    quiz.user = user;

    // Create new quiz model instance
    var quizObj = new Quiz(quiz);

    // Save the quiz
    quizObj.save(function () {
      // Try deleting quiz
      request(app).delete('/api/quizzes/' + quizObj._id)
        .expect(403)
        .end(function (quizDeleteErr, quizDeleteRes) {
          // Set message assertion
          (quizDeleteRes.body.message).should.match('User is not authorized');

          // Handle quiz error error
          done(quizDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Quiz.remove().exec(done);
    });
  });
});
