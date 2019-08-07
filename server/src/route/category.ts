import Router = require('koa-router');
import {success, error} from '../utils';
import * as Koa from 'koa';


const router = new Router({
	prefix:'/category'
});

/**
 * 添加分类
 */
router.post('/add', async (ctx:Koa.BaseContext, next) => {
	const { name } = ctx.request.body;
    
	let category = await ctx.model.category.findOne({
		where:{
			name
		}
	});
    
	if (category){
		ctx.body = error('此分类已经添加过');
	} else {
		category = await ctx.model.category.create({
			name,
			userId:ctx.session.user.id
		});

		ctx.body = success(category);
	}
});

/**
 * 查询分类
 */
router.get('/', async (ctx:Koa.BaseContext, next) => {
	const categorys = await ctx.model.category.findAll({
		where:{
			userId:ctx.session.user.id
		}
	});
    
	ctx.body = success(categorys);
});


module.exports = router;