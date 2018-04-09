/**
 *  XML parser (https://www.npmjs.com/package/xml2js)
 *  
 *  author: pennyPark (jypark@kosyas.com)
 *  createDate : 2018-04-04
 *  
 *  updateDate :
 *  updateAuthor:
 *  updateContent:   
 */

var xml2js = require('xml2js');
var util = require('util');
var fs = require('fs'); 

var path = './repository/xml/sqlQuery.xml'; 
var querys;


/**
 * path를 주고 초기화
 * 
 * @param xmlPath
 * @returns
 */
function init (xmlPath) {
	this.path = xmlPath;
	
	init();
}


/**
 * 초기화
 * 
 * @returns
 */
function init () {
	try{
		
		var xml = fs.readFileSync(path, 'utf-8');
		
		var parser = new xml2js.Parser({ explicitArray: true });
		
		parser.parseString(xml, function(err, result) {		
			if(err) {				
				throw err;
			} 
			
			querys = result['list']['query']; 
		}); 
		
	} catch (err) {
		console.log("xmlParser.getQuery() \n "+err.stack);
	}
}


/**
 * queryID에 해당하는 query를 얻는다. 
 * 
 * @param queryID 
 * @returns
 */ 
//exports.getQuery = function(queryID) {
//getQuery = function(queryID) {
function getQuery(queryID) {
	console.log("------------------ ");
	
	if(this.querys == null) {
		console.log("xmlParser.getQuery() :: querys == null !");
		
		init();
	} 
 
	console.log("xmlParser.getQuery() ::"+querys );
	
	for(var index=0; index< querys.length; index++ ) {
		var id = querys[index]['$']['id'];
		var query = querys[index]['_'];
		
		
		 
		if(queryID == id) {
			console.log("xmlParser.getQuery() :: ["+index+"] "+id +", "+query );
			
			return query;
		}
	}
}

exports.getQueryWithXMLPath = function(xmlPath, queryID) {
	init(xmlPath);	  
	
	getQuery(queryID);
}



//
getQuery('chpw/:id');

//var pp = require('xmlParser');
//getQueryWithXMLPath('../../repository/xml/sqlQuery.xml', 'login');


