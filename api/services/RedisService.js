var redis   = require("redis");
var flat  = require('flat');
var unflat = require('flat').unflatten;
var bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var client;

module.exports = {
  prepareConnect  : function(){
    return redis;
  },
  setConnection   : function(connection){
    client =  connection;
  },
  setExpire : function(key,expire){
    return new Promise(function (resolve, reject){
      client.expire(key,expire, function (err, expireResult) {
        if(err)
          return reject(err);
        return resolve(expireResult);
      });
    });
  },
  set : function (key,obj,expire) {
    return new Promise(function (resolve, reject){
      client.hmset(key,flat(obj),function (err, result) {
        if(err)
          return reject(err);

        if (expire) {
          client.expire(key,expire, function (err, expireResult) {
            if(err)
              return reject(err);
            return resolve(expireResult);
          });
        }else{
          return resolve(result);
        }
        });
    });
  },
  setString : function(key,store){
    return new Promise(function (resolve, reject){
      client.set(key,store,function(err,result){
        if(err)
          return reject(err);
        return resolve(result);
      });
    });
  },
  getString : function(key){
    return new Promise(function (resolve, reject){
      client.get(key,function(err,result){
        if(err)
          return reject(err);
        return resolve(result);
      });
    });
  },
  get : function(key) {
    return new Promise(function (resolve, reject){
      client.hgetall(key,function (err, obj) {
        var hash = unflat(obj) ? unflat(obj): {notFoundAtRedis: true};
        if(err)
          return reject(err);
        return resolve(hash);
        });
    });
  },
  delete      : function(key){
    return new Promise(function (resolve, reject){
      client.del(key,function(err,result){
        if(err)
          return reject(err)
        return resolve(result);
      })
    });
  },
  existsKey     : function(key){
    return new Promise(function (resolve, reject){
      client.exists(key,function(err,result){
        if(err)
          return reject(err);
        return resolve(result);
      })
    });
  },
  native      : function(){
    return  client;
  }
}
