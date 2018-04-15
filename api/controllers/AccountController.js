function validEmail(email) {
  return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(
    email
  );
}

module.exports = {
	login  : function(req,res){
		var params = req.allParams();
		if(!params.email || !validEmail(params.email))
			return res.send(401, { error : true, message : "El correo es obligatorio ó no es valido", status : 401 });
		if(!params.password || params.password.length <= 5)
			return res.send(401, { error : true, message : "la contraseña es muy corta", status : 401 });
		async.waterfall([
			function existUser(cb){
				UserService.existsByEmail(params.email)
			}
		],function done(err,result){
			if(err && err.status)
				return res.send(err.status,err);
			else if(err)
				return res.send(500, { error : true , message : "Internal server error", status : 500 });
			return res.json(result);
		}); 
	},
	create : function(req,res){
		var params = req.allParams();

		//validamos los campos
		if(!params.firstName || params.firstName.length <= 3)
			return res.send(401, { error : true, message : "El nombre es obligatorio o es muy corto", status : 401 });
		if(!params.lastName || params.lastName.length <= 3)
			return res.send(401, { error : true, message : "El apellido es obligatorio o es muy corto", status : 401 });
		if(!params.password || params.password.length <= 5)
			return res.send(401, { error : true, message : "la contraseña es muy corta", status : 401 });
		// validamos el email
		if(!params.email || !validEmail(params.email))
			return res.send(401, { error : true, message : "El correo es obligatorio ó no es valido", status : 401 });

		async.waterfall([
			function existsEmail(cb){
				UserService.existsByEmail(params.email)
					.then(function($exists){
						if($exists)
							return cb({ error : true, message : "El usuario ya existe", status : 401 });
						return cb(null,$exists);
					})
					.catch(cb);
			},
			function createHash($exists,cb){
				UserService.password(params.password)
					.then(function($HASHpassword){
						return cb(null,$HASHpassword);
					}).catch(cb);
			},
			function inserUser($HASHpassword,cb){
				UserService.create(params,$HASHpassword)
					.then(function($user){
						delete $user.password;
						return cb(null,$user);
					}).catch(cb);
			}
		], function done(err,result){
			if(err && err.status)
				return res.send(err.status,err);
			else if(err)
				return res.send(500, { error : true , message : "Internal server error", status : 500 });
			return res.json(result);
		});
	}
}