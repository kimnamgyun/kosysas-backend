var express = require('express');
var router = express.Router();
var request = require('request');
var wazuh = require('../../service/es/functions/wazuh.js');

var id = "foo";
var pw = "bar";
var host = "192.168.0.110:55000";

/* 
 * GET all agent
 * return list of all agent
 */
router.get('/', function(req, res, next) {
	
	wazuh.get(id, pw, host, '/agents?pretty', function (err, resp) {
		
		//console.log(err);
		//console.log(resp);
		
		if(err) {
			res.send(err);
		}
		
		res.send(resp);
	});  
});

/* 
 * GET agent
 * return info of agent
 */
router.get('/:agent_id', function(req, res, next) {
	
	wazuh.get(id, pw, host, '/agents/' + req.params.agent_id + '?pretty', function (err, resp) {
		
		//console.log(err);
		//console.log(resp);
		
		if(err) {
			res.send(err);
		}
		
		res.send(resp);
	});  
});

/* 
 * GET agent by name
 * return info of agent by name
 */
router.get('/name/:agent_name', function(req, res, next) {
	
	console.log(req.params.agent_name);
	wazuh.get(id, pw, host, '/agents/name/ ' + req.params.agent_name + '?pretty', function (err, resp) {
		
		//console.log(err);
		//console.log(resp);
		
		if(err) {
			res.send(err);
		}
		
		res.send(resp);
	});  
});

/* 
 * GET list of purgeable agents
 * return list of agents can be purged
 */
router.get('/purgeable/:timeframe', function(req, res, next) {
	
	wazuh.get(id, pw, host, '/pugeable/' + req.params.timeframe + '?pretty', function (err, resp) {
		
		//console.log(err);
		//console.log(resp);
		
		if(err) {
			res.send(err);
		}
		
		res.send(resp);
	});  
});

/* 
 * GET agent key
 * return key of agent
 */
router.get('/:agent_id/key', function(req, res, next) {
	
	wazuh.get(id, pw, host, '/agents/' + req.params.agent_id + '/key?pretty', function (err, resp) {
		
		//console.log(err);
		//console.log(resp);
		
		if(err) {
			res.send(err);
		}
		
		res.send(resp);
	});  
});


module.exports = router;