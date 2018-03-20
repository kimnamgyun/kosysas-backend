var express = require('express');
var router = express.Router();
var request = require('request');
var wazuh = require('../../service/es/functions/wazuh.js');

var id = "foo";
var pw = "bar";
var host = "192.168.0.110:55000";


module.exports = router;