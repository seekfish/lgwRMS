//创建映射
var mongoose=require('mongoose');
//.Schema不具有数据库操作能力
var UserSchemas=mongoose.Schema({ //说明user这个集合里面只有2个字段
	username:String,
	pwd:String,
	message:String
});
module.exports=UserSchemas;//改变module.exprots指向，并暴露出去