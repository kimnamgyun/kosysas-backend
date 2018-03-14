var express = require('express');
var router = express.Router();
var client = require('../service/es/elasticsearch.js');
var searchFunctions = require('../service/es/functions/search.js');
var jsonFunctions = require('../service/utils/json.js');
var request = require('request');

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


router.get('/cerebro', function(req, res, next) {
	
	var aliases;
	var allocation;
	var count;
	var fieldData;
	var health;
	var indices;
	var master;
	var nodeattrs;
	var nodes;
	var pendingTasks;
	var plugins;
	var recovery;
	var repositories;
	var threadPool;
	var shards;
	var segments;
	request.get({
		url: 'http://192.168.0.203:9200/_cat/master?format=json'
	}, function(err, response, body) {
		//res.render('cerebro', {title: err, body: response.body});
		master = response.body;
		console.log(response.body);		
	});	
	
	request.get({
		url: 'http://192.168.0.203:9200/_cat/health?format=json'
	}, function(err, response, body) {
		res.render('cerebro', {body: master, body2: response.body});
		console.log(response.body);		
	});	
});

module.exports = router;
