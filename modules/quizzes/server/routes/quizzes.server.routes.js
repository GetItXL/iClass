'use strict';

/**
 * Module dependencies.
 */
var quizzesPolicy = require('../policies/quizzes.server.policy'),
  quizzes = require('../controllers/quizzes.server.controller');

module.exports = function (app) {
  // Quizzes collection routes
  app.route('/api/quizzes').all(quizzesPolicy.isAllowed)
    .get(quizzes.list)
    .post(quizzes.create);

  // Single quiz routes
  app.route('/api/quizzes/:quizId').all(quizzesPolicy.isAllowed)
    .get(quizzes.read)
    .put(quizzes.update)
    .delete(quizzes.delete);

  // Finish by binding the quiz middleware
  app.param('quizId', quizzes.quizByID);
};
