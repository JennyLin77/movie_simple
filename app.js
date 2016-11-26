var express =require('express');
var path = require('path');
var bodyParser = require('body-parser');  //用于将表单数据格式化
var mongoose = require('mongoose');
var _ = require('underscore');   //用underscore模板的extend方法，可将另一个对象的新字段替换老对象的对应字段
var Movie = require('./models/movie');
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/movie');

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '/public')));
app.locals.moment = require('moment');
app.listen(port);

console.log('movie started on port ' + port);

// index page
app.get('/',function(req,res){
	Movie.fetch(function(err, movies){
		if (err) {
			console.log(err);
		}

		res.render('index',{
			title: 'movie 首页',
			movies: movies
		})
	});
})

// detail page
app.get('/movie/:id',function(req,res){
	var id = req.params.id;

	Movie.findById(id, function(err, movie){
		res.render('detail',{
			title: 'movie ' + movie.title,
			movie: movie
		})
	});
});

// admin page
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title: 'movie 后台录入页',
		movie: {
			title: '',
			director: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''
		}
	})
});

// admin update movie
app.get('/admin/update/:id', function(req,res){
	var id = req.params.id;

	if(id){
		Movie.findById(id, function(err, movie){
			res.render('admin',{
				title: 'movie 后台更新页',
				movie: movie
			})
		})
	}
});

// admin post movie
app.post('/admin/movie/new', function(req, res){
	var movieObj = req.body.movie;
	var id = movieObj._id;
	var _movie;

	if (id !== 'undefined') {
		Movie.findById(id, function(err, movie){
			if (err) {
				console.log(err);
			}
			
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie){
				if (err) {
					console.log(err);
				}

				res.redirect('/movie/' + movie._id);
			});
		})
	}else {
		_movie = new Movie({  // _id是mongodb自动生成的
			title: movieObj.title,
			director: movieObj.director,
			language: movieObj.language,
			country: movieObj.country,
			poster: movieObj.poster,
			flash: movieObj.flash,
			summary: movieObj.summary,
			year: movieObj.year
		});

		_movie.save(function(err, movie){
			if (err) {
				console.log(err);
			}

			res.redirect('/movie/' + movie._id);
		});
	}
});



// list page
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err, movies){
		if (err) {
			console.log(err);
		}

		res.render('list',{
			title: 'movie 列表页',
			movies: movies
		})
	});
});

//list delete movie
app.delete('/admin/list',function(req,res){
	var id = req.query.id;
	
	if (id) {
		Movie.remove({_id: id}, function(err, movie){
			if (err) {
				console.log(err);
			}else {
				res.json({success: 1})
			}
		})
	}
});

/*movies: [{
	title: '爸爸去哪儿4第一期',
	_id: 1,
	director: '芒果台',
	country: '中国',
	year: 2016,
	poster: '/img/poster1.jpg',
	language: '中文',
	flash: 'http://player.hunantv.com/mgtv_v5_main/main.swf?js_function_name=vjjFlash&video_id=3624518&statistics_bigdata_bid=1&cpn=1',
	summary: '田亮料理大赛有“妙招”，阿拉蕾变身金句小公举'
},{
	title: '爸爸去哪儿4第二期',
	_id: 2,
	director: '芒果台',
	country: '中国',
	year: 2016,
	poster: '/img/poster2.jpg',
	language: '中文',
	flash: 'http://player.hunantv.com/mgtv_v5_main/main.swf?js_function_name=vjjFlash&video_id=3640929&statistics_bigdata_bid=1&cpn=1',
	summary: '阿拉蕾董力呆萌互动坑一脸，安吉变身军营男子汉'
},{
	title: '爸爸去哪儿4第三期',
	_id: 3,
	director: '芒果台',
	country: '中国',
	year: 2016,
	poster: '/img/poster3.jpg',
	language: '中文',
	flash: 'http://player.hunantv.com/mgtv_v5_main/main.swf?js_function_name=vjjFlash&video_id=3662018&statistics_bigdata_bid=1&cpn=1',
	summary: '安吉晋升小爸爸替父带娃，阿拉蕾小亮仔玩转民族风'
},{
	title: '爸爸去哪儿4第四期',
	_id: 4,
	director: '芒果台',
	country: '中国',
	year: 2016,
	poster: '/img/poster4.jpg',
	language: '中文',
	flash: 'http://player.hunantv.com/mgtv_v5_main/main.swf?js_function_name=vjjFlash&video_id=3676255&statistics_bigdata_bid=1&cpn=1',
	summary: '小鱼儿集市走丢安吉暴走，阿拉蕾救父记暖cry董力'
},{
	title: '爸爸去哪儿4第五期',
	_id: 5,
	director: '芒果台',
	country: '中国',
	year: 2016,
	poster: '/img/poster5.jpg',
	language: '中文',
	flash: 'http://player.hunantv.com/mgtv_v5_main/main.swf?js_function_name=vjjFlash&video_id=3689404&statistics_bigdata_bid=1&cpn=1',
	summary: '安吉贡献荧屏首次泪崩，张伦硕口水枣泥整懵田亮父子'
},{
	title: '爸爸去哪儿4第六期',
	_id: 6,
	director: '芒果台',
	country: '中国',
	year: 2016,
	poster: '/img/poster6.jpg',
	language: '中文',
	flash: 'http://player.hunantv.com/mgtv_v5_main/main.swf?js_function_name=vjjFlash&video_id=3704148&statistics_bigdata_bid=1&cpn=1',
	summary: '庆庆化身暖心小勇士！沙漠护爸感动蔡国庆'
}];*/