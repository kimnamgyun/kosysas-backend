/*
 * 		json
 * 		20180228 정종원
 * 		JSON 관련 함수
 */

// 비어있는 json Object를 생성한다.
exports.createJsonObject = function() {
	let obj = '{}';
	return this.stringToJsonObject(obj);
}

// 에러 response용 오브젝트를 생성한다.
exports.createErrObject = function(errCode) {

	let obj = this.createJsonObject();
	this.addValue(obj, 'error', errCode);
	return obj;
}

// json 확장자 파일을 읽어들인다.
exports.readJsonFile = function(path, filename) {
	
	var jsonObject = require(path, filename, "json");
	return jsonObject;
}

// JsonObject를 String으로 변환한다.
exports.jsonObjectToString = function(jsonObject) {
	
	return JSON.stringify(jsonObject);
}

// String을 JsonObject로 변환한다.
exports.stringToJsonObject = function(string) {
	
	return JSON.parse(string);
}

// JsonObject가 해당 key 값을 가지고 있는지 체크한다.
exports.hasOwnProperty = function(jsonObject, key) {
	
	return jsonObject.hasOwnProperty(key);
}

// JsonObject에 새로운 key와 value를 추가한다.
exports.addValue = function(jsonObject, key, value) {
	
	if(jsonObject.hasOwnProperty(key)) {
		console.log("json 데이터에 동일한 키가 존재합니다.");
		return false;
	}
	else {
		if(value) {
			jsonObject[key] = value;
			return true;
		}
		else {
			console.log('value is null');
			return false;
		}		
	}
}

// JsonObject에 들어있는 특정 key를 삭제한다.
exports.deleteKey = function(jsonObject, key) {
	
	if(jsonObject.hasOwnProperty(key)) {
		delete jsonObject[key];
		return true;
	}
	else {
		console.log("json에 해당 키가 존재하지 않습니다.")
		return false;
	}
}

// JsonObject에 들어있는 특정 값을 리턴한다.
exports.getValue = function(jsonObject, key) {
	
	if(jsonObject.hasOwnProperty(key)) {
		
		return jsonObject[key];
	}
	else {
		
		console.log("json에 해당 키가 존재하지 않습니다.");
		return null;
	}
}

// 특정 key가 존재하면 해당 value를 수정한다.
exports.editValue = function(jsonObject, key, value) {
	
	if(jsonObject.hasOwnProperty(key)) {
		
		jsonObject[key] = value;
		return true;
	}
	else {
		
		console.log("해당 키가 존재하지 않습니다.");
		return false;
	}
}

// JsonObject를 돌며 각 key 와 value 값을 출력한다.
exports.roundJsonObject = function(jsonObject) {
	
	for(var key in jsonObject) {
		
		console.log("key :", key, ", value : ", jsonObject[key]);
	}
}