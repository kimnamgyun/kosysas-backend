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
 * 		Elasticsearch Query Maker
 * 
 */
module.exports.makeQuery = function(idx) {
	
}