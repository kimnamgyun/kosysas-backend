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
var queryMgr = require('../../service/utils/xmlParser.js');

/*
 * 	callback 처리 함수 for GET
 */
function callbackGET(res, err, resp) {

	console.log('usrMgr.callbackGET() :'+err);
	console.log('usrMgr.callbackGET().resp: '+resp);
	
	if(resp) {
		
		let resultObject = json.createErrObject('0');
		
		if(resp.hasOwnProperty('error')) {
			json.editValue(resultObject, 'error', '003');
		}
		json.addValue(resultObject, 'data', resp);
		
		console.log('usrMgr.callbackGET().resultObject:'+resultObject);
		
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
	
	console.log('usrMgr.callbackPOST():'+err);
	console.log('usrMgr.callbackPOST().resp:'+resp);

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
		
		console.log('usrMgr.callbackPOST().resultObject:'+resultObject);
		
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
	

	var xmlQuery = queryMgr.getQuery('/userinfo/:id');
	console.log('usrMgr.router.get(/userinfo/:id) : '+xmlQuery);
	
	// query = SELECT * FROM public.userinfo WHERE id = %s
	var query = util.format(query, req.params.id);
	console.log('usrMgr.router.get(/userinfo/:id) : query : '+query);
	
	dbMgr.selectQuery (query);
	callback(res, err, resp);
	 
});


/* 
 * GET /userinfo/:id

 * return all rules
 */
router.get('/', function(req, res, next) {
	

	var xmlQuery = queryMgr.getQuery('/login');
	console.log('usrMgr.router.get(/login) : '+xmlQuery);
	
	// 
	//var query = util.format(query, );
	console.log('usrMgr.router.get(/login) : query : '+query);
	
	dbMgr.selectQuery (query);
	
	callback(res, err, resp);
	
});

module.exports = router;
