
// redis 

var redis = require('redis');
var JSON = require('JSON');
var express = require('express');
var cfg = require('../../bin/config.json');

var app = express();
 
client = redis.createClient(cfg.redisPort, cfg.redisIP); 

app.use(function(req,res,next){
      req.cache = client;
      next();
})

console.log("redis connection successful")

app.post('/profile',function(req,res,next){
      req.accepts('application/json');
   
      var key = req.body.name;
      var value = JSON.stringify(req.body);

      req.cache.set(key,value,function(err,data){
           if(err){
                 console.log(err);
                 res.send("error "+err);
                 return;
           }

           req.cache.expire(key,10);
           res.json(value);
           console.log(value);
      });
})

app.get('/profile/:name',function(req,res,next){
      var key = req.params.name;
      req.cache.get(key,function(err,data){

        if(err){
            console.log(err);
            res.send("error "+err);
            return;
        }

        var value = JSON.parse(data);
        res.json(value);
      });
});