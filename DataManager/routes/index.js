var express = require('express');
var router = express.Router();
var client = require('../service/es/elasticsearch.js');
var searchFunctions = require('../service/es/functions/search.js');
var jsonFunctions = require('../service/utils/json.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'DBTest.!.!.!' });
	
	client.cluster.health({}, function(err, resp, status) {
		console.log("-- Client Error : [ ", err, " ] --")
		console.log("-- Client Status : [ ", status, " ] --")
		console.log("-- Client Health --\n", resp)	
	});
	
//	searchFunctions.matchAll(client, 'metricbeat-*', function(result){
//		console.log("matchAll\n", result);
//	});
	
	var query = '"_type": "doc"';
	searchFunctions.match(client, 'metricbeat-*', query, function(result) {
		console.log("match\n", result);
	});
});

module.exports = router;
