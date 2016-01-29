'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Course = mongoose.model('Course');

/**
 * Globals
 */
var user, course;

/**
 * Unit tests
 */
describe('Course Model Unit Tests:', function () {

  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'

    });

    user.save(function () {
      course = new Course({
        title: 'Course Title',
        content: 'Course Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      course.name = 'hi there :3';
      course.number = 2333;
      this.timeout(10000);
      return course.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      course.number = 2333;
      return course.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without number', function (done) {
      course.name = 'hi there :3';
      return course.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Course.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
