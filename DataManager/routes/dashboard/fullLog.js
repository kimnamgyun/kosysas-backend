/**
 * 		FullLog
 * 		20180806 정종원
 */

var express = require('express');
var router = express.Router();
var client = require('../../service/es/elasticsearch.js');
var searchFunctions = require('../../service/es/functions/search.js');
var json = require('../../service/utils/json.js');
var common = require('../common.js');


/**
 * 		GET Log - Bar chart
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/chart', function(req, res, body) {
	
	// 기간에 따라서 인터벌 수치변경
	// period 필요할듯
	let interval = "month";
	
	let query = '{"size":0,"query":{"match_all":{}},"post_filter":{' + common.getTimeRange(req.query) + '},"aggs":{"fullLog_per_time":{"date_histogram":{"field":"@timestamp","interval":"month","order":{"_key":"desc"}}}}}';
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, '*', query, function(resp) {
		
		let count;
		let value;
		try {
			count = resp.aggregations.fullLog_per_time.buckets.length;
			value = resp.aggregations.fullLog_per_time.buckets;
			let arr = new Array();
			
			for(let i = 0; i < count; i++) {
				
				arr.push(value[i]);
			}
			
			json.addValue(resultObj, 'data', arr);
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
 * 		GET Log - Text
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/text', function(req, res, body) {
	
	let from = 0 * 50;
	let size = from + 50;
	// 페이징 기능 추가
	let query = '{"from":0,"size":50,"query":{"match_all":{}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, '*', query, function(resp) {
		
		let count;
		let value;
		try {
			count = resp.hits.hits.length;
			value = resp.hits.hits;
			let arr = new Array();
			
			for(let i = 0; i < count; i++) {
				
				arr.push(value[i]);
			}
			
			json.addValue(resultObj, 'data', arr);
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