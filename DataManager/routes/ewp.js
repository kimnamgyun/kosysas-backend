/**
*
*		EWP.js
*		EWP 와 통신하는 Rest API들
*		
*		20190712 정종원
*/

var express = require('express');
var router = express.Router();
var client = require('../service/es/elasticsearch.js');
var searchFunctions = require('../service/es/functions/search.js');
var json = require('../service/utils/json.js');
var common = require('./common.js');
var cfg = require('../conf/config.json');
var ewp = require('../service/ewp/ewp.js');
var async = require('async');
var promise = require('promise');

/**
 * 		GET EWP server list
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/servers', function(req, res, next) {
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	
	ewp.get('/api/v1/servers', null, function(err, resp) {
		
		console.log(resp);
		try {
			
			let total = resp.pagination.total;
			let size = resp.pagination.size;
			let servers = resp.servers;
			let results = new Array();				// 정제한 서버를 정보를 담을 배열
			
			json.addValue(obj, 'count', size);
			
			async function test() {
				
				for(let i = 0; i < size; i++) {
					
					let tmp = json.createJsonObject();
					let srv = servers[i];
					
					json.addValue(tmp, 'target', srv.dns_name);
					json.addValue(tmp, 'status', srv.status);
					// 마지막 상태 추가 필요
					await getReportData(srv.id).then(function(date) {
						json.addValue(tmp, 'date', common.dateCalculate(date));
					})
					await getRisk(srv.cloud_provider_id).then(function(risk) {
						json.addValue(tmp, 'risk', risk);
					});
					// SCAN 용도 id 
					json.addValue(tmp, 'id', srv.id);
					//json.addValue(tmp, 'p_id', srv.cloud_provider_id);
					results.push(tmp);
				}
				
				json.addValue(obj, 'servers', results);
				json.addValue(resultObj, 'data', obj);
				res.send(resultObj);
			}
			test();			
		}
		catch (e) {
		
			console.log(e);
			json.addValue(obj, 'msg', 'No JSON Data');
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
			res.send(resultObj);
		}
	})
});

/**
 * 		GET Reports List
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/reports', function(req, res, next) {
	
	let from = (req.query.page != null ? req.query.page : 0) * 10;
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	let arr = new Array();
	
	common.setHeader(res);
	
	ewp.get('/api/v1/reports', null, function(err, resp) {
		
		console.log(resp);

		async function reports() {
			
			let count = resp.length;
			json.addValue(obj, 'count', count);
			
			count = (count - from) <= 10 ? count : from + 10;
			
			for(let i = from; i < count; i ++){
				
				let vArr = resp[i];
				let tmp = json.createJsonObject();
				
				json.addValue(tmp, 'date', vArr.start_scan);
				
				// 위험도 계산
				if (vArr.nr_errors != 0) json.addValue(tmp, 'lv', 'Critical');
				else if(vArr.nr_warnings != 0) json.addValue(tmp, 'lv', 'Warning');
				else json.addValue(tmp, 'lv', 'info');
				
				await getServerName(vArr.instance_id).then(function(name) {
					json.addValue(tmp, 'target', name);
				})
				
				if(vArr.output == 'SUCCESS') json.addValue(tmp, 'status', 'DONE');
				else json.addValue(tmp, 'status', 'FAIL');
				
				json.addValue(tmp, 'id', vArr.id);
				
				arr.push(tmp);
			}
			
			json.addValue(obj, 'reports', arr);
			json.addValue(resultObj, 'data', obj);
			res.send(resultObj);
		}
		
		try {			
			reports();
		}
		catch(e) {
			
			console.log(e);
			json.addValue(obj, 'msg', 'No JSON Data');
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
			res.send(resultObj);
		}
	});
});

/**
 * 		GET Report with id
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/report/:id', function(req, res, next) {
	
	let from = (req.query.page != null ? req.query.page : 0) * 10;
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	let vArr = new Array();
	let id = req.params.id;
	
	common.setHeader(res);
	
	ewp.get('/api/v1/reports/' + id , null, function(err, resp) {
		
		try {
			let val = resp;
			
			json.addValue(obj, 'date', common.dateCalculate(val.start_scan));		
			
			if (val.nr_errors != 0) json.addValue(obj, 'lv', 'Critical');
			else if(vArr.nr_warnings != 0) json.addValue(obj, 'lv', 'Warning');
			else json.addValue(obj, 'lv', 'info');
			
			if(val.output == 'SUCCESS') json.addValue(obj, 'status', 'DONE');
			else json.addValue(obj, 'status', 'FAIL');
			
			json.addValue(obj, 'n_err', val.nr_errors);
			json.addValue(obj, 'n_warn', val.nr_warnings);
			json.addValue(obj, 'n_infos', val.nr_infos);
			
			let count = val.vulnerabilities.length;			
			json.addValue(obj, 'vul_count', count);
			count = (count - from) <= 10 ? count : from + 10;
			
			for(let i = from; i < count; i++ ){
				
				let vulValue = val.vulnerabilities[i];
				let tmp = json.createJsonObject();
				
				json.addValue(tmp, 'name', vulValue.name);
				json.addValue(tmp, 'description', vulValue.description);
				json.addValue(tmp, 'id', vulValue.id);
				
				vArr.push(tmp);
			}
			
			json.addValue(obj, 'vul', vArr);
			json.addValue(resultObj, 'data', obj);
			res.send(resultObj);
		}
		catch(e) {
			console.log(e);
			json.addValue(obj, 'msg', 'No JSON Data');
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
			res.send(resultObj);
		}
	});
})

/**
 * 		Get Download report with id
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/report/download/:id', function(req, res, next) {
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	let id = req.params.id;
	
	common.setHeader(res);
	
	ewp.get('/api/v1/reports/' + id + '/pdf', null, function(err, resp) {
		
		try {
			console.log(resp);
		}
		catch(e) {
			
		}
		
		res.send(resp);
	});
})

/**
 * 		POST Start EWP Scan
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/scan/start/:id', function(req, res, next) {
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	let id = req.params.id;
	
	common.setHeader(res);
	
	ewp.post('/api/v1/servers/' + id + '/scan/start', null, function(err, resp) {
		
		console.log(resp);
		try {
			json.addValue(resultObj, 'data', resp);
		} catch(e) {
			
		}
		res.send(resultObj);
	});
})

/**
 * 		POST Stop EWP Scan
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/scan/stop/:id', function(req, res, next) {
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	let id = req.params.id;
	
	common.setHeader(res);
	
	ewp.post('/api/v1/servers/' + id + '/scan/stop', null, function(err, resp) {
		
		console.log(resp);
		try {
			json.addValue(resultObj, 'data', resp);
		} catch(e) {
			
		}
		res.send(resultObj);
	});
})

router.get('/config', function(req, res, next) {
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	
	common.setHeader(res);
	
	ewp.get('/api/v1/workload_analytics/config', null, function(err, resp) {
		
		console.log(resp);
		try {
			
		} catch(e) {
			
		}
		res.send(resultObj);
	});
})

router.get('/config/:id/:worker', function(req, res, next) {
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	let id = req.params.id;
	let worker = req.params.worker;
	
	common.setHeader(res);
	
	ewp.get('/api/v1/workload_analytics/' + id + '/config?' + worker, null, function(err, resp) {
		
		console.log(resp);
		try {
			
		} catch(e) {
			
		}
		res.send(resultObj);
	});
})

/**
 * 		GET Server with IP
 * @param req
 * @param res
 * @param next
 * @returns
 */
router.get('/server/:id', function(req, res, next) {
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	let id = req.params.id;
	
	common.setHeader(res);
	
	ewp.get('/api/v1/servers/'+ id, null, function(err, resp) {
	
		console.log(resp);
		
		try {
			
			
			json.addValue(resultObj, 'data', resp);
		}
		catch(e) {
			
			console.log(e);
			json.addValue(obj, 'msg', 'No JSON Data');
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
		}
		res.send(resultObj);
	});
});

router.get('/provider/:id', function(req, res, next) {
	
	let resultObj = json.createErrObject('0');
	let obj = json.createJsonObject();
	let id = req.params.id;
	
	common.setHeader(res);
	
	ewp.get('/api/v1/providers/'+id+'/risks', null, function(err, resp) {
	
		console.log(resp);
		
		try {
			json.addValue(resultObj, 'data', resp);
		}
		catch(e) {
			
			console.log(e);
			json.addValue(obj, 'msg', 'No JSON Data');
			json.addValue(resultObj, 'data', obj);
			json.editValue(resultObj, 'error', '002');
		}
		res.send(resultObj);
	});
});


/****************************************************
 * 
 * 					FUNTIONS
 * 
 ****************************************************/

/**
 * 		GET Risk Point For EWP Provider
 * @param id	EWP Provider ID
 */
getRisk = function(id) {
	
	return new Promise(function(resolve) {
		let risk = 0;
		
		ewp.get('/api/v1/providers/' + id + '/risks', null, function(err, resp) {
			
			try {			
				let obj = resp;
				//console.log(obj.global.risk);			
				resolve(obj.global.risk);
			}
			catch(e) {
				console.log(e);
			}
		})
	})
};

/**
 * 		GET Report Date For EWP id
 *	@param id 	EWP Instance id
 */
getReportData = function(id) {
	
	return new Promise(function(resolve) {
		let data = null;
		
		ewp.get('/api/v1/servers/'+id+'/reports/last', null, function(err, resp) {
			
			try {
				let obj = resp;
				// 날짜 처리 - 추후에
				resolve(obj.start_scan);
			}
			catch(e) {
				console.log(e);
			}
		})
	})
}

/**
 * 		GET Server name with ID
 */
getServerName = function(id) {
	
	return new Promise(function(resolve) {
		let data = null;

		ewp.get('/api/v1/servers/' + id, null, function(err, resp) {
			
			try {
				resolve(resp.name);
			}
			catch(e) {
				console.log(e);
			}
		})
	})
}

router.get('/cb', function(req, res, next) {

	/*
	async.waterfall([
		function(cb) {
			cerebro.cat('count', function(err, resp){
				if(json.getValue(err, 'error') != '0') errObj = err;
				count = resp;
				cb(null);
			});
		},
		function(cb) {
			cerebro.cat('nodes', function(err, resp){
				if(json.getValue(err, 'error') != '0') errObj = err;
				nodes = resp;
				cb(null);
			});
		},		
		function(cb) {
			cerebro.cat('indices', function(err, resp){
				if(json.getValue(err, 'error') != '0') errObj = err;
				indices = resp;
				cb(null);
			});
		},
		function(cb) {
			cerebro.cat('shards', function(err, resp){
				if(json.getValue(err, 'error') != '0') errObj = err;
				shards = resp;
				cb(null);
			});
		},
		function(cb) {
			cerebro.cat('allocation', function(err, resp){
				if(json.getValue(err, 'error') != '0') errObj = err;
				allocation = resp;
				cb(null);
			});
		},
		function(err) {
			if(nodes && indices && shards && count && allocation) {
				
				let resultObj = json.createErrObject('0');
				let obj = json.createJsonObject();
				
				let temp = json.getValue(nodes, 'length')
				if(temp) { json.addValue(obj, "node", temp); }
				else {					
					json.editValue(resultObj, 'error', '002');
				}
				
				temp = json.getValue(indices, 'length')
				if(temp) { json.addValue(obj, "indices", temp); }
				else {					
					json.editValue(resultObj, 'error', '002');
				}
				
				temp = json.getValue(shards, 'length')
				if(temp) { json.addValue(obj, "shards", temp); }
				else {					
					json.editValue(resultObj, 'error', '002');
				}
				
				temp = json.getValue(count[0], 'count')
				if(temp) { json.addValue(obj, "docs", temp); }
				else {					
					json.editValue(resultObj, 'error', '002');
				}
				
				temp = json.getValue(allocation[0], 'disk.used')
				if(temp) { json.addValue(obj, "disk", temp); }
				else {					
					json.editValue(resultObj, 'error', '002');
				}
				temp =json.getValue(allocation[0], 'disk.percent');
				if(temp) { json.addValue(obj, "disk_percent", temp); }
				else {					
					json.editValue(resultObj, 'error', '002');
				}
	
				json.addValue(resultObj, 'data', obj);
				//console.log(resultObj);
				//res.send(resultObj);
				next(resultObj);
			}
			else {
				
				json.addValue(errObj, 'error', '001');
				next(errObj);
				//res.send(errObj);
			}
		}
		*/
});



module.exports = router;