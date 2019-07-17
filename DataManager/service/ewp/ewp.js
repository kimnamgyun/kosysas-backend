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
		'authorization': "Bearer " + cfg.api_token,
		'Content-Type': 'application/json;charset=UTF-8'
};

/**
 * 		GET
 */
module.exports.get = function(url, data, callback) {
	
	let host = 'elastic-workload-protector.secludit.com';
	//let host = '13.125.179.22';//config.ip + ":" + config.port;
	let urlString = 'https://' + host + url;	
	
	console.log(header);
	console.log(urlString);
	
	let options = {
			url: urlString,
			headers: header,
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
			//console.log(resp);
			callback(errObj, json.stringToJsonObject(resp.body));						// return response string;
		}		
	});
}

/**
 * 		POST
 */
module.exports.post = function(url, data, callback) {
	
	let host = 'elastic-workload-protector.secludit.com';
	//let host = '13.125.179.22';//config.ip + ":" + config.port;
	let urlString = 'https://' + host + url;
	console.log(urlString);
	console.log(data);

	let options = {
			url: urlString,
			headers: header,
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
			//console.log(resp);
			callback(errObj, json.stringToJsonObject(resp.body));						// return response string;
		}		
	});
}

/**
 * 		DELETE
 */
module.exports.del = function(callback) {
	
	
}

login = function() {
	
	let data = json.createJsonObject();
	
	json.addValue(data, 'email', 'kimng@kosyas.com');
	json.addValue(data, 'password', 'tpzmf2017!');
	//json.addValue(data, 'accountid', 'kimng@kosyas.com');
	//json.addValue(data, 'account_id', '08e0a677-f7fa-4ee4-8ec7-30c4fb4f4623');
	//json.addValue(data, 'password', 'kimng@kosyas.com24');
	
	this.post('/api/v1/authentication_token', data, function(err, resp){
		
		console.log(resp);
		
		resp.access_token;
		//json.addValue(resultObj, 'data', resp);
	})
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