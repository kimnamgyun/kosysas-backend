/**
 *		cerebro cat api 함수
 *		20180314 정종원
 */

var request = require('request');

/**
 * 			
 */
module.exports.cat = function(host, apiName, callback) {
	
	let urlString = host + '/_cat/' + apiName + '?format=json';
	
	request.get({
		url: urlString,
	}, function(err, resp, body){
		//console.log(err);
		console.log(resp.body);
		callback(err, resp.body);
	});
}
