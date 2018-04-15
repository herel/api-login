module.exports = async function(req, res, next) {
	var token = req.headers.authorization;
	// si no viene el token mandamos el error 401
	if(!token)
		return res.send(401,{ error : true, message : "token is required", status : 401 })
	TokenService
		.decode(token)
		.then(function(decoded) {
			RedisService.get("TOKEN::" + decoded.userId)
				.then(function(result) {
					if(!result){
						//el token no existe en redis ya expiro
						//lo idea es mandar un error 403 para que en nuestra app se cierre en automatico cada vez que un en point
						// conteste el status 403
						return res.send(403,{ error : true, message : "La sesion ya expirto", status : 403 });
					}
					//si los datos del token son iguales a los que estan en redis entonces
					// el token es valido
					// si es diferente entonces el usuario inicio sesion en otro dispotivo y se anulo el token actual
					if( result.create == decoded.create &&
						result.expire == decoded.expire &&
						decoded.userId == result.userId){
						//aqui esta la magia a nuestro req le agregamos el userId que hizo la petición ya mostrare en el controller
						// como utilizar esta variable
						req.userId = result.userId.toString();
						//mandamos la peticion a nuestro controller
						return next();
					}else
						return res.send(403,{ error : true, message : "La sesion ya expirto", status : 403 });
				}).catch(function(err){
					return res.send(500,{ error : true, message : "Internal server error", status : 500 });
				});
		})
		.catch(function(err){
			//ocurrio un error al decodificar o alguien genero un token con el key incorrecto.
			return res.send(500,{ error : true, message : "Internal server error", status : 500 });
		});
}