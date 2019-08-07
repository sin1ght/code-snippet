import _ = require('lodash');
import {success, error} from '../utils';
import Koa = require('koa');

const loginWhiteList = [ '/api/v1/user/login', '/api/v1/user/register', '/api/v1/auth' ];

export const loginMiddleware =  async (ctx:Koa.Context, next:any) => {
	const path = ctx.path;
	if (loginWhiteList.includes(path)){
		await next();
	} else {
		if (_.isNil(ctx.session.user)){
			ctx.body = error('请先登录');
		} else {
			await next();
		}
	}
};