//同名对应映射
var mongoose=require('mongoose');//加载构造函数
//导入骨架
var UserSchemas=require('../schemas/user');
var User=mongoose.model('users',UserSchemas);//第一个参数是数据库名称,第二个就是骨架

module.exports=User;