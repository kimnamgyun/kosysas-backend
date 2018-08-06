var express = require('express');
var router = express.Router();
var client = require('../service/es/elasticsearch.js');
var searchFunctions = require('../service/es/functions/search.js');
var json = require('../service/utils/json.js');
var common = require('./common.js');
var commonFunctions = require('../service/es/functions/common.js');

/**
 * 	GET Index List
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/index/list', function(req, res, body) {
	
	common.setHeader(res);
	commonFunctions.aliases(function(err, resp) {
		
		let resultObj = json.createErrObject('0');
		let obj = json.createJsonObject();
		let arr = json.getKeyArray(resp);
		
		json.addValue(obj, 'indices', arr);
		json.addValue(resultObj, 'data', obj);
		
		res.send(resultObj);
	});
});

/**
 *  Delete Index
 * @param res
 * @param req
 * @param body
 * @returns
 */
router.get('/index/delete/:name', function(req, res, body) {
	
	let idx = req.params.name;//'heartbeat-6.2.3-2018.07.01';
	common.setHeader(res);
	commonFunctions.deleteIdx(idx, function(err, resp) {
		
		let resultObj = json.createErrObject('0');
		let obj = json.createJsonObject();
		let value = resp.error;
		
		//console.log(err);
		//console.log(resp);
		
		if(value == null || value == undefined)	{
			
			json.addValue(obj, 'result', 'success');		// 삭제 성공
		}
		else {
			
			json.addValue(obj, 'result', 'fail');			// 삭제 실패
			json.addValue(obj, 'reason', value.reason);
		}
		
		json.addValue(resultObj, 'data', obj);
		
		res.send(resultObj);
	});
});

/**
 * 		Exist Index
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/index/exist/:name', function(req, res, body) {
	
	let idx = req.params.name;
	
	common.setHeader(res);
	commonFunctions.existIdx(idx, function(err, resp) {
		
		console.log(err);
		console.log(resp);
		
		let resultObj = json.createErrObject('0');
		let obj = json.createJsonObject();
		let value = resp.error;
				
		if((value == null || value == undefined) && json.jsonObjectToString(resp) != '{}')	{
			
			json.addValue(obj, 'result', 'success');		// 삭제 성공
		}
		else {
			
			json.addValue(obj, 'result', 'fail');			// 삭제 실패
			if(json.jsonObjectToString(resp) == '{}') {
				json.addValue(obj, 'reason', 'no such index');
			}
			else {
				json.addValue(obj, 'reason', value.reason);
			}
		}
		
		json.addValue(resultObj, 'data', obj);
		
		res.send(resultObj);
	});
});

module.exports = router;