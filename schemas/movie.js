var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
	title: String,
	director: String,
	language: String,
	country: String,
	poster: String,
	flash: String,
	summary: String,
	year: Number,
	meta: {
		createdAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

MovieSchema.pre('save',function(next){  //pre('save')意为每次保存前先调用这个回调方法
	if(this.isNew) {
		this.meta.createdAt = this.meta.updateAt = Date.now();
	}else {
		this.meta.updateAt = Date.now();
	}

	next();  //在pre('save')中调用next，这样才会将存储流程走下去
});

//此处静态方法不会直接与数据库进行交互，只有经过model编译、实例化后，才会具有这个方法
MovieSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	},
	findById: function(id, cb){
		return this.
			findOne({_id: id})
			.exec(cb);
	}
}

module.exports = MovieSchema;
