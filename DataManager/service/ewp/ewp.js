/**
*	
*		EWP API Functions
*		20190710 정종원
*
*/

var https = require('https');
var request = require('request');
var json = require('../utils/json.js');
var cfg = require('../../conf/config.json');

var header = {
		'Authorization': 'Bearer',
		'Content-Type': 'application/json;charset=UTF-8'
};

/**
 * 		GET
 */
module.exports.get = function(url, data, callback) {
	
	let host = '13.125.179.22';//config.ip + ":" + config.port;
	let urlString = 'https://' + host + url;	
	
	let options = {
			url: urlString,
			header: header,
			method: 'GET',
			timeout: 10000,
			ecdhCurve: 'P-521:P-384:P-256'				// ECDH Curve for EWP Website
			//followRedirect: false,
			//maxRedirects: 10
	};
	
	request(options, function(err, resp, body) {
		
		if(err){
			console.log(err);
			
			let errObj = json.createErrObject('001');
			
			callback(errObj, null);						// return err json object;
		}
		else {
			
			let errObj = json.createErrObject('0');		// no error
			//console.log(res);
			callback(errObj, json.stringToJsonObject(resp.body));						// return response string;
		}		
	});
}

/**
 * 		POST
 */
module.exports.post = function(url, data, callback) {
	
	let host = '13.125.179.22';//config.ip + ":" + config.port;
	let urlString = 'https://' + host + url;
	console.log(urlString);
	console.log(data);

	let options = {
			url: urlString,
			header: header,
			method: 'POST',
			form: data,
			timeout: 10000,
			ecdhCurve: 'P-521:P-384:P-256'
	};
	
	request(options, function(err, resp, body) {
		
		if(err){
			console.log(err);
			
			let errObj = json.createErrObject('001');
			
			callback(errObj, null);						// return err json object;
		}
		else {
			
			let errObj = json.createErrObject('0');		// no error
			//console.log(res);
			callback(errObj, json.stringToJsonObject(resp.body));						// return response string;
		}		
	});
}

/**
 * 		DELETE
 */
module.exports.del = function(callback) {
	
	
}

/*
 * module.exports = function(method, url, form, callback)
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
			//console.log(res);
			callback(errObj, res);						// return response string;
		}		
	});
}
 */