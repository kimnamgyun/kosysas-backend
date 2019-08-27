/**
 * 			tokenManager.js
 * 			20190812 정종원 
 * 			REST API create bearer web token
 * 
 */

var fs 		= require('fs');
var jwt		= require('jsonwebtoken');
var conf 	= require('../../conf/token.json');

var tokenManager = {};

/**
 * 		Create Token
 * 		User id, password, name, email
 * 		return [true, false] / token
 */
tokenManager.createToken = function(id, pw, name, email) {
	
	if(!id || !pw || !name || !email) { 	
		return {
			type: false
		};
	}
	else {
		// Token 생성 & 저장
		let User = {
			id: id,
			password: pw,
			name: name,
			email: email
		}
		
		let token = jwt.sign(User, conf.key, { expiresIn: 60 * 60 * 24 });
		//console.log(token);
		
		//console.log(jwt.verify(token, conf.key));
		return {
			type: true,
			data: token
		};
	}
}

tokenManager.deleteToken = function() {
	
}

/**
 * 		Authentication Token
 * 		header
 * 		return True / False
 */
tokenManager.authToken = function(header) {
	
	console.log(header);
	var bearerHeader = header["authorization"];	
	if(typeof bearerHeader !== 'undefined') {
		var bearer = bearerHeader.split(' ');
		var token = bearer[1];
		//console.log(token);
		try{
			let decode = jwt.verify(token, "simon");
			
			if(!decode.id) return false;
			if(!decode.password) return false;
			if(!decode.name) return false;
			if(!decode.email) return false;			
		}
		catch(e) {
			console.log("tokenManager.authToken : " + e);
			return false;
		}
		return true;
	}
	else {
		return false;
	}
}


module.exports = tokenManager;