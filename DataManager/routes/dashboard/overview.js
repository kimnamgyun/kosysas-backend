/**
 * 		Dashboard.js
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


/*
 * 	GET elastalert count + wazuh alert count
 */
router.get('/alertCount', function(req, res, body) {
	
	let eaQuery = '{"query":{"match_all":{}}}';
	let wQuery = '{"query":{"match_all":{}}}';
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	async.waterfall([
		function(cb) {
			searchFunctions.freeQuery(client, 'wazuh-alerts-*', wQuery, function(resp) {
				
				let value = json.getValue(resp.hits, 'total');
				if(value == undefined || value == null) {
					json.editValue(resultObj, 'err', '002');
					json.addValue(obj, 'wazuh_count', '0');
				}
				else {
					json.addValue(obj, 'wazuh_count', value);
				}
				cb(null);
			});
		},
		function(cb) {
			searchFunctions.freeQuery(client, 'elastalert_status', wQuery, function(resp) {
				
				let value = json.getValue(resp.hits, 'total');
				if(value == undefined || value == null) {
					json.editValue(resultObj, 'error', '002');
					json.addValue(obj, 'elastalert_count', '0');
				}
				else {
					json.addValue(obj, 'elastalert_count', value);
				}
				cb(null);
			});			
		},
		function(cb) {
			
			json.addValue(resultObj, 'data', obj);
			res.send(resultObj);
			
			cb(null);
		}
	]);	
});



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

router.get('/authFailed', function(req, res, body) {
	
});

router.get('/authSuccess', function(req, res, body) {
	
});


router.get('/agentTopHit', function(req, res, bdoy) {
	
});

module.exports = router;