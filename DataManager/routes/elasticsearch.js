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
		
		//console.log(err);
		//console.log(resp);
		
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

/**
 * 		인덱스에 존재하는 필드 항목들을 가져온다.
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/fields/:idx', function(req, res, body) {
	
	let idx = req.params.idx;
	
	common.setHeader(res);
	commonFunctions.mapping(idx, function(err, resp) {
		
		//console.log(err);
		//console.log(resp);
		let resultObj = json.createErrObject('0');
		let obj = json.createJsonObject();
		
		var tArray = [];							// field list를 담을 Array
		let tObj = null;
		
		for(let i in resp) {
			
			let temp = resp[i].mappings;
			for( let j in temp) {
				
				tObj = temp[j].properties;			// field 추출에 쓰일 데이터
				getProperties(tObj, tArray, '');	// 맨 상위 필드는 부모가 없다.
			}
		}
		
		json.addValue(obj, 'count', tArray.length);
		json.addValue(obj, 'fields', tArray);
		json.addValue(resultObj, 'data', obj);		
		res.send(resultObj);
	});
});

/**
 * 		인덱스의 필드 리스트를 추출하는 함수
 * @param obj
 * @param arr
 * @param parent
 * @returns
 */
function getProperties(obj, arr, parent) {
	
	for( let key in obj ) {
		
		let value = parent == '' ? key : parent + '.' + key;
		if( obj[key].hasOwnProperty('properties') ) {
			
			getProperties(obj[key].properties, arr, value);
		}
		else {
			if(arr.indexOf(value) == -1) arr.push(value)
		}
	}
	
}

module.exports = router;