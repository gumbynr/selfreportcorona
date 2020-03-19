'use strict';
module.exports = function(app) {
	
var corona = require('../controllers/coronaController');

  app.route('/')
  .get(corona.home);

  app.route('/update_cases')
  .post(corona.update_cases);

};	