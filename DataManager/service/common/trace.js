/**
 *  service Logger.
 *  
 *  author: pennyPark (jypark@kosyas.com)
 *  createDate : 2018-04-05
 *  
 *  updateDate :
 *  updateAuthor:
 *  updateContent:   
 */

var logger = exports;
logger.debugLevel = 'warn';

logger.log = function(level, message) {
	var levels = ['error', 'warn', 'info'];
	
	if (levels.indexOf(level) >= levels.indexOf(logger.debugLevel) ) {
	  if (typeof message !== 'string') {
	    message = JSON.stringify(message);
	  };
	  console.log(level+': '+message);
    }
}
  

var logger = require('./logger');

function infoLog(errorCode, errorMsg) {
	logger.log('info', errorMsg);
}
 
function warnLog(errorCode, errorMsg) {
	logger.log('warn', errorMsg);
}

function errorLog(errorCode, errorMsg) {
	logger.log('error', errorMsg);
	
}