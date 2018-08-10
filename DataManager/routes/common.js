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
	
	let gte = query.gte != null ? query.gte : "2018-01-01T00:00:00.000Z";
	let lte = query.lte != null ? query.lte : "2018-08-31T00:00:00.000Z";
	
	let range = '"range":{"@timestamp":{"gte":"' + gte + '","lte":"' + lte + '"}}';
	
	//console.log(range);
	
	return range;
}

/*
 * 		날짜 검색의 기간에 따라 쿼리에 들어갈 인터벌을 결정하는 함수
 */
module.exports.getInterval = function(query) {
	
	let gte = query.gte.substr(0, 10).split('-');
	let lte = query.lte.substr(0, 10).split('-');
	let score = 0;
	let interval;
	
	// 0 : year, 1 : month, 2: day
	// year는 365점, month 30점, day 1점
	// 각 점수를 가산하여 총 기간을 구해, 해당 기간만큼 인터벌을 결정한다.
	score = ((lte[0] - gte[0]) * 365) + ((lte[1] - gte[1]) * 30) + ((lte[2] - gte[2]));
	
	if(score <= 10) interval = "day";
	else if(score > 10 && score <= 70) interval = "week";
	else if(score > 70 && score <= 300) interval = "month";
	else if(score > 300) interval = "quarter"

	return interval;
}

/*
 * 		쿼리 결과 : 배열형 데이터 처리 함수
 */
module.exports.queryResultArr = function(count, value) {
	
	let arr = new Array();
	for(let i = 0; i < count; i++) {
		
		if(value[i] != null) arr.push(value[i]);
	}
	
	return arr;
}