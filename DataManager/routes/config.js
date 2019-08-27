/**
*			config.js
*			conf/config.json 파일을 웹 UI로 읽기/쓰기
*			2019.07.12 정종원
*
*/

var fs = require('fs');
var express = require('express');
var router = express.Router();
var cfg = require('../conf/config.json');
var token = require('../conf/token.json');
var tokenMgr = require('./auth/tokenManager.js');
var json = require('../service/utils/json.js');

/*
 * 		Config Setting 화면 
 */
router.get('/', function(req, res, next) {
	res.render('config', {
		port: cfg.port,
		esid: cfg.esUserName,
		espw: cfg.esUserPasswd,
		esip: cfg.esIP,
		esport: cfg.esPort,
		eaip: cfg.eaIP,
		eaport: cfg.eaPort,
		wid: cfg.wazuhID,
		wpw: cfg.wazuhPW,
		wip: cfg.wazuhIP,
		wport: cfg.wazuhPort,
		fip: cfg.frontIP,
		fport: cfg.frontPort,
		ewpip: cfg.server_ip,
		ewpaccount: cfg.ewpAccountID,
		ewpmail: cfg.ewpEmail,
		ewppw: cfg.ewpPassword,
		ewptoken: cfg.api_token
	});
});

/*
 * 		Config 저장
 */
router.post('/save', function(req, res, next) {
	
	let data = req.body;
	// Backend Port
	cfg.port = data.port;
	
	// Elasticsearch Data
	cfg.esUserName = data.esid;
	cfg.esUserPasswd = data.espw;
	cfg.esIP = data.esip;
	cfg.esPort = data.esport;
	
	// Alert Data
	cfg.eaIP = data.eaip;
	cfg.eaPort = data.eaport;
	
	// Wazuh Data
	cfg.wazuhID = data.wid;
	cfg.wazuhPW = data.wpw;
	cfg.wazuhIP = data.wip;
	cfg.wazuhPort = data.wport;
	
	// Front Data
	cfg.frontIP = data.fip;
	cfg.frontPort = data.fport;
	
	// EWP Data
	cfg.server_ip = data.ewpip;
	cfg.ewpAccountID = data.ewpaccount;
	cfg.ewpEmail = data.ewpmail;
	cfg.ewpPassword = data.ewppw;
	cfg.api_token = data.ewptoken;
	
	
	fs.writeFile('conf/config.json', json.jsonObjectToString(cfg), 'utf8', function(err) {
		if(err) console.log(err);
		else console.log("Save Complete");
	});
	// config 화면으로 redirecting
	res.redirect('/config');
});

/**
 * 		GET Token 생성 정보 입력
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/token', function(req, res, next) {
	res.render('token', {
		id: token.id,
		pw: token.pw,
		name: token.name,
		email: token.email,
		token: token.token,
	});
});

/**
 * 		POST Token 생성
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.post('/token/create', function(req, res, next) {
	
	let data = req.body
	
	token.id = data.id;
	token.pw = data.pw;
	token.name = data.name;
	token.email = data.email;
	
	let obj = tokenMgr.createToken(data.id, data.pw, data.name, data.email);
	if(obj.type) {
		
		token.token = obj.data;		
	}
	else {
		token.token = null;
	}	
	
	fs.writeFile('conf/token.json', json.jsonObjectToString(token), 'utf8', function(err) {
		if(err) console.log(err);
		else console.log("Token Save Complete");
	});	
	
	res.redirect('/config/token');
});

/**
 * 		GET 토큰 생성 ( 외부 API 용 )
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/token/sign', function(req, res, next) {
	
	let isValid = false;
	let id		= "admin@kosyas.com";
	let pw		= "111!!!qqqQQQ";	
	let name	= "kosyas";
	let email	= "admin@kosyas.com";
	
	let obj = tokenMgr.createToken(id, pw, name, email);
	if(obj.type) isValid = true;
	
	if(isValid) {
		
		token.token = obj.data;
		fs.writeFile('conf/token.json', json.jsonObjectToString(token), 'utf8', function(err) {
			if(err) console.log(err);
			else console.log("Token Save Complete");
		});	
		
		res.send({
			error: '0',
			data: {
				valid: 'true',
				msg: 'Token sign success'
			}
		});
	}
	else {
		res.send({
			error: '007',
			data: {
				valid: 'false',
				msg: 'Token sign failed'
			}
		});
	}
});

/**
 * 		GET Token
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/token/get', function(req, res, next) {
	
	let isValid = false;
	let token = null;
	let user = (req.query.user != null ? req.query.user : null);
	let name = (req.query.name != null ? req.query.name : null);
	let email = (req.query.email != null ? req.query.email : null);
	
	//
	fs.readFile('conf/token.json', 'utf8', function(err, data) {
		
		if(err) console.log(err);
		else {
			console.log(data);
			token = json.stringToJsonObject(data).token;
			
			// 적합한 사용자 체크 ( 임시 )
			if(token) {
				if(user != null && name != null && email != null) isValid = true;
			}
			
			if(isValid) {
				res.send({
					error: '0',
					data: {
						valid: 'true',
						value: token,
						msg: 'Token authentication success'
					}
				});
			}
			else {
				res.send({
					error: '006',
					data: {
						valid: 'false',
						value: 'null',
						msg: 'Not Valid Token'
					}
				});
			}
		}
	});
});

/**
 * 		GET Token Verify
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/token/verify', function(req, res, next) {
	
	if(tokenMgr.authToken(req.headers)) {
		
		res.send({
			error: '0',
			data: {
				valid: 'true',
				msg: 'Token authentication success'
			}
		});
	}
	else {
		res.send({
			error: '005',
			data: {
				valid: 'false',
				msg: 'Not Valid Token'
			}
		});
	}
})

module.exports = router;