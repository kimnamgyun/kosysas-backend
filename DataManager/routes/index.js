var express = require('express');
var router = express.Router();
var client = require('../service/es/elasticsearch.js');
var searchFunctions = require('../service/es/functions/search.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'DBTest.!.!.!' });
	
	client.cluster.health({}, function(err, resp, status) {
		console.log("-- Client Error : [ ", err, " ] --")
		console.log("-- Client Status : [ ", status, " ] --")
		console.log("-- Client Health --\n", resp)	
	});
	
	client.count({index: 'metricbeat-*', type: 'doc'}, function(err, resp, status) {
		console.log(resp);
	});
});

router.post('/search', function(req, res, next) {
	
	

});

module.exports = router;
