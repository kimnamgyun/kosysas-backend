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

this.client.cluster.health({}, function(err, resp, status) {
	console.log("-- Client Error : [ ", err, " ] --")
	console.log("-- Client Status : [ ", status, " ] --")
	console.log("-- Client Health --\n", resp)	
});

module.exports = client;  