var express = require('express');
var router = express.Router();
var client = require('../service/es/elasticsearch.js');
var searchFunctions = require('../service/es/functions/search.js');
var json = require('../service/utils/json.js');
var common = require('./common.js');

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

/*
 * 		임시
 */
router.get('/search', function(req, res, next) {
		
	let query = 
	'{"query": {"match": {"rule_name": "rule_cpu"}}, "post_filter": {"exists": {"field": "alert_sent"}}}';
	//query = json.stringToJsonObject(query);
	//console.log(query);
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'elastalert_*', query, function(resp) {
		
		let resultObject = json.createErrObject('0');
		let array = new Array();
		
		for(let i = 0; i < resp.hits.length; i++){
			//console.log(resp.hits[i]._source.match_body.system.cpu);
			let obj = json.createJsonObject();
			json.addValue(obj, "system", resp.hits[i]._source.match_body.system.cpu.system);
			json.addValue(obj, "user", resp.hits[i]._source.match_body.system.cpu.user);
			array.push(obj);
		}
		json.addValue(resultObject, "data", array);
		
		res.send(resultObject);
	});
});

module.exports = router;
