/**
 * 		개요
 * 		20180417 정종원
 * 
 */
var express = require('express');
var router = express.Router();
var client = require('../../service/es/elasticsearch.js');
var searchFunctions = require('../../service/es/functions/search.js');
var json = require('../../service/utils/json.js');
var common = require('../common.js');
var async = require('async');


/**
 * 		분석 : 알람 개수 ( elastalert_status count )
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/analysisAlertCount', function(req, res, body) {
	
	let wQuery = '{"size":0,"query":{"match_all":{}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);	
	searchFunctions.freeQuery(client, 'elastalert_status', wQuery, function(resp) {
		
		try {
			let value = resp.hits.total;		
			json.addValue(obj, 'alertCount', value);
		}
		catch (e) {
			console.log(e);
			json.addValue(obj, 'msg', 'No JSON Data');
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
		}

		json.addValue(resultObj, 'data', obj);
		res.send(resultObj);
	});
});

/**
 * 		분석 : 시간별 알람 개수 ( elastalert_status count )
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/analysisAlertCountPerTime', function(req, res, body) {

	let wQuery = '{"size":0,"query":{"match_all":{}},"aggs":{"alert_per_time":{"date_histogram":{"field":"@timestamp","interval":"' + common.getInterval(req.query) + '","order":{"_key":"desc"}}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'elastalert_status', wQuery, function(resp) {
		
		try {
			let count = resp.aggregations.alert_per_time.buckets.length;
			let value = resp.aggregations.alert_per_time.buckets;
			
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
 * 		침입탐지 : Top 5 에이전트
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/threatTop5Agent', function(req, res, body) {
	
	// field : name 이용해서 Top 5 쿼리 짤 것
	let query = '{"size":0,"aggs":{"threat_agent":{"terms":{"field":"name","size":5}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	//console.log(query);
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alerts-*', query, function(resp) {
		
		try {
			let count = resp.aggregations.threat_agent.buckets.length;
			let value = resp.aggregations.threat_agent.buckets;
			
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
 * 		침입탐지 : 시간 별 알람 개수 ( Wazuh Alert )
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/threatAlertCountPerTime', function(req, res, body) {
	
	let wQuery = '{"size":0,"query":{' + common.getTimeRange(req.query) + '},"aggs":{"alert_per_time":{"date_histogram":{"field":"@timestamp","interval":"' + common.getInterval(req.query) + '","order":{"_key":"desc"}}}}}';
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alerts-*', wQuery, function(resp) {
		
		try {
			let count = resp.aggregations.alert_per_time.buckets.length;
			let value = resp.aggregations.alert_per_time.buckets;
			
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


// -------------------------------------------------------------------- 안씀

/*
 * 	GET disk usage
 */
router.get('/disk', function(req, res, body) {
	
	let query = '{"query":{"match":{"metricset.name":"filesystem"}},"size":1,"sort":[{"@timestamp":{"order":"desc"}}]}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'metricbeat-*', query, function(resp) {
		
		let value = resp.hits.hits[0]._source.system.filesystem.used.pct;
		if(value == undefined || value == null) {
			
			json.editValue(resultObj, 'error', '002');
			json.addValue(obj, 'disk', '0');
		}
		else {
		
			json.addValue(obj, 'disk', value);
		}
		
		json.addValue(resultObj, 'data', obj);
		res.send(resultObj);
	});
});

/*
 *	GET Log index Top 5
 */
router.get('/logIdxTopHit', function(req, res, body) {
	
	// size = 0 : 해당 index 의 내용은 필요없고, 단순하 갯수만 필요하다
	// size = 5 : Top 5
	let query = '{"size":0,"aggs":{"group_by_state":{"terms":{"field":"_index","size":5}}}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, '*', query, function(resp) {
		
		let value = resp.aggregations.group_by_state.buckets;
		if(value == undefined || value == null) {
			
			json.editValue(resultObj, 'error', '002');
			json.addValue(obj, 'logIdxTopHit', '0');
		}
		else {
			
			json.addValue(obj, 'logIdxTopHit', value);
		}
		
		json.addValue(resultObj, 'data', obj);
		res.send(resultObj);
	});
});

/*
 * 	GET Source IP Top 5
 */
router.get('/sourceIPTopHit', function(req, res, body) {
	
	let query = '{"size":0,"aggs":{"group_by_state":{"terms":{"field":"ip","size":5}}}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, '*', query, function(resp) {
		
		let value = resp.aggregations.group_by_state.buckets;
		if(value == undefined || value == null) {
			
			json.editValue(resultObj, 'error', '002');
			json.addValue(obj, 'sourceIPTopHit', '0');
		}
		else {
			
			json.addValue(obj, 'sourceIPTopHit', value);
		}
		
		json.addValue(resultObj, 'data', obj);
		res.send(resultObj);
	});
});

/**
 * 		GET Metric 알람
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/alertMetricCount', function(req, res, body) {
	
});

/**
 * 		GET 침입탐지 : 12 레벨 알람
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/alertLevelCount', function(req, res, body) {
	
	let query = '{"query":{"term":{"rule.level":{"value":"12"}}}}';
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'wazuh-alert-*', query, function(resp) {
		
		let value = (resp.hits.total * 1);
		
		if(value == undefined || value == null) {
			
			json.editValue(resultObj, 'error', '002');
			json.addValue(obj, 'alertLevelCount', '0');
		}
		else {
		
			json.addValue(obj, 'alertLevelCount', value);
		}
		
		json.addValue(resultObj, 'data', obj);
		res.send(resultObj);		
	});
});

module.exports = router;