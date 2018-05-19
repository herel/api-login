var aws = require('aws-sdk');

aws.config.update({
	accessKeyId 		: process.env.MAIN_S3_KEY,
	secretAccessKey 	: process.env.MAIN_S3_KEY_SECRET
});

var s3 = new aws.S3();


module.exports = {
	base64 : function(base64,fileName){
		return new Promise(function (resolve, reject){
			var decodedImage = new Buffer(base64.replace('data:image/png;base64,',''), 'base64');
			s3.upload({
				Bucket: process.env.MAIN_S3_BUCKET,
				Key: fileName,
				Body: decodedImage
			}, function (err, data) {
				if(err)
					return reject(err);
				return resolve(data);
			});
		});
	}
}