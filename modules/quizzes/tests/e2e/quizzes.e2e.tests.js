'use strict';

describe('Quizzes E2E Tests:', function () {
  describe('Test quizzes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/quizzes');
      expect(element.all(by.repeater('quiz in quizzes')).count()).toEqual(0);
    });
  });
});
