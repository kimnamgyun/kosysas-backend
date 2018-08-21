var express = require('express');
var router = express.Router();
var request = require('request');
var json = require('../../service/utils/json.js');
var wazuh = require('../../service/es/functions/wazuh.js');
var common = require('../common.js');

/**
 * 		callback 처리 함수
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
 * GET manager configuration 
 * return ossec.conf
 */
router.get('/configuration', function(req, res, next) {
	
	wazuh.get('/manager/configuration?pretty', function (err, resp) {
		
		common.setHeader(res);
		callback(res, err, resp);
	});  
});

/* 
 * GET manager info 
 * return basic information
 */
router.get('/info', function(req, res, next) {
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	wazuh.get('/manager/info?pretty', function (err, resp) {
			
		common.setHeader(res);
		
		try {
			let value = resp.data;
			
			json.addValue(obj, 'type', value.type);
			json.addValue(obj, 'max_agents', value.max_agents);
			json.addValue(obj, 'rule_version', value.ruleset_version);
			json.addValue(obj, 'openssl', value.openssl_support);
			json.addValue(obj, 'version', value.version);
			
			json.addValue(resultObj, 'data', obj);
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
 * GET manager status 
 * return status of manager processes
 */
router.get('/status', function(req, res, next) {
	
	wazuh.get('/manager/status?pretty', function (err, resp) {
		
		common.setHeader(res);
		callback(res, err, resp);
	});  
});

/* 
 * GET manager logs 
 * return three last months of logs
 */
router.get('/logs', function(req, res, next) {
	
	wazuh.get('/manager/logs?pretty', function (err, resp) {
		
		common.setHeader(res);
		callback(res, err, resp);
	});  
});

/* 
 * GET manager logs summary
 * return summary of three last months of logs
 */
router.get('/logs/summary', function(req, res, next) {
	
	wazuh.get('/manager/logs/summary?pretty', function (err, resp) {
		
		common.setHeader(res);
		callback(res, err, resp);
	});  
});

/* 
 * GET manager stats 
 * return wazuh statistical info
 */
router.get('/stats', function(req, res, next) {
	
	wazuh.get('/manager/stats?pretty', function (err, resp) {
		
		//console.log(err);
		//console.log(resp);
		common.setHeader(res);
		
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
	});  
});

/* 
 * GET manager stats by hour
 * return wazuh statistical info by hour
 */
router.get('/stats/hourly', function(req, res, next) {
	
	wazuh.get('/manager/stats/hourly?pretty', function (err, resp) {
		
		//console.log(err);
		//console.log(resp);
		common.setHeader(res);
		
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
	});  
});

/* 
 * GET manager stats by weekly
 * return wazuh statistical info by weekly
 */
router.get('/stats/weekly', function(req, res, next) {
	
	wazuh.get('/manager/stats/weekly?pretty', function (err, resp) {
		
		//console.log(err);
		//console.log(resp);
		common.setHeader(res);
		
		if(resp) {
			
			let resultObject = json.createErrObject('0');
			json.addValue(resultObject, 'data', json.getValue(resp, 'data'));
			
			res.send(resultObject);
		}
		else {
			
			res.send(err);
		}
	});  
});

module.exports = router;