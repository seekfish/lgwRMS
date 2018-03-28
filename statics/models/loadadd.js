var mongoose=require('mongoose');
//导入骨架
var UserSchemas=require('../schemas/loadadd');
var User=mongoose.model('works',UserSchemas);//第一个参数是数据库名称,第二个就是骨架

module.exports=User;