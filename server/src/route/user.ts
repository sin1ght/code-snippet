import Router = require('koa-router');
import {success, error, md5} from '../utils';
import _ =  require('lodash');

const router = new Router({
	prefix:'/user'
});


/**
 * 注册
 */
router.post('/register', async (ctx, next) => {
	const { email, passwd } = ctx.request.body;
	let user = await ctx.model.user.findOne({
		where:{
			email
		}
	});
    
	if (user){
		ctx.body = error('此邮箱已经注册过了');
	} else {
		user = await ctx.model.user.create({
			email,
			passwd:md5(passwd)
		});
		ctx.body = success('注册成功');
	}
});


/**
 * 登录
 */
router.post('/login', async (ctx, next) => {
	const { email, passwd } = ctx.request.body;
	//查看邮箱是否注册
	let user = await ctx.model.user.findOne({
		where:{
			email
		}
	});
	if (!user){
		ctx.body = error('未知账户');
	} else {
		if (md5(passwd) === user.passwd){
			ctx.session.user = user;
			ctx.body = success(_.pick(user, [ 'avatar', 'id', 'email' ]));
		} else {
			ctx.body = error('密码错误');
		}
	}
});



module.exports = router;