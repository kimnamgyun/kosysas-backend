var express = require('express');
var router = express.Router();
var client = require('../service/es/elasticsearch.js');
var searchFunctions = require('../service/es/functions/search.js');
var json = require('../service/utils/json.js');
var common = require('./common.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'DBTest.!.!.!' });
	
	client.cluster.health({}, function(err, resp, status) {
		console.log("-- Client Error : [ ", err, " ] --")
		console.log("-- Client Status : [ ", status, " ] --")
		console.log("-- Client Health --\n", resp)	
	});
});

/*
 * 		임시
 */
router.get('/search', function(req, res, next) {
		
	let query = 
	'{"query": {"match": {"rule_name": "rule_cpu"}}, "post_filter": {"exists": {"field": "alert_sent"}}}';
	//query = json.stringToJsonObject(query);
	//console.log(query);
	
	common.setHeader(res);
	searchFunctions.freeQuery(client, 'elastalert_*', query, function(resp) {
		
		let resultObject = json.createErrObject('0');
		let array = new Array();
		
		for(let i = 0; i < resp.hits.length; i++){
			//console.log(resp.hits[i]._source.match_body.system.cpu);
			let obj = json.createJsonObject();
			json.addValue(obj, "system", resp.hits[i]._source.match_body.system.cpu.system);
			json.addValue(obj, "user", resp.hits[i]._source.match_body.system.cpu.user);
			array.push(obj);
		}
		json.addValue(resultObject, "data", array);
		
		res.send(resultObject);
	});
});

/**
 * 		백엔드 서버 생존 체크
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/check', function(req, res, body) {
	
	let resultObject = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	
	client.cluster.health({}, function(err, resp, status) {
		console.log("-- Client Error : [ ", err, " ] --")
		console.log("-- Client Status : [ ", status, " ] --")
		console.log("-- Client Health --\n", resp)	
		
		// 엘라스틱서치가 정상적인 상태일 경우에만 살아있다는 응답을 보낸다.
		if(status == '200') {
			
			json.addValue(obj, 'result', 'success');
		}
		else {
			
			json.addValue(obj, 'result', 'fail');
			json.addValue(obj, 'ES-Status', status);
			json.addValue(obj, 'message', 'Check Elasticsearch');
		}
		
		json.addValue(resultObject, 'data', obj);
		res.send(resultObject);
	});
});

module.exports = router;
