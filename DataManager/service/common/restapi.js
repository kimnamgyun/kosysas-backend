/**
 * 		restapi.js
 * 		20180321 정종원
 */

var request = require('request');

/**
 * 		restful api 통신을 위한 모듈
 * 		method		: GET, POST, DELETE, PUT
 * 		url			: host url
 * 		form		: jsonObject (PUT, DELETE, POST에서 전달할 데이터)
 * 		callback	: callback 함수
 */
module.exports = function(method, url, form, callback)
{
	let options;
	if(method == 'GET') {
		options = {
				url: url,
				method: method,
				timeout: 10000
				//followRedirect: false,
				//maxRedirects: 10
		};
	}
	else {
		options = {
				url: url,
				method: method,
				form: form,
				timeout: 10000
		}
	}
	
	request(options, function(err, res, body) {
		
		console.log(err);
		callback(err, res, body);
	});
}