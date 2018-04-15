var ObjectId = require('mongodb').ObjectID
var bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = {
	validPassword : function(hashdb,plainpassword){
		return new Promise(function(resolve, reject) {
			bcrypt.compare(plainpassword, hashdb, function(err, res) {
				if (err)
					return reject({
						error: true,
						message: 'Internal server error',
						status: 500
					})	
				return resolve(res ? true : false)
			})
		})
	},
	password: function(password) {
	return new Promise(function(resolve, reject) {
	  bcrypt.genSalt(saltRounds, function(err, salt) {
	    if (err)
	      return reject({
	        error: true,
	        message: 'Internal server error',
	        status: 500
	      })
	    bcrypt.hash(password, salt, function(err, hash) {
	      if (err)
	        return reject({
	          error: true,
	          message: 'Internal server error',
	          status: 500
	        })
	      return resolve(hash)
	    })
	  })
	})
	},
	findByEmail   : function(email){
		return new Promise(function(resolve, reject) {
			User.native(function(err, collection) {
				if(err)
					return reject({ error : true, message : "Internal server error" , status : 500 });
				collection.findOne({
					active : true,
					email  : email
				},function(err,user){
					if(err)
						return reject({ error : true, message : "Internal server error", statis : 500 });
					return resolve( user );
				});
			})
		});
	},
	existsByEmail : function(email){
		return new Promise(function(resolve, reject) {
			User.native(function(err, collection) {
				if(err)
					return reject({ error : true, message : "Internal server error" , status : 500 });
				collection.count({
					email : email
				},function(err,total){
					if(err)
						return reject({ error : true, message : "Internal server error", statis : 500 });
					return resolve( (total ? true : false  ) );
				});
			})
		});
	},
	create : function(params,password){
		//recuerda usar siempre promise se vera mas pro tu desarrollo ;)
		return new Promise(function(resolve, reject) {
			User.native(function(err, collection) {
				if(err)
					return reject({ error : true, message : "Internal server error" , status : 500 });
				var query = {
					active 		: true,
					createdAt 	: new Date(),
					email 		: params.email,
					password 	: password
				}

				if(params.firstName)
					query.firstName = params.firstName;
				if(params.lastName)
					query.lastName  = params.lastName;


				collection.insert(query,function done(err,result){
					if(err)
						return reject({ error : true, message : "Internal server error", statis : 500 });
					//todo salio bien :D regresamos el user que se inserto
					return resolve(result.ops[0]);
				});
			});
		})
	}
}