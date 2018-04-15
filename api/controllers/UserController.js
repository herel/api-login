module.exports = {
	update : function(req,res){
		var params = req.allParams();
		var userId = req.userId;

		// validamos que los parametros a actualizar sean validos
		if(!params.firstName || params.firstName.length <= 3)
			return res.send(401, { error : true, message : "El nombre es obligatorio o es muy corto", status : 401 });
		if(!params.lastName || params.lastName.length <= 3)
			return res.send(401, { error : true, message : "El apellido es obligatorio o es muy corto", status : 401 });
		async.waterfall([
			function updateUser(cb){
				UserService.update(userId,params)
					.then(function($user){
						if(!$user)
							return cb({ error : true, message : "El usuario no existe", status : 404 });
						return cb(null,$user);
					}).catch(cb);
			}
		],function done(err,result){
			if (err && err.status) return res.send(err.status, err);
			else if (err)
				return res.send(500, {
					error: true,
					message: "Internal server error",
					status: 500
				});
			return res.json(result);
		});
	}
}