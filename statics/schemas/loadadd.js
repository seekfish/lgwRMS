var mongoose=require('mongoose');
//创造骨架
var lad=mongoose.Schema({
	company_name:String,
	work:String,
	mold:String,
	address:String,
	pay:String,
	img:String,
	name:String
})
module.exports=lad;