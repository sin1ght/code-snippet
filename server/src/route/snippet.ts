import Router = require('koa-router');
import {success, error, md5} from '../utils';

const router = new Router({
	prefix:'/snippet'
});


/**
 * 查询片段
 */
router.get('/', async (ctx, next) => {
	const snippets = await ctx.model.snippet.findAll({
		where:{
			userId:ctx.session.user.id
		}
	});
	ctx.body = success(snippets);
});

/**
 * 添加片段
 */
router.post('/add', async (ctx, next) => {
	const { title, tags, content, cid } = ctx.request.body;
	const link = md5(Date.now().toString() + Date.now().toString().slice(3));
	const category = await ctx.model.category.findOne({
		where:{
			id:cid
		}
	});
	if (category){
		const snippet = await ctx.model.snippet.create({
			title, 
			tags, 
			content,
			link, 
			categoryId:cid,
			userId:ctx.session.user.id
		});
		ctx.body = success(snippet);
	} else {
		ctx.body = error('未知分类');
	}
});


/**
 * 更新片段
 */
router.post('/update', async (ctx, next) => {
	const { id, title, tags, content, cid } = ctx.request.body;
	let snippet = await ctx.model.snippet.findOne({
		where:{
			id
		}
	});
	if (snippet){
		snippet.title = title;
		snippet.tags = tags;
		snippet.content = content;
		snippet.cid = cid;
		await snippet.save();
		ctx.body = success(snippet);
	} else {
		ctx.body = error('未知代码片段');
	}
});

/**
 * 验证link（md5）是否合法
 */
router.post('/valid', async (ctx, next) => {
	const { id } = ctx.request.body;
	const snippet = await ctx.model.snippet.findOne({
		where:{
			link:id
		}
	});
	if (snippet){
		ctx.body = success(snippet);
	} else {
		ctx.body = error('未知代码片段');
	}
});

module.exports = router;