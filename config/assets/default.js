'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css'
        //'public/lib/angular-material/angular-material.css'
      ],
      js: [
        'public/lib/angular/angular.js',
        //'public/lib/angular-aria/angular-aria.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        //'public/lib/angular-material/angular-material.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js'
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css',
      'public/assets/css/bootstrap.css',
      'public/assets/font-awesome/css/font-awesome.css',
      'public/assets/css/zabuto_calendar.css',
      'public/assets/js/gritter/css/jquery.gritter.css',
      'public/assets/lineicons/style.css',
      'public/assets/css/style.css',
      'public/assets/css/style-responsive.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js',
      'public/assets/js/jquery.js',
      'public/assets/js/bootstrap.min.js',
      'public/assets/js/jquery.dcjqaccordion.2.7.js',
      'public/assets/js/jquery.scrollTo.min.js',
      'public/assets/js/jquery.nicescroll.js',
      'public/assets/js/jquery.sparkline.js',
      'public/assets/js/common-scripts.js',      
      'public/assets/js/gritter/js/jquery.gritter.js',
      'public/assets/js/gritter-conf.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
