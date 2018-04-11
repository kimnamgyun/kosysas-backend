var elasticsearch=require('elasticsearch');
var cfg = require('../../conf/config.json');

let config = {
  ip: cfg.esIP,
  port: cfg.esPort,
  user: cfg.esUserName, 
  password: cfg.esUserPasswd
}

var client = new elasticsearch.Client( {  
  hosts: [config.ip + ":" + config.port
	  // 'https://[username]:[password]@[server]:[port]/'
  ]
});

module.exports.reConnect = function() {
	this.client = new elasticsearch.Client( {
		hosts: [
			config.ip + ":" + config.port
		]
	});
};

module.exports = client;  