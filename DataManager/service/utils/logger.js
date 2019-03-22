/**
 * 
 * 		logger.js
 * 		20180914 정종원
 * 		시스템 로그 기록
 */

var fs = require('fs');

(function(global) {
	
}(this));


exports.log = function(code, log) {
	
	let stream = fs.createWriteStream('logs/system.log', {'flags': 'w+'});

	
}