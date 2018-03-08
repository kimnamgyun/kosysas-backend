/*
 * 		elaticsearch 검색 함수
 * 		20180306 정종원
 */

module.exports.matchAll = function(es, idx, callback) {
	
	es.search({
		index: idx,
	    body: {
	      query: {
	        match_all: {
	        }
	      }
	    }
	  }).then(function (resp) {
		  callback(resp.hits.hits);
	  }, function (err) {
		  callback(err);
		  console.log(err.message);	
	  });
};

module.exports.match = function(es, idx, searchData, callback) {
	
	es.search({
		index: idx,
		body: {
			query: {
				match: {
					_type: searchData
				}				
			}
		}
	}).then(function(resp) {
		callback(resp.hits.hits);		
	}, function(err) {
		callback(err);
		console.log(err);
	});
};

/*
module.exports.freeQuery = function(es, idx, searchData, callback) {
	
	es.search({
		index: idx,
		body: {
			searchData
		}
	}).then(function(resp) {
		callback(resp.hits.hits)
	}, function(err) {
		callback(err);
		console.log(err);
	});
};
*/