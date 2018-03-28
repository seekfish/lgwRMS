var express=require('express')//导入函数创建实例
var bodyParser =require('body-parser')//导入post处理
var formidable=require('formidable')//导入表单处理
var mongoose=require('mongoose');//导入连接数据库插件
var fs=require("fs");
//创建服务实例
var app=express();
//设置静态访问路径
app.use(express.static("statics"))//指定静态访问地址
app.use(express.static("uploadcache"))//指定图片访问静态路径
//导入模型
var User=require("./statics/models/user");
var Add=require("./statics/models/loadadd");
//使用插件
app.use(bodyParser.json());//处理提交的json数据
app.use(bodyParser.urlencoded({
	extended:true
}))//form表单提交
//把全局promise方法给mongoose
mongoose.Promise=global.Promise;
//导入upload插件
var upload=require("./statics/js/upload");
//连接数据库
mongoose.connect('mongodb://localhost:27017/laogou',{useMongoClient:true},function(err){
	if(err){
		return;
	}
	console.log("连接数据库成功")
})
//登录
app.post('/ss/login',function(req,res){
	let {username,pwd}=req.body;
	User.find({username},function(err,doc){
		if(err){
			return;
		}
		//console.log(doc)
		if(!doc.length){
			res.json({
				code:1,
				msg:"用户名不存在"
			})
		}
		else{
			if(pwd==doc[0].pwd){
				res.json({
				code:0,
				msg:"登录成功"//返回一个json对象
				})
			}else{
				res.json({
				code:1,
				msg:"密码错误"//返回一个json对象
				})
			}
		}
	})
})
//注册
app.post('/ss/regist',function(req,res){
	//console.log(req.body);
	let {username,pwd,message}=req.body;
	User.find({username},function(err,doc){//判断用户名是否存在
		if(err){return;}
		if(!doc.length){
			//操作数据库
			var user=new User({//创建模型User实例
				username,//es6中键值对相同时，可以简写
				pwd,
				message
			});
			user.save(function(err,doc){
				if(err){return;}
				res.json({
					code:0,
					msg:"注册成功"
				})
			})
		}else{
			res.json({
				code:1,
				msg:"用户名已存在"
			})
		}
	})
})
//上传图片
app.post('/upload',function(req,res){
	//借用插件去完成 formidable
	upload.upload(req,res);
})
//添加工作
app.post('/ss/tj',function(req,res){
	let {company_name,work,mold,address,pay,img,name}=req.body;
	Add.find({company_name,name},function(err,doc){//把工作传进去
		if(err){return}
			if(!doc.length){
				var add=new Add({
					company_name,
					work,
					mold,
					address,
					pay,
					img,
					name
				})
			add.save(function(err,doc){
				res.json({
					code:0,
					msg:"添加成功",
					list:[doc]
				})
			})
		}else{
			res.json({
				code:1,
				msg:"该职位已经存在，请修改"
			})
		}
	})
})
//查询工作显示5条
app.post('/ss/old',function(req,res){
	Add.find({}).sort({"_id":-1}).limit(5).exec(function(err,doc){
		res.json({
			code:0,
			list:doc,
			index:1
		})
	})
	
})
//查询所有项目
app.post('/ss/all',function(req,res){
	Add.find({},function(err,doc){
		res.json({
		code:0,
		list:doc
		})
	});
	
})
//删除
app.post('/ss/delete',function(req,res){
	Add.findOneAndRemove({_id:req.body._id},function(err,doc){
		res.json({
			code:0,
			msg:"删除成功"
		})
	})
})
//删除图片
app.post('/ss/deleteImg',function(req,res){
	let a="./uploadcache"+req.body.img;
	fs.unlink(a, function(err) { 
		 if (err) {
		       return
		   }
	   console.log("文件删除成功！");
	});
})
//修改
app.post('/ss/amend',function(req,res){
	Add.findOneAndUpdate({_id:req.body._id},req.body,{new:true},function(err,doc){
		if(err){return}
		res.json({
			code:0,
			msg:"修改成功",
			list:[doc]
		})
	})
})
//分页
app.post('/ss/fanye',function(req,res){
	let b=req.body.index;
	// Add.find({
	// 	skip:(req.body.index-1)*5,
	// 	limit:5
	// },function(err,doc){
	// 	console.log(doc)
	// })
	// Add.find({},function(err,doc){
	// 		let a=doc.slice(5*(b-1),b*5)
	// 		res.json({
	// 			code:0,
	// 			list:a
	// 		})
	// })
	Add.find({}).sort({"_id":-1}).skip((b-1)*5).limit(5).exec(function(err,doc){
		//console.log(b)
		b=Number(b);
		res.json({
				code:0,
				list:doc,
				index:b
		})
	})
		
})
//启动端口
app.listen(8848,function(){
	console.log("连接服务成功")
})