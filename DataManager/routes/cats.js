var express = require('express');
var router = express.Router();
var json = require('../service/utils/json.js');
var cerebro = require('../service/es/functions/cerebro.js');
var async = require('async');
var common = require('./common.js');

/**
 * 	/overview
 * @param req
 * @param res
 * @param next
 * @returns		overview jsonObject Data
 */
router.get('/overview', function(req, res, next) {
		
	let errObj = null;
	let nodes = null;
	let indices = null;
	let count = null;
	let shards = null;
	let allocation = null;
	
	common.setHeader(res);
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
	]);		
});

/**
 * 	/nodes
 * @param req
 * @param res
 * @param next
 * @returns	node data ojbect
 */
router.get('/nodes', function(req, res, next) {
		
	let allocation;
	let nodes;
	
	async.waterfall([
		function(cb) {
			cerebro.cat('allocation', function(err, resp){
				allocation = resp;
				cb(null);
			});
		},
		function(cb) {
			cerebro.cat('nodes', function(err, resp){
				nodes = resp;
				cb(null);
			});
		},
		function(err) {
			if(err) console.log(err);
			
			let resultObejct = "{}";
		}
	]);
});

/**
 * 	GET Index List
 * @param req
 * @param res
 * @param body
 * @returns
 */
router.get('/indices', function(req, res, body) {
	
	common.setHeader(res);
	cerebro.aliases(function(err, resp) {
				
		let resultObj = json.createErrObject('0');
		let obj = json.createJsonObject();
		let arr = json.getKeyArray(resp);
		
		json.addValue(obj, 'indices', arr);
		json.addValue(resultObj, 'data', obj);
		
		res.send(resultObj);
	});
});

module.exports = router;