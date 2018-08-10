/**
 * 		common.js
 * 		20180330 정종원
 * 		routes 에서 사용할 공통 함수 작성을 위한 문서
 */

/*
 * 		Header Setting for 304 Error
 */
module.exports.setHeader = function(res) {
	
	res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0)
}

/*
 * 		Elasticsearch 의 range 쿼리 작성
 * 
 */
module.exports.getTimeRange = function(query) {
	
	let gte = query.gte;
	let lte = query.lte;
	
	let range = '"range":{"@timestamp":{"gte":"' + gte + '","lte":"' + lte + '"}}';
	
	//console.log(range);
	
	return range;
}

/*
 * 		날짜 검색의 기간에 따라 쿼리에 들어갈 인터벌을 결정하는 함수
 */
module.exports.getPeriod = function(query) {
	
	let gte = query.gte;
	let lte = query.lte;
	
	console.log(lte - gte);
}

module.exports.getValue = function(value) {
	
	if(value == undefined) return null;
	else return value;
}