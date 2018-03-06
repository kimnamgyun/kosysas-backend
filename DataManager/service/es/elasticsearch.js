var elasticsearch=require('elasticsearch');
var cfg = require('../../conf/config.json');

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