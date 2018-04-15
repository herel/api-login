module.exports = {
	update : function(req,res){
		var params = req.allParams();
		var userId = req.userId;

		// validamos que los parametros a actualizar sean validos
		if(!params.firstName || params.firstName.length <= 3)
			return res.send(401, { error : true, message : "El nombre es obligatorio o es muy corto", status : 401 });
		if(!params.lastName || params.lastName.length <= 3)
			return res.send(401, { error : true, message : "El apellido es obligatorio o es muy corto", status : 401 });
		...
	}
}