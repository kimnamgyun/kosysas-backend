/**
 * 		wazuh api functions
 * 		20180319 정종원
 */

var request = require('../../common/restapi.js');
var json = require('../../utils/json.js')
var cfg = require('../../../conf/config.json');

let config = {
		id: cfg.wazuhID,
		pw: cfg.wazuhPW,
		ip: cfg.wazuhIP,
		port: cfg.wazuhPort
	}

module.exports.get = function(api, callback){
	
	let host = config.ip + ":" + config.port;
	var urlString = "https://" + config.id + ":" + config.pw + "@" + host + api;

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