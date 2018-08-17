/**
 *		common api 함수
 *		20180702 정종원
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

/**
 * 	DELETE Index
 */
module.exports.deleteIdx = function(idx, callback) {
	
	let host = config.ip + ":" + config.port;
	let urlString = 'http://' + host + '/' + idx;
	
	request('DELETE', urlString, null, function(err, resp) {
		
		if(resp) {
			callback(err, json.stringToJsonObject(resp.body));
		}
		else {
			callback(err, null);
		}
	});
}

/**
 * 	EXIST Index
 */
module.exports.existIdx = function(idx, callback) {
	
	let host = config.ip + ":" + config.port;
	let urlString = 'http://' + host + '/'+ idx + '?pretty';
	
	request ('GET', urlString, null, function(err, resp) {
		
		//console.log(resp);
		if(resp) {
			callback(err, json.stringToJsonObject(resp.body));
		}
		else {
			callback(err, null);
		}
	})
}

/**
 * 	MAPPING
 */
module.exports.mapping = function(idx, callback) {
	
	let host = config.ip + ":" + config.port;
	let urlString = 'http://' + host + '/'+ idx + '/_mapping?pretty';
	
	request ('GET', urlString, null, function(err, resp) {
		
		//console.log(resp);
		if(resp) {
			callback(err, json.stringToJsonObject(resp.body));
		}
		else {
			callback(err, null);
		}
	})
}