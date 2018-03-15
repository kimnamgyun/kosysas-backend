var express = require('express');
var router = express.Router();
var client = require('../service/es/elasticsearch.js');
var searchFunctions = require('../service/es/functions/search.js');
var jsonFunctions = require('../service/utils/json.js');
var cerebro = require('../service/es/functions/cerebro.js');
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
	});
	cerebro.cat(host, 'segments', function(err, resp){
		segments = resp;
		
		res.render('cerebro', {
			aliases: aliases,
			allocation: allocation,
			count: count,
			//fieldData: fieldData,
			//health: health,
			//indices: indices,
			master: master,
			//nodeattrs: nodeattrs,
			//nodes: nodes,
			//pendingTasks: pendingTasks,
			//plugins: plugins,
			//recovery: recovery,
			//repositories: repositories,
			//threadPool: threadPool,
			//shards: shards,
			//segments: segments
		});
	});
		
	/*
	 * let aliases;
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
	 */
	
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

module.exports = router;
