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

router.get('/', function(req, res, body) {
	
	res.render('index', { title: 'elasticsearch' });
});

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
 * 	GET CPU usage
 */
router.get('/cpu', function(req, res, body) {
	
	let query = '{"query":{"match":{"metricset.name":"cpu"}},"size":1,"sort":[{"@timestamp":{"order":"desc"}}]}';
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'metricbeat-*', query, function(resp) {
		
		let uPct = resp.hits.hits[0]._source.system.cpu.user.pct;
		let sPct = resp.hits.hits[0]._source.system.cpu.system.pct;
		let nPct = resp.hits.hits[0]._source.system.cpu.nice.pct;
		
		//console.log(resp.hits[0]._source.system.cpu);
		// 하나라도 undefined면 에러
		if(uPct == undefined || sPct == undefined || nPct == undefined) {
			
			json.editValue(resultObj, 'error', '002');
			json.addValue(obj, 'cpu', '0');
		}
		else {
			//console.log(uPct, sPct, nPct);
			json.addValue(obj, 'cpu', uPct + sPct + nPct);
		}
		
		json.addValue(resultObj, 'data', obj);
		res.send(resultObj);
	});
});

/*
 * 	GET memory usage
 */
router.get('/memory', function(req, res, body) {
	
	let query = '{"query":{"match":{"metricset.name":"memory"}},"size":1,"sort":[{"@timestamp":{"order":"desc"}}]}';
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'metricbeat-*', query, function(resp) {
		
		let value = resp.hits.hits[0]._source.system.memory.used.pct;
		if(value == undefined || value == null) {
			
			json.editValue(resultObj, 'error', '002');
			json.addValue(obj, 'memory', '0');
		}
		else {
		
			json.addValue(obj, 'memory', value);
		}
		
		json.addValue(resultObj, 'data', obj);
		res.send(resultObj);
	});
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

/*
 * 	GET Group Top 5
 */
router.get('/groupTopHit', function(req, res, body) {
	
	let query = '{"size":0,"aggs":{"group_by_state":{"terms":{"field":"rule.groups","size":5}}}}';
	
	
});

module.exports = router;