'use strict';

let express = require('express');
let FRONTEND_PATH = require('../constants').FRONTEND_PATH;

module.exports = function(dependencies, application) {
  application.use(express.static(FRONTEND_PATH));
  application.set('views', FRONTEND_PATH + '/views');
  application.get('/views/*', function(req, res) {
      let templateName = req.params[0].replace(/\.html$/, '');
      res.render(templateName);
    }
  );
};
