/**
 *		cerebro cat api 함수
 *		20180314 정종원
 */

var request = require('../../common/restapi.js');
var json = require('../../utils/json.js');
var cfg = require('../../../conf/config.json');

let config = {
  ip: cfg.esIP,
  port: cfg.esPort,
  user: cfg.esUserName, 
  password: cfg.esUserPasswd
}

/**
 * 			
 */
module.exports.cat = function(host, apiName, callback) {
	
	let urlString = host + '/_cat/' + apiName + '?format=json';
	
	request('GET', urlString, null, function(err, resp) {
		
		if(resp) {
			
			callback(err, json.stringToJsonObject(resp.body));
		}
		else {
			
			callback(err, null);
		}
		
	});
	/*
	request.get({
		url: urlString,
	}, function(err, resp, body){
		//console.log(err);
		//console.log(apiName, " : ", Object.keys(resp.body).length);
		callback(err, json.stringToJsonObject(resp.body));
	});
	*/
}

/**
 * 	GET IndexList
 */
module.exports.aliases = function(callback) {
	
	let host = config.ip + ":" + config.port;
	let urlString = 'http://' + host + '/_aliases?pretty';
	
	request('GET', urlString, null, function(err, resp) {
		
		if(resp) {
			callback(err, json.stringToJsonObject(resp.body));
		}
		else {
			callback(err, null);
		}
	});
}
