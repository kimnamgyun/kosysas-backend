var elasticsearch=require('elasticsearch');
var cfg = require('../../bin/config.json');

let configuration = {
  host: cfg.esIP,
  port: cfg.esPort,
  user: cfg.esUserName, 
  password: cfg.esUserPasswd
}

var client = new elasticsearch.Client( {  
  hosts: ["192.168.0.203:9200"
	  // 'https://[username]:[password]@[server]:[port]/'
  ]
});

module.exports.reConnect = function() {
	this.client = new elasticsearch.Client( {
		hosts: [
			"192.168.0.203:9200"
		]
	});
};

module.exports = client;  