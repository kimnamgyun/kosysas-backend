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
var request = require('../service/common/restapi.js');

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
 * 	GET ElastAlert Rules with search
 */
router.get('/rules/:cr/:page/:rulename', function(req, res, body) {
	
	let cr = req.params.cr;
	let page = req.params.page;
	let rulename = req.params.rulename;
	
	ea.get('/rules', function(err, resp) {
		
		common.setHeader(res);
		
		if(resp) {
			
			let resultObject = json.createErrObject('0');
			let obj = json.createJsonObject();
			
			if(resp.hasOwnProperty('error')) {
				json.editValue(resultObject, 'error', '003');
			}
			
			let crArray = new Array();
			let noArray = new Array();
			let tArray = resp.rules;
			let result = new Array();
			
			for(let i = 0; i < tArray.length; i ++){
				
				let temp = tArray[i];
				
				// 파일 이름 앞에 cr_가 들어가있다면, 해당 파일은 연관성분석용 파일이다.
				temp.toLowerCase().indexOf('cr_') != -1 ? crArray.push(temp) : noArray.push(temp);
			}
			
			cr == 'yes' ? tArray = crArray : tArray = noArray;	
			
			tArray.sort();
			for(let i = 0; i < tArray.length; i++) {
				
				let temp = tArray[i];
				
				// 검색하려는 이름 검색
				if(temp.toLowerCase().indexOf(rulename) != -1) result.push(temp);
			}
			
			let length = result.length;
			let start = (page - 1) <= 0 ? 0 : (page - 1) * 10;
			let end = (start + 9) < length ? (start + 9) : (length - start);
			
			json.addValue(obj, 'total', length);
			json.addValue(obj, 'buckets', result.slice(start, end))
			json.addValue(resultObject, 'data', obj);
			res.send(resultObject);
		}
		else {
			
			res.send(err);
		}
	});
});

/*
 * 		GET ElastAlert Rules without search
 */
router.get('/rules/:cr/:page', function(req, res, body) {
	
	let cr = req.params.cr;
	let page = req.params.page;
	
	ea.get('/rules', function(err, resp) {
		
		common.setHeader(res);
		
		if(resp) {
			
			let resultObject = json.createErrObject('0');
			let obj = json.createJsonObject();
			
			if(resp.hasOwnProperty('error')) {
				json.editValue(resultObject, 'error', '003');
			}
			
			let crArray = new Array();
			let noArray = new Array();
			let tArray = resp.rules;
			let result = new Array();
						
			for(let i = 0; i < tArray.length; i ++){
				
				let temp = tArray[i];
				
				// 파일 이름 앞에 cr_가 들어가있다면, 해당 파일은 연관성분석용 파일이다.
				temp.toLowerCase().indexOf('cr_') != -1 ? crArray.push(temp) : noArray.push(temp);
			}
			
			cr == 'yes' ? result = crArray : result = noArray;
			result.sort();
			//json.addValue(resultObject, 'data', crArray) : json.addValue(resultObject, 'data', noArray);	
			
			let length = result.length;
			let start = (page - 1) <= 0 ? 0 : (page - 1) * 10;
			let end = (start + 9) < length ? (start + 9) : (length - start);
			
			json.addValue(obj, 'total', length);
			json.addValue(obj, 'buckets', result.slice(start, end))
			json.addValue(resultObject, 'data', obj);
			res.send(resultObject);
		}
		else {
			
			res.send(err);
		}
	});
});

/*
 * 		룰 이름이 존재하는지 여부 체크
 */
router.get('/rulecheck/:name', function(req, res, body) {
	
	let name = req.params.name;
	
	ea.get('/rules', function(err, resp) {
		
		common.setHeader(res);
		
		if(resp) {
			
			let resultObject = json.createErrObject('0');
			let obj = json.createJsonObject();
			
			if(resp.hasOwnProperty('error')) {
				json.editValue(resultObject, 'error', '003');
			}
			
			let arr = resp.rules;
			
			// 리스트에 해당 이름이 존재한다면 fail, 존재하지 않으면 success
			arr.indexOf(name) != -1 ? json.addValue(obj, 'msg', 'fail') : json.addValue(obj, 'msg', 'success');
			
			json.addValue(resultObject, 'data', obj);
			res.send(resultObject);
		}
		else {
			
			res.send(err);
		}
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

var preID = null;
/*
 * 	GET ElastAlert Result For Alarm
 */
router.post('/results', function(req, res, body) {
	
	let result = req.body;
	let id = result._id;
	
	// 중복 데이터 체크
	if(preID != id) {
		
		try {
			console.log(result);
			let resultObj = json.createErrObject('0');
			let obj = json.createJsonObject();
			
			json.addValue(obj, '@timestamp', json.getValue(result, '@timestamp'));
			json.addValue(obj, 'rule_name', result.rule_name);
			json.addValue(obj, 'host', result.host);
			json.addValue(obj, 'hits', result.num_hits);
			json.addValue(obj, 'match', result.num_matches);
			
			json.addValue(resultObj, 'data', obj);
			
			// 이곳에서 데이터를 정제하여, FrontEnd 쪽으로 보내주면 된다.
			// @timestamp
			// rule_name
			// host
			// num_hits
			// num_matches
			
			//console.log(resultObj);
			
			// 알람 결과를 프론트로 전송한다.
			
			let url = 'http://211.252.86.169:8080/api/analysis/alarm/outer';
			
			request('post', url, resultObj, function(err, resp) {
				
				console.log(resp.body);
			});
		}
		catch(e) {
			
			console.log(e);
		}
		
		preID = id;
	}
	
	res.send('200');
});

module.exports = router;