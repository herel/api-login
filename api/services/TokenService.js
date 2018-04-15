var jwt = require("jsonwebtoken");

module.exports = {
	create : function(data,expire){
		return new Promise(function(resolve, reject) {
			var create = moment().unix();
			var expire = expire ? expire : moment() .add(6, "month").unix();
			var dataToken = {
				userId: data._id.toString(), //id de mongo
				create: create,
				expire: expire
			};

			var token = jwt.sign(dataToken, process.env.TOKEN_KEY);
			var expire = 3600 * 24 * 30; //30 dias dura el token
			RedisService.set("TOKEN::" + data._id, dataToken, expire)
				.then(function(data) {
					return resolve(token);
				})
				.catch(function(e) {
					return reject(e);
				});
		})
	}
}