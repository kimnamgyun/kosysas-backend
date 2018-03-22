/**
 * 		restapi.js
 * 		20180321 정종원
 */

var request = require('request');
var json = require('../utils/json.js');

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
		
		if(err){
			console.log(err);
			
			let errObj = json.createErrObject('001');
			
			callback(errObj, null);						// return err json object;
		}
		else {
			
			let errObj = json.createErrObject('0');		// no error
			callback(errObj, res);						// return response string;
		}		
	});
}