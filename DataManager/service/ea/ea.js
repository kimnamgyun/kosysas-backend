/**
 * 		ea.js
 * 		20180323 정종원
 */


var request = require('../common/restapi.js');
var json = require('../utils/json.js')

module.exports.get = function(host, api, callback) {
	
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

module.exports.post = function(host, api, form, callback) {
	
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

module.exports.delete = function(host, api, callback) {
	
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

