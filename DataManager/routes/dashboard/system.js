/**
 * 		system.js
 * 		/dashboard/system/
 * 		20180705 정종원
 */

var express = require('express');
var router = express.Router();
var client = require('../../service/es/elasticsearch.js');
var searchFunctions = require('../../service/es/functions/search.js');
var json = require('../../service/utils/json.js');
var common = require('../common.js');

/**
 * 		GET CPU 사용량 Top 
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/cpu', function(req, res, body) {
	
	let query = '{"size":0,"query":{"match":{"metricset.name":"cpu"}},"aggs":{"group_by_hostname":{"terms":{"field":"host","size":1,"order":{"avg_usage":"asc"}},"aggs":{"avg_usage":{"avg":{"field":"system.cpu.idle.pct"}}}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	let resultObj = json.createErrObject('0');
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'metricbeat-*', query, function(resp) {
		
		let count = resp.aggregations.group_by_hostname.buckets.length;
		let value = resp.aggregations.group_by_hostname.buckets;
		let arr = new Array();
		
		for(let i = 0; i < count; i++) {
			
			arr.push(value[i]);
		}
		
		json.addValue(resultObj, 'data', arr);
		res.send(resultObj);
	});
});

/**
 * 		GET Memory 사용량 Top 
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/memory', function(req, res, body) {
	
	let query = '{"size":0,"query":{"match":{"metricset.name":"memory"}},"aggs":{"group_by_hostname":{"terms":{"field":"host","size":1,"order":{"avg_usage":"asc"}},"aggs":{"avg_usage":{"avg":{"field":"system.memory.used.pct"}}}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'metricbeat-*', query, function(resp) {
		
		let count = resp.aggregations.group_by_hostname.buckets.length;
		let value = resp.aggregations.group_by_hostname.buckets;
		let arr = new Array();
		
		for(let i = 0; i < count; i++) {
			
			arr.push(value[i]);
		}
		
		json.addValue(resultObj, 'data', arr);
		res.send(resultObj);
	});
});

/**
 * 		GET 이벤트 발생
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/eventPerTime', function(req, res, body) {
	
	let query = '{"size":0,"aggs":{"event_per_time":{"date_histogram":{"field":"@timestamp","interval":"hour","order":{"_key":"desc"}}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'metricbeat-*', query, function(resp) {
		
		let count = 10;//resp.aggregations.group_by_hostname.buckets.length;
		let value = resp.aggregations.event_per_time.buckets;
		let arr = new Array();
		
		for(let i = 0; i < count; i++) {
			
			arr.push(value[i]);
		}
		
		json.addValue(resultObj, 'data', arr);
		res.send(resultObj);
	});
})


/**
 * 		GET 카테고리 별 이벤트 발생
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/eventCountPerCategory', function(req, res, body) {
	
	let query = '{"size":0,"aggs":{"group_by_eventname":{"terms":{"field":"metricset.name"}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'metricbeat-*', query, function(resp) {
		
		let count = resp.aggregations.group_by_eventname.buckets.length;
		let value = resp.aggregations.group_by_eventname.buckets;
		let arr = new Array();
		
		for(let i = 0; i < count; i++) {
			
			arr.push(value[i]);
		}
		
		json.addValue(resultObj, 'data', arr);
		res.send(resultObj);
	});
});

module.exports = router;