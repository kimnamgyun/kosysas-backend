var express = require('express');
var router = express.Router();
var request = require('request');
var wazuh = require('../../service/es/functions/wazuh.js');
var json = require('../../service/utils/json.js');
var common = require('../common.js');

/*
 * 	callback 처리 함수
 */
function callback(res, err, resp) {

	//console.log(err);
	//console.log(resp.data.os);
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
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	wazuh.get('/agents?pretty', function (err, resp) { 
		
		common.setHeader(res);
		
		try {
			let count = resp.data.totalItems;
			let value = resp.data.items;
			let result = new Array();
			
			for(let i = 0; i < count; i++){
				
				let temp = json.createJsonObject();
				json.addValue(temp, 'status', value[i].status);
				json.addValue(temp, 'id', value[i].id);
				json.addValue(temp, 'name', value[i].name);
				json.addValue(temp, 'ip', value[i].ip);
				json.addValue(temp, 'system', value[i].os.platform);
				json.addValue(temp, 'version', value[i].version.split(' ')[1]);
				
				result.push(temp);
			}
			
			json.addValue(resultObj, 'data', result);
		}
		catch (e) {
			//console.log(e);
			json.addValue(obj, 'msg', 'No JSON Data');
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
		}
				
		res.send(resultObj);
		
		//callback(res, err, resp);
	});  
});

/* 
 * GET agent
 * return info of agent
 */
router.get('/:agent_id', function(req, res, next) {
	
	wazuh.get('/agents/' + req.params.agent_id + '?pretty', function (err, resp) {
		
		common.setHeader(res);
		callback(res, err, resp);
	});  
});

/* 
 * GET agent by name
 * return info of agent by name
 */
router.get('/name/:agent_name', function(req, res, next) {
	
	wazuh.get('/agents/name/' + req.params.agent_name + '?pretty', function (err, resp) {
		
		common.setHeader(res);
		callback(res, err, resp);
	});  
});

/* 
 * GET list of purgeable agents
 * return list of agents can be purged
 */
router.get('/purgeable/:timeframe', function(req, res, next) {
	
	wazuh.get('/agents/purgeable/' + req.params.timeframe + '?pretty', function (err, resp) {
		
		common.setHeader(res);
		callback(res, err, resp);
	});  
});

/* 
 * GET agent key
 * return key of agent
 */
router.get('/:agent_id/key', function(req, res, next) {
	
	wazuh.get('/agents/' + req.params.agent_id + '/key?pretty', function (err, resp) {
		
		common.setHeader(res);
		callback(res, err, resp);
	});  
});

module.exports = router;