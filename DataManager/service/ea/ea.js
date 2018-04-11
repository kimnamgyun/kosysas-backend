/**
 * 		ea.js
 * 		20180323 정종원
 */


var request = require('../common/restapi.js');
var json = require('../utils/json.js')
var cfg = require('../../conf/config.json');

let config = {
	eaIP: cfg.eaIP,
	eaport: cfg.eaPort
}

module.exports.get = function(api, callback) {
	
	let host = config.eaIP + ":" + config.eaport;
	var urlString = "http://" + host + api;
	
	request('GET', urlString, null, function(err, res) {
		
		if(res) {
			
			callback(err, json.stringToJsonObject(res.body));
		}
		else {
			
			callback(err, null);
		}
	});
}

module.exports.post = function(api, form, callback) {
	
	let host = config.eaIP + ":" + config.eaport;
	var urlString = "http://" + host + api;
	
	request('POST', urlString, form, function(err, res) {
		
		if(res) {
		
			callback(err, json.stringToJsonObject(res.body));
		}
		else {
			
			callback(err, null);
		}
	});
}

module.exports.delete = function(api, callback) {
	
	let host = config.eaIP + ":" + config.eaport;
	var urlString = "http://" + host + api;
	
	request('DELETE', urlString, null, function(err, res) {
		
		if(res) {
		
			callback(err, json.stringToJsonObject(res.body));
		}
		else {
			
			callback(err, null);
		}
	});
}

