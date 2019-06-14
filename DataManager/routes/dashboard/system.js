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
router.get('/cpu', function(req, res, next) {
	
	//let query = '{"size":0,"query":{"match":{"metricset.name":"cpu"}},"aggs":{"group_by_hostname":{"terms":{"field":"host","size":1,"order":{"avg_usage":"asc"}},"aggs":{"avg_usage":{"avg":{"field":"system.cpu.idle.pct"}}}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	let query = '{"size":0,"query":{"match":{"metricset.name":"cpu"}},"aggs":{"group_by_hostname":{"terms":{"field":"host.name","size":1,"order":{"avg_usage":"asc"}},"aggs":{"avg_usage":{"avg":{"field":"system.cpu.idle.pct"}}}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	//console.log(query);
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'metricbeat-*', query, function(resp) {
				
		try {
			let count = resp.aggregations.group_by_hostname.buckets.length;
			let value = resp.aggregations.group_by_hostname.buckets;
			
			json.addValue(resultObj, 'data', common.queryResultArr(count, value));
		}
		catch (e) {
			console.log(e);
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
			next(resultObj);
		}
		
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
	
	//let query = '{"size":0,"query":{"match":{"metricset.name":"memory"}},"aggs":{"group_by_hostname":{"terms":{"field":"host","size":1,"order":{"avg_usage":"asc"}},"aggs":{"avg_usage":{"avg":{"field":"system.memory.used.pct"}}}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	let query = '{"size":0,"query":{"match":{"metricset.name":"memory"}},"aggs":{"group_by_hostname":{"terms":{"field":"host.name","size":1,"order":{"avg_usage":"asc"}},"aggs":{"avg_usage":{"avg":{"field":"system.memory.used.pct"}}}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'metricbeat-*', query, function(resp) {
		
		try {
			let count = resp.aggregations.group_by_hostname.buckets.length;
			let value = resp.aggregations.group_by_hostname.buckets;
			
			json.addValue(resultObj, 'data', common.queryResultArr(count, value));
		}
		catch (e) {
			console.log(e);
			json.addValue(obj, 'msg', 'No JSON Data');
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
		}
		
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
	
	//let query = '{"size":0,"aggs":{"event_per_time":{"date_histogram":{"field":"@timestamp","interval":"' + common.getInterval(req.query) + '","order":{"_key":"desc"}}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	let query = '{"size":0,"aggs":{"event_per_time":{"date_histogram":{"field":"@timestamp","interval":"' + common.getInterval(req.query) + '","order":{"_key":"desc"}}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';

	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'metricbeat-*', query, function(resp) {
		
		try {		
			let count = 10;
			let value = resp.aggregations.event_per_time.buckets;
			
			json.addValue(resultObj, 'data', common.queryResultArr(count, value));
		}
		catch (e) {
			console.log(e);
			json.addValue(obj, 'msg', 'No JSON Data');
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
		}
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
	
	//let query = '{"size":0,"aggs":{"group_by_eventname":{"terms":{"field":"metricset.name"}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	let query = '{"size":0,"aggs":{"group_by_eventname":{"terms":{"field":"metricset.name"}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'metricbeat-*', query, function(resp) {
		
		try {
			let count = resp.aggregations.group_by_eventname.buckets.length;
			let value = resp.aggregations.group_by_eventname.buckets;
			
			json.addValue(resultObj, 'data', common.queryResultArr(count, value));
		}
		catch (e) {
			console.log(e);
			json.addValue(obj, 'msg', 'No JSON Data');
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
		}
		
		res.send(resultObj);
	});
});

/**
 * 		GET 호스트 별 도커 정보
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/dockerConPerHost', function(req, res, body) {
	
	//let query = '{"size":0,"query":{"match_all":{}},"aggs":{"alert_per_time":{"terms":{"field":"beat.hostname","order":{"_count":"desc"},"size":5},"aggs":{"count":{"cardinality":{"field":"docker.container.id"}}}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	let query = '{"size":0,"query":{"match_all":{}},"aggs":{"alert_per_time":{"terms":{"field":"beat.name","order":{"_count":"desc"},"size":5},"aggs":{"count":{"cardinality":{"field":"docker.container.id"}}}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';

	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	console.log(query);
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'metricbeat-*', query, function(resp) {
		
		try {
			let count = resp.aggregations.alert_per_time.buckets.length;
			let value = resp.aggregations.alert_per_time.buckets;
			
			let arr = new Array();
			for(let i = 0; i < count; i++) {
				
				if(value[i] != null) {
					
					let tmp = json.createJsonObject();
					json.addValue(tmp, 'key', value[i].key);
					json.addValue(tmp, 'count', value[i].count.value);
					
					arr.push(tmp);
				}
			}
			
			json.addValue(resultObj, 'data', arr);
		}
		catch (e) {
			console.log(e);
			json.addValue(obj, 'msg', 'No JSON Data');
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
		}
		
		res.send(resultObj);
	});
});

/**
 * 		GET 도커 컨테이너 리스트
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/dockerCon', function(req, res, body) {
	
	//let query = '{"size":0,"query":{"match_all":{}},"aggs":{"name":{"terms":{"field":"docker.container.name","size":5,"order":{"_count":"desc"}},"aggs":{"cpu":{"max":{"field":"docker.cpu.total.pct"}},"disk":{"max":{"field":"docker.diskio.total"}},"memory":{"max":{"field":"docker.memory.usage.pct"}},"number_of_Containers":{"cardinality":{"field":"docker.container.id"}}}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	let query = '{"size":0,"query":{"match_all":{}},"aggs":{"name":{"terms":{"field":"docker.container.name","size":5,"order":{"_count":"desc"}},"aggs":{"cpu":{"max":{"field":"docker.cpu.total.pct"}},"disk":{"max":{"field":"docker.diskio.total"}},"memory":{"max":{"field":"docker.memory.usage.pct"}},"number_of_Containers":{"cardinality":{"field":"docker.container.id"}}}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';

	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	console.log(query);
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'metricbeat-*', query, function(resp) {
		
		try {
			let count = resp.aggregations.name.buckets.length;
			let value = resp.aggregations.name.buckets;
			
			let arr = new Array();
			for(let i = 0; i < count; i++) {
				
				if(value[i] != null) {
					
					let tmp = json.createJsonObject();
					json.addValue(tmp, 'key', value[i].key);
					json.addValue(tmp, 'cpu', value[i].cpu.value);
					json.addValue(tmp, 'disk', value[i].disk.value);
					json.addValue(tmp, 'memory', value[i].memory.value);
					json.addValue(tmp, 'count', value[i].number_of_Containers.value);
					
					arr.push(tmp);
				}
			}
			
			json.addValue(resultObj, 'data', arr);
		}
		catch (e) {
			console.log(e);
			json.addValue(obj, 'msg', 'No JSON Data');
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
		}
		
		res.send(resultObj);
	});
});

module.exports = router;