/**
 * 		wazuh api functions
 * 		20180319 정종원
 */

var request = require('../../common/restapi.js');
var json = require('../../utils/json.js')


module.exports.get = function(id, pw, host, api, callback){
	
	var urlString = "http://" + id + ":" + pw + "@" + host + api;
	
	request('GET', urlString, null, function(err, res) {
		
		if(res) {
		
			callback(err, json.stringToJsonObject(res.body));
		}
		else {
			
			callback(err, null);
		}
	});
	/*
	request.get(options, function(err, res, body) {
		
		//console.log(res.body);
		callback(err, json.stringToJsonObject(res.body));
	});
	*/
}