/**
 * 
 * 		침입탐지
 * 		/dashboard/intrusion
 * 		20180523 정종원
 */

var express = require('express');
var router = express.Router();
var client = require('../../service/es/elasticsearch.js');
var searchFunctions = require('../../service/es/functions/search.js');
var json = require('../../service/utils/json.js');
var common = require('../common.js');

/**
 * 		Metric 알람
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/metricCount', function(req, res, body) {
	
	let query = '{"size":0,"post_filter":{"range":{"@timestamp":{"gte":"now-1y","lte":"now"}}}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alerts-*', query, function(resp) {
		
		let value = resp.hits.total;
		json.addValue(obj, 'count', value);
		json.addValue(resultObj, 'data', obj);
		res.send(resultObj);
	});
});

/**
 * 		12등급 알람
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/lv12Count', function(req, res, body) {
	
	let query = '{"size":0,"post_filter":{"range":{"@timestamp":{"gte":"now-1y","lte":"now"}}},"query":{"match":{"rule.level":"12"}}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alerts-*', query, function(resp) {
		
		let value = resp.hits.total;
		json.addValue(obj, 'count', value);
		json.addValue(resultObj, 'data', obj);
		res.send(resultObj);
	});
});

/**
 * 		인증 실패
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/authFailed', function(req, res, body) {
	
	let query = '{"size":0,"post_filter":{"range":{"@timestamp":{"gte":"now-1y","lte":"now"}}},"query":{"bool":{"must":[{"match":{"decoder.name":"sshd"}},{"match":{"rule.id":"5716"}}]}}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alerts-*', query, function(resp) {
		
		let value = resp.hits.total;
		json.addValue(obj, 'count', value);
		json.addValue(resultObj, 'data', obj);
		res.send(resultObj);
	});
});

/**
 * 		인증 성공
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/authSuccess', function(req, res, body) {
	
	let query = '{"size":0,"post_filter":{"range":{"@timestamp":{"gte":"now-1y","lte":"now"}}},"query":{"bool":{"must":[{"match":{"decoder.name":"sshd"}},{"match":{"rule.id":"5715"}}]}}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alerts-*', query, function(resp) {
		
		let value = resp.hits.total;
		json.addValue(obj, 'count', value);
		json.addValue(resultObj, 'data', obj);
		res.send(resultObj);
	});
});

/**
 * 		매니져별 전체 알람
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/alertPerManager', function(req, res, body) {
	
	let query = '{"size":0,"post_filter":{"range":{"@timestamp":{"gte":"now-1y","lte":"now"}}},"aggs":{"alertCount_per_manager":{"terms":{"field":"manager.name","size":10}}}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alerts-*', query, function(resp) {
		
		let value = resp.hits.total;
		json.addValue(obj, 'count', value);
		json.addValue(resultObj, 'data', obj);
		res.send(resultObj);
	});
});

module.exports = router;