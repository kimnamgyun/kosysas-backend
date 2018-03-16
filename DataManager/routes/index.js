var express = require('express');
var router = express.Router();
var client = require('../service/es/elasticsearch.js');
var searchFunctions = require('../service/es/functions/search.js');
var jsonFunctions = require('../service/utils/json.js');
var cerebro = require('../service/es/functions/cerebro.js');
var async = require('async');

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
	
	let host = 'http://192.168.0.203:9200';
	let aliases;
	let allocation;
	let count;
	let fieldData;
	let health;
	let indices;
	let master;
	let nodeattrs;
	let nodes;
	let pendingTasks;
	let plugins;
	let recovery;
	let repositories;
	let threadPool;
	let shards;
	let segments;
	
	cerebro.cat(host, 'aliases', function(err, resp){
		aliases = resp;
	});
	cerebro.cat(host, 'allocation', function(err, resp){
		allocation = resp;
	});
	cerebro.cat(host, 'count', function(err, resp){
		count = resp;
	});
	cerebro.cat(host, 'fielddata', function(err, resp){
		fieldData = resp;
	});
	cerebro.cat(host, 'health', function(err, resp){
		health = resp;
	});
	cerebro.cat(host, 'indices', function(err, resp){
		indices = resp;
	});
	cerebro.cat(host, 'master', function(err, resp){
		master = resp;
	});
	cerebro.cat(host, 'nodeattrs', function(err, resp){
		nodeattrs = resp;
	});
	cerebro.cat(host, 'nodes', function(err, resp){
		nodes = resp;
	});
	cerebro.cat(host, 'pendingTasks', function(err, resp){
		pendingTasks = resp;
	});
	cerebro.cat(host, 'plugins', function(err, resp){
		plugins = resp;
	});
	cerebro.cat(host, 'recovery', function(err, resp){
		recovery = resp;
	});
	cerebro.cat(host, 'repositories', function(err, resp){
		repositories = resp;
	});
	cerebro.cat(host, 'threadPool', function(err, resp){
		threadPool = resp;
	});
	cerebro.cat(host, 'shards', function(err, resp){
		shards = resp;
		console.log(shards.length);
	});
	cerebro.cat(host, 'segments', function(err, resp){
		segments = resp;
	});
	
	/*
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
	*/
});

/**
 * 	/cerebro/overview
 * @param req
 * @param res
 * @param next
 * @returns		overview jsonObject Data
 */
router.get('/cerebro/overview', function(req, res, next) {
	
	let host = 'http://192.168.0.203:9200';
	
	let nodes;
	let indices;
	let count;
	let shards;
	let allocation;
	
	async.waterfall([
		function(cb) {
			cerebro.cat(host, 'count', function(err, resp){
				count = resp;
				cb(null);
			});
		},
		function(cb) {
			cerebro.cat(host, 'nodes', function(err, resp){
				nodes = resp;
				cb(null);
			});
		},		
		function(cb) {
			cerebro.cat(host, 'indices', function(err, resp){
				indices = resp;
				cb(null);
			});
		},
		function(cb) {
			cerebro.cat(host, 'shards', function(err, resp){
				shards = resp;
				cb(null);
			});
		},
		function(cb) {
			cerebro.cat(host, 'allocation', function(err, resp){
				allocation = resp;
				cb(null);
			});
		},
		function(err) {			
			let resultObject = "{}";
			resultObject = jsonFunctions.stringToJsonObject(resultObject);
						
			jsonFunctions.addValue(resultObject, "node", nodes.length);
			jsonFunctions.addValue(resultObject, "indices", indices.length);
			jsonFunctions.addValue(resultObject, "shards", shards.length);
			jsonFunctions.addValue(resultObject, "docs", count[0].count);
			jsonFunctions.addValue(resultObject, "disk", allocation[0]['disk.indices']);
			
			console.log(resultObject);
			res.send(resultObject);
		}
	]);		
	
	//res.render("cerebro", {});
});

/**
 * 	/cerebro/nodes
 * @param req
 * @param res
 * @param next
 * @returns	node data ojbect
 */
router.get('/cerebro/nodes', function(req, res, next) {
	
	let host = 'http://192.168.0.203:9200';
	
	let allocation;
	let nodes;
	
	async.waterfall([
		function(cb) {
			cerebro.cat(host, 'allocation', function(err, resp){
				allocation = resp;
				cb(null);
			});
		},
		function(cb) {
			cerebro.cat(host, 'nodes', function(err, resp){
				nodes = resp;
				cb(null);
			});
		},
		function(err) {
			if(err) console.log(err);
			
			let resultObejct = "{}";
		}
	]);
});

module.exports = router;
