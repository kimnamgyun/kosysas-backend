var express = require('express');
var router = express.Router();
var json = require('../service/utils/json.js');
var ea = require('../service/ea/ea.js');

var host = '192.168.0.249:3030';

/*
 * 		callback 처리 함수
 */
function callback(res, err, resp) {

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
 * 	GET ElastAlert Infomation
 */
router.get('/', function(req, res, body) {
	
	ea.get(host, '/', function(err, resp) {
		
		callback(res, err, resp);
	});
});

/*
 * 	GET ElastAlert Status
 */
router.get('/status', function(req, res, body) {
	
	ea.get(host, '/status', function(err, resp) {
		
		callback(res, err, resp);
	});
});

/*
 * 	GET ElastAlert Error Info
 */
router.get('/status/errors', function(req, res, body) {
	
	ea.get(host, '/status/errors', function(err, resp) {
		
		callback(res, err, resp);
	});
});

/*
 * 	GET ElastAlert Rules
 */
router.get('/rules', function(req, res, body) {
	
	ea.get(host, '/rules', function(err, resp) {
		
		callback(res, err, resp);
	});
});

/*
 * 	POST ElastAlert Rules by id
 */
router.post('/rules/:id', function(req, res, body) {
	
	let form = req.body.form;//"{ yaml:'/opt/elastalert/rules/001.yml'}";
	console.log(form);
	ea.post(host, '/rules/' + req.params.id, form, function(err, resp) {
		
		callback(res, err, resp);
	})
});

/*
 * 	GET ElastAlert Rules by Id
 */
router.get('/rules/:id', function(req, res, body) {
	
	ea.get(host, '/rules/' + req.params.id, function(err, resp) {
		
		callback(res, err, resp);
	});
});

/*
 * 	DELETE ElastAlert Rules by id
 */
router.delete('/rules/:id', function(req, res, body) {
	
	ea.delete(host, '/rules/' + req.params.id, function(err, resp) {
		
		callback(res, err, resp);
	});
})

/*
 * 	GET ElastAlert Template
 */
router.get('/templates', function(req, res, body) {
	
	ea.get(host, '/templates', function(err, resp) {
		
		callback(res, err, resp);
	});
});

/*
 * 	GET ElastAlert Template by id
 */
router.get('/templates/:id', function(req, res, body) {
	
	ea.get(host, '/templates/' + req.params.id, function(err, resp) {
		
		callback(res, err, resp);
	});
});

/*
 * 	POST ElastAlert Template by id
 */
router.post('/templates/:id', function(req, res, body) {
	
	let form = req.body.form;
	console.log(form);
	ea.post(host, '/templates/' + req.params.id, form, function(err, resp) {
		
		callback(res, err, resp);
	});
});

/*
 * 	DELETE ElastAlert Template by id
 */
router.delete('/templates/:id', function(req, res, body) {
	
	let form;
	ea.delete(host, '/templates/' + req.params.id, function(err, resp) {
		
		callback(res, err, resp);
	});
});

/*
 * 	GET ElastAlert Config
 */
router.get('/config', function(req, res, body) {
	
	ea.get(host, '/config', function(err, resp) {
		
		callback(res, err, resp);
	});
});

module.exports = router;