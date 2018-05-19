var moment  = require('moment');
module.exports = {
	upload : function(req,res){
		var params = req.allParams();
		var date   = moment().format('DD-MM-YYY-hh-mm-ss');
		if(!params.image)
			return res.send(412, { error : true, message : "image is required", status : 412 });
		async.waterfall([
			function upload(cb){
				UploadService.base64(params.image,`${date}.png`)
					.then(function($result){
						return cb(null,$result);
					}).catch(cb)
			}
		], function done(err,result){
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