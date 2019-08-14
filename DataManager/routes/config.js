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

router.get('/token', function(req, res, next) {
	res.render('token', {
		id: token.id,
		pw: token.pw,
		name: token.name,
		email: token.email,
		token: token.token,
	});
});

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

module.exports = router;