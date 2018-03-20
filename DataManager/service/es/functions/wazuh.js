/**
 * 		wazuh api functions
 * 		20180319 정종원
 */

var request = require('request');


module.exports.get = function(id, pw, host, api, callback){
	
	request.get("http://" + id + ":" + pw + "@" + host + api, function(err, res, body) {
		
		//console.log(res.body);
		callback(err, res.body);
	});
}