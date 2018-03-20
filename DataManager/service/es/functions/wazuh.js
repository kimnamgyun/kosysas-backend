/**
 * 		wazuh api functions
 * 		20180319 정종원
 */

var request = require('request');
var json = require('../../utils/json.js')


module.exports.get = function(id, pw, host, api, callback){
	
	var options = {
			url: "http://" + id + ":" + pw + "@" + host + api, 
			encoding: 'utf-8'
	};
	request.get(options, function(err, res, body) {
		
		//console.log(res.body);
		callback(err, json.stringToJsonObject(res.body));
	});
}