var express = require('express');
var router = express.Router();
var client = require('../../service/es/elasticsearch.js');
var searchFunctions = require('../../service/es/functions/search.js');
var json = require('../../service/utils/json.js');
var common = require('../common.js');

router.get('/', function(req, res, body) {
	
	res.render('index', { title: 'elasticsearch' });
});

module.exports = router;