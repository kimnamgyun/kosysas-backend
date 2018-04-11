/**
 * 		elastealert.js	
 * 		20180326 정종원
 * 		elastalert restful api 문서
 */


var express = require('express');
var router = express.Router();
var json = require('../service/utils/json.js');
var ea = require('../service/ea/ea.js');
var common = require('./common.js');

/*
 * 		callback 처리 함수 for GET
 */
function callbackGET(res, err, resp) {

	//console.log(err);
	//console.log(resp);
	
	if(resp) {
		
		let resultObject = json.createErrObject('0');
		
		if(resp.hasOwnProperty('error')) {
			json.editValue(resultObject, 'error', '003');
		}
		json.addValue(resultObject, 'data', resp);
		
		//console.log(resultObject);
		res.send(resultObject);
	}
	else {
		
		res.send(err);
	}
}

/*
 * 		callback 처리함수 for POST
 */
function callbackPOST(res, err, resp) {
	
	//console.log(err);
	//console.log(resp);
	
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
		
		//console.log(resultObject);
		res.send(resultObject);
	}
	else {
		
		res.send(err);
	}
}

/*
 * 		callback 처리함수 for DELETE
 */
function callbackDELETE(res, err, resp) {
	
	//console.log(err);
	//console.log(resp);
	
	let resultObject = json.createErrObject('0');
	let tmp = json.createJsonObject();
	
	if(resp) {	
		json.editValue(resultObject, 'error', '003');
		json.addValue(tmp, 'msg', 'fail');
	}
	else {
		json.addValue(tmp, 'msg', 'success');
	}
	
	json.addValue(resultObject, 'data', tmp);
	//console.log(resultObject);
	res.send(resultObject);
}

/*
 * 	GET ElastAlert Infomation
 */
router.get('/', function(req, res, body) {
	
	ea.get(host, '/', function(err, resp) {
		
		common.setHeader(res);
		callbackGET(res, err, resp);
	});
});

/*
 * 	GET ElastAlert Status
 */
router.get('/status', function(req, res, body) {
	
	ea.get('/status', function(err, resp) {
		
		common.setHeader(res);
		callbackGET(res, err, resp);
	});
});

/*
 * 	GET ElastAlert Error Info
 */
router.get('/status/errors', function(req, res, body) {
	
	ea.get('/status/errors', function(err, resp) {
		
		common.setHeader(res);
		callbackGET(res, err, resp);
	});
});

/*
 * 	GET ElastAlert Rules
 */
router.get('/rules', function(req, res, body) {
	
	ea.get('/rules', function(err, resp) {
		
		common.setHeader(res);
		callbackGET(res, err, resp);
	});
});

/*
 * 	POST ElastAlert Rules by id
 */
router.post('/rules/:id', function(req, res, body) {
	
	let form = req.body.form;//"{ yaml:'/opt/elastalert/rules/001.yml'}";
	
	ea.post('/rules/' + req.params.id, form, function(err, resp) {
		
		common.setHeader(res);
		callbackPOST(res, err, resp);
	})
});

/*
 * 	GET ElastAlert Rules by Id
 */
router.get('/rules/:id', function(req, res, body) {
	
	ea.get('/rules/' + req.params.id, function(err, resp) {
		
		common.setHeader(res);
		
		if(resp) {
			
			let resultObject = json.createErrObject('0');
			
			if(resp.hasOwnProperty('error')) {
				json.editValue(resultObject, 'error', '003');
			}
			json.addValue(resultObject, 'data', resp);
			
			//console.log(resultObject);
			res.send(resultObject);
		}
		else {
			
			let resultObject = json.createErrObject('0');
			if(json.getValue(err, 'error') == '0') {
				
				let dataObject = json.createJsonObject();
				dataObject['data'] = null;
				//json.addValue(dataObject, 'data', null);
				json.addValue(resultObject, 'data', dataObject);
			}
			res.send(resultObject);
		}
	});
});

/*
 * 	DELETE ElastAlert Rules by id
 */
router.delete('/rules/:id', function(req, res, body) {
	
	ea.delete('/rules/' + req.params.id, function(err, resp) {
		
		common.setHeader(res);
		callbackDELETE(res, err, resp);
	});
})

/*
 * 	GET ElastAlert Template
 */
router.get('/templates', function(req, res, body) {
	
	ea.get('/templates', function(err, resp) {
		
		common.setHeader(res);
		callbackGET(res, err, resp);
	});
});

/*
 * 	GET ElastAlert Template by id
 */
router.get('/templates/:id', function(req, res, body) {
	
	ea.get('/templates/' + req.params.id, function(err, resp) {
		
		common.setHeader(res);
	    
	    if(resp) {
			
			let resultObject = json.createErrObject('0');
			
			if(resp.hasOwnProperty('error')) {
				json.editValue(resultObject, 'error', '003');
			}
			json.addValue(resultObject, 'data', resp);
			
			//console.log(resultObject);
			res.send(resultObject);
		}
		else {
			
			let resultObject = json.createErrObject('0');
			if(json.getValue(err, 'error') == '0') {
				
				let dataObject = json.createJsonObject();
				json.addValue(dataObject, 'data', '');
				json.addValue(resultObject, 'data', dataObject);
			}
			res.send(resultObject);
		}
	});
});

/*
 * 	POST ElastAlert Template by id
 */
router.post('/templates/:id', function(req, res, body) {
	
	let form = req.body.form;
	
	ea.post('/templates/' + req.params.id, form, function(err, resp) {
		
		common.setHeader(res);
		callbackPOST(res, err, resp);
	});
});

/*
 * 	DELETE ElastAlert Template by id
 */
router.delete('/templates/:id', function(req, res, body) {
	
	let form;
	ea.delete('/templates/' + req.params.id, function(err, resp) {
		
		common.setHeader(res);
		callbackDELETE(res, err, resp);
	});
});

/*
 * 	GET ElastAlert Config
 */
router.get('/config', function(req, res, body) {
	
	ea.get('/config', function(err, resp) {
		
		common.setHeader(res);
		callbackGET(res, err, resp);
	});
});

module.exports = router;