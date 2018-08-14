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
	
	let query = '{"size":0,"post_filter":{' + common.getTimeRange(req.query) + '}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alerts-*', query, function(resp) {
		
		let count;
		try {
			count = resp.hits.total;
			json.addValue(obj, 'count', count);
		}
		catch (e) {
			//console.log(e);
			json.addValue(obj, 'msg', 'No JSON Data');
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
		}
				
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
	
	let query = '{"size":0,"post_filter":{' + common.getTimeRange(req.query) + '},"query":{"match":{"rule.level":"12"}}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alerts-*', query, function(resp) {
		
		let count;
		try {
			count = resp.hits.total;
			json.addValue(obj, 'count', count);
		}
		catch (e) {
			//console.log(e);
			json.addValue(obj, 'msg', 'No JSON Data');
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
		}
				
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
	
	let query = '{"size":0,"post_filter":{' + common.getTimeRange(req.query) + '},"query":{"bool":{"must":[{"match":{"decoder.name":"sshd"}},{"match":{"rule.id":"5716"}}]}}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alerts-*', query, function(resp) {
		
		let count;
		try {
			count = resp.hits.total;
			json.addValue(obj, 'count', count);
		}
		catch (e) {
			//console.log(e);
			json.addValue(obj, 'msg', 'No JSON Data');
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
		}
				
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
	
	let query = '{"size":0,"post_filter":{' + common.getTimeRange(req.query) + '},"query":{"bool":{"must":[{"match":{"decoder.name":"sshd"}},{"match":{"rule.id":"5715"}}]}}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alerts-*', query, function(resp) {
		
		let count;
		try {
			count = resp.hits.total;
			json.addValue(obj, 'count', count);
		}
		catch (e) {
			//console.log(e);
			json.addValue(obj, 'msg', 'No JSON Data');
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
		}
				
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
	
	let query = '{"size":0,"post_filter":{' + common.getTimeRange(req.query) + '},"aggs":{"alertCount_per_manager":{"terms":{"field":"manager.name","size":10}}}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alerts-*', query, function(resp) {
		
		try {
			let count = resp.aggregations.alertCount_per_manager.buckets.length;
			let value = resp.aggregations.alertCount_per_manager.buckets;
			let result = new Array();
			
			for(let i = 0; i < count; i++){
				
				let temp = value[i];
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
	});
});

/**
 * 		시그니처 별 침입탐지 로그 수
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/alertPerSignature', function(req, res, body) {
	
	let query = '{"size":0,"aggs":{"count_per_signature":{"terms":{"field":"rule.description","size":10}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alerts-*', query, function(resp) {
		
		try {
			let count = resp.aggregations.count_per_signature.buckets.length;
			let value = resp.aggregations.count_per_signature.buckets;
			let result = new Array();
			
			for(let i = 0; i < count; i++){
				
				let temp = value[i];
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
	});
});

/**
 * 		일반항목 침입탐지
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/threatBasic', function(req, res, body) {
	
	// rule.id
	// rule.description
	// rule.levelr
	let query = '{"size":0,"aggs":{"id":{"terms":{"field":"rule.id","size":5},"aggs":{"description":{"terms":{"field":"rule.description","size":1},"aggs":{"level":{"terms":{"field":"rule.level","size":1}}}}}}},"query":{"terms":{"rule.groups":["ossec","wazuh","syslog"]}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alerts-*', query, function(resp) {
		
		try {
			let count = resp.aggregations.id.buckets.length;
			let value = resp.aggregations.id.buckets;
			let result = new Array();
			
			for(let i = 0; i < count; i++){
				
				let temp = json.createJsonObject();
				json.addValue(temp, 'id', value[i].key);
				json.addValue(temp, 'description', value[i].description.buckets[0].key);
				json.addValue(temp, 'level', value[i].description.buckets[0].level.buckets[0].key);
				json.addValue(temp, 'count', value[i].doc_count);
				
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
	});
});

/**
 * 		파일 무결성 침입탐지
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/threatFile', function(req, res, body) {
	
	let query = '{"size":0,"aggs":{"id":{"terms":{"field":"rule.id","size":5},"aggs":{"description":{"terms":{"field":"rule.description","size":1},"aggs":{"level":{"terms":{"field":"rule.level","size":1}}}}}}},"query":{"bool":{"should":[{"bool":{"must":[{"term":{"rule.groups":{"value":"ossec"}}},{"term":{"rule.groups":{"value":"syscheck"}}}]}}]}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alerts-*', query, function(resp) {
		
		try {
			let count = resp.aggregations.id.buckets.length;
			let value = resp.aggregations.id.buckets;
			let result = new Array();
			
			for(let i = 0; i < count; i++){
				
				let temp = json.createJsonObject();
				json.addValue(temp, 'id', value[i].key);
				json.addValue(temp, 'description', value[i].description.buckets[0].key);
				json.addValue(temp, 'level', value[i].description.buckets[0].level.buckets[0].key);
				json.addValue(temp, 'count', value[i].doc_count);
				
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
	});
});

/**
 * 		에이전트 항목 침입탐지
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/threatAgent', function(req, res, body) {
	
	let query = '{"size":0,"aggs":{"id":{"terms":{"field":"rule.id","size":5},"aggs":{"description":{"terms":{"field":"rule.description","size":1},"aggs":{"level":{"terms":{"field":"rule.level","size":1}}}}}}},"query":{"bool":{"should":[{"terms":{"rule.id":["501","502","503","504"]}},{"terms":{"rule.id":["201","202","203","204","205"]}}]}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alerts-*', query, function(resp) {
		
		try {
			let count = resp.aggregations.id.buckets.length;
			let value = resp.aggregations.id.buckets;
			let result = new Array();
			
			for(let i = 0; i < count; i++){
				
				let temp = json.createJsonObject();
				json.addValue(temp, 'id', value[i].key);
				json.addValue(temp, 'description', value[i].description.buckets[0].key);
				json.addValue(temp, 'level', value[i].description.buckets[0].level.buckets[0].key);
				json.addValue(temp, 'count', value[i].doc_count);
				
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
	});
});

module.exports = router;