module.exports = function(req, res, next) {
	var token = req.headers.authorization;
	// si no viene el token mandamos el error 401
	if(!token)
		return res.send(401,{ error : true, message : "token is required", status : 401 })
	TokenService
		.decode(token)
		.then(function(decoded) {
			
		})
		.catch(function(err){
			//ocurrio un error al decodificar o alguien genero un token con el key incorrecto.
			return res.send(500,{ error : true, message : "Internal server error", status : 500 });
		});
}