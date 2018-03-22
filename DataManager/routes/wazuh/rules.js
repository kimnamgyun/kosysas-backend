var express = require('express');
var router = express.Router();
var request = require('request');
var wazuh = require('../../service/es/functions/wazuh.js');
var json = require('../../service/utils/json.js');

var id = "foo";
var pw = "bar";
var host = "192.168.0.113:55000";

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
 * GET all rules
 * return all rules
 */
router.get('/', function(req, res, next) {
	
	wazuh.get(id, pw, host, '/rules?pretty', function (err, resp) {
		
		callback(res, err, resp);
	});  
});

/* 
 * GET files of rules
 * return files of rules
 */
/*
router.get('/files', function(req, res, next) {
	
	wazuh.get(id, pw, host, '/rules/files?pretty', function (err, resp) {
		
		//console.log(err);
		//console.log(resp);
		
		if(err) {
			res.send(err);
		}
		
		res.send(resp);
	});  
});

/* 
 * GET rule groups
 * return rule groups
 */
router.get('/groups', function(req, res, next) {
	
	wazuh.get(id, pw, host, '/rules/groups?pretty', function (err, resp) {
		
		callback(res, err, resp);
	});  
});

/* 
 * GET rule pci requirements
 * return PCI requirements of all rules
 */
router.get('/pci', function(req, res, next) {
	
	wazuh.get(id, pw, host, '/rules/pci?pretty', function (err, resp) {
		
		callback(res, err, resp);
	});  
});

/* 
 * GET rules by id
 * return rules with the specified id
 */
router.get('/:rule_id', function(req, res, next) {
	
	wazuh.get(id, pw, host, '/rules/' + req.params.rule_id + '?pretty', function (err, resp) {
		
		callback(res, err, resp);
	});  
});

module.exports = router;