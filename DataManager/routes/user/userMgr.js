/**
 *  사용자 Login/등록/변경을 처리한다.
 *  
 *  author: pennyPark (jypark@kosyas.com)
 *  createDate : 2018-04-04
 *  
 *  updateDate :
 *  updateAuthor:
 *  updateContent:   
 */

var express = require('express');
var request = require('request');

var router = express.Router();
 
var dbMgr = require('../../service/db/postgres.js');
var json = require('../../service/utils/json.js');

/*
 * 	callback 처리 함수 for GET
 */
function callbackGET(res, err, resp) {

	console.log(err);
	console.log(resp);
	
	if(resp) {
		
		let resultObject = json.createErrObject('0');
		
		if(resp.hasOwnProperty('error')) {
			json.editValue(resultObject, 'error', '003');
		}
		json.addValue(resultObject, 'data', resp);
		
		console.log(resultObject);
		
		res.send(resultObject);
	}
	else {
		
		res.send(err);
	}
}

/*
 * 	callback 처리함수 for POST
 */
function callbackPOST(res, err, resp) {
	
	console.log(err);
	console.log(resp);

	if(resp) {
		
		let resultObject = json.createErrObject('0');
		let tmp = json.createJsonObject();
		
		if(resp.hasOwnProperty('created')) {
			json.addValue(tmp, 'msg', 'success');
		}
		else {
			json.editValue(resultObject, 'error', '003');
			json.addValue(tmp, 'msg', 'fail');
		}
		json.addValue(resultObject, 'data', tmp);
		
		console.log(resultObject);
		
		res.send(resultObject);
	}
	else {
		
		res.send(err);
	}
}

/* 
 * GET /userinfo/:id

 * return all rules
 */
router.get('/userinfo/:id', function(req, res, next) {
	
	// sqlQuery.xml로 대체 예정
	var query = "SELECT * FROM public.members;"

	dbMgr.selectQuery (query) {
		callback(res, err, resp);
	}
	
	  
});
