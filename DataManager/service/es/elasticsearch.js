var elasticsearch=require('elasticsearch');
var cfg = require('../../bin/config.json');

let configuration = {
  host: cfg.esIP,
  port: cfg.esPort,
  user: cfg.esUserName, 
  password: cfg.esUserPasswd
}

var client = new elasticsearch.Client( {  
  hosts: [///////////
  ]
});

module.exports = client;  