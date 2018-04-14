/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function(done) {

  
  var client = RedisService.prepareConnect().createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
  client.on('connect',function(){
      sails.log.debug('Redis connected');
      client.select(process.env.REDIS_DB);
      RedisService.setConnection(client);
    return done();
  });

};
