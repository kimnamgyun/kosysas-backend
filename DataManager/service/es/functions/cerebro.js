/**
 *		cerebro cat api 함수
 *		20180314 정종원
 */

var request = require('request');
var json = require('../../utils/json.js');

/**
 * 			
 */
module.exports.cat = function(host, apiName, callback) {
	
	let urlString = host + '/_cat/' + apiName + '?format=json';
	
	request.get({
		url: urlString,
	}, function(err, resp, body){
		//console.log(err);
		//console.log(apiName, " : ", Object.keys(resp.body).length);
		callback(err, json.stringToJsonObject(resp.body));
	});
}
