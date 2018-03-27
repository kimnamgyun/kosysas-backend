var express = require('express');
var router = express.Router();
var request = require('request');
var wazuh = require('../../service/es/functions/wazuh.js');
var json = require('../../service/utils/json.js');

var id = "foo";
var pw = "bar";
var host = "192.168.0.113:55000";

/*
 * 	callback 처리 함수
 */
function callback(res, err, resp) {

	//console.log(err);
	//console.log(resp);
	if(resp) {
		
		let resultObject = json.createErrObject('0');
		let temp = json.getValue(resp, 'data');
		if(temp) { 
			json.addValue(resultObject, 'data', temp);
		}
		else {
			json.editValue(resultObject, 'error', '002');
		}
		
		res.send(resultObject);
	}
	else {
		
		res.send(err);
	}
}

/* 
 * GET all agent
 * return list of all agent
 */
router.get('/', function(req, res, next) {
	
	wazuh.get(id, pw, host, '/agents?pretty', function (err, resp) { 
		
		callback(res, err, resp);
	});  
});

/* 
 * GET agent
 * return info of agent
 */
router.get('/:agent_id', function(req, res, next) {
	
	wazuh.get(id, pw, host, '/agents/' + req.params.agent_id + '?pretty', function (err, resp) {
		
		callback(res, err, resp);
	});  
});

/* 
 * GET agent by name
 * return info of agent by name
 */
router.get('/name/:agent_name', function(req, res, next) {
	
	wazuh.get(id, pw, host, '/agents/name/' + req.params.agent_name + '?pretty', function (err, resp) {
		
		callback(res, err, resp);
	});  
});

/* 
 * GET list of purgeable agents
 * return list of agents can be purged
 */
router.get('/purgeable/:timeframe', function(req, res, next) {
	
	wazuh.get(id, pw, host, '/agents/purgeable/' + req.params.timeframe + '?pretty', function (err, resp) {
		
		callback(res, err, resp);
	});  
});

/* 
 * GET agent key
 * return key of agent
 */
router.get('/:agent_id/key', function(req, res, next) {
	
	wazuh.get(id, pw, host, '/agents/' + req.params.agent_id + '/key?pretty', function (err, resp) {
		
		callback(res, err, resp);
	});  
});

module.exports = router;