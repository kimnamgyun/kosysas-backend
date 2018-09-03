var express = require('express');
var router = express.Router();
var json = require('../service/utils/json.js');
var cerebro = require('../service/es/functions/cerebro.js');
var client = require('../service/es/elasticsearch.js');
var searchFunctions = require('../service/es/functions/search.js');
var common = require('./common.js');


/**
 * 		GET IOC 업데이트 사항
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/updateInfo', function(req, res, body) {
	
	let query = '{"size":0,"query":{"match_all":{}},"aggs":{"ioc":{"date_histogram":{"field":"@timestamp","interval":"' + common.getInterval(req.query) + '"}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'minemeld-http-*', query, function(resp) {
		
		let count;
		let value;
		try {
			count = resp.aggregations.ioc.buckets.length;
			value = resp.aggregations.ioc.buckets;
			let arr = new Array();
			
			for(let i = 0; i < count; i++) {
				
				let temp = value[i];
				let tObj = json.createJsonObject();
				
				json.addValue(tObj, 'key', temp.key_as_string);
				json.addValue(tObj, 'count', temp.doc_count);
				
				arr.push(tObj);
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
 * 		GET IOC 위험 IP 대역
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/ipInfo/:page', function(req, res, body) {
	
	let query = '{"size":0,"query":{"match_all":{}},"aggs":{"ip_list":{"terms":{"field":"@timestamp","size":100,"order":{"_key":"desc"}},"aggs":{"message":{"terms":{"field":"message.keyword","size":100}}}}},"post_filter":{' + common.getTimeRange(req.query) + '}}';
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	let page = req.params.page;
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'minemeld-http-*', query, function(resp) {
		
		let count;
		let value;
		try {
			count = resp.aggregations.ip_list.buckets.length;
			value = resp.aggregations.ip_list.buckets;
			let arr = new Array();
			
			for(let i = 0; i < count; i++) {
				
				let iTemp = resp.aggregations.ip_list.buckets[i];
				let jCount = iTemp.message.buckets.length;
				let jValue = iTemp.message.buckets;
				
				for(let j = 0; j < jCount; j++) {
					
					let jTemp = iTemp.message.buckets[j];
					let res = jTemp.key.split('-');
					let tObj = json.createJsonObject();
					
					json.addValue(tObj, 'time', iTemp.key_as_string);
					json.addValue(tObj, 'start', res[0]);
					json.addValue(tObj, 'end', res[1]);
					
					arr.push(tObj);
				}
			}
			
			// page == 0, return all list
			let length = arr.length;
			if(page == 0) {
				
				json.addValue(obj, 'total', length);
				json.addValue(obj, 'list', arr);
			}
			else {
				let start = (page - 1) <= 0 ? 0 : (page - 1) * 20;
				let end = start + ((start + 20) < length ? 20 : (length - start));
				
				json.addValue(obj, 'total', length);
				json.addValue(obj, 'list', arr.slice(start, end));
			}
			
			// 갯수가 많은 관계로 토탈을 넣어줌
			json.addValue(resultObj, 'data', obj);
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