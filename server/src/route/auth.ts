import Router = require('koa-router');
import {success, error} from '../utils';
import _   = require('lodash');

const router = new Router({
	prefix:'/auth'
});


/**
 * 判断用户是否登录
 */
router.get('/', async (ctx, next) => {
	if (_.isNil(ctx.session.user)){
		ctx.body = error('未登录');
	} else {
		ctx.body = success(_.pick(ctx.session.user, [ 'avatar', 'id', 'email' ]));
	}
});


module.exports = router;