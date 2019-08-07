import * as Koa from 'koa';
import * as koaBody from 'koa-body';
import * as koaSession from 'koa-session';
import * as koaLogger from 'koa-logger';
import { modelMiddleware } from './src/middleware/koa-model';
import { loginMiddleware } from './src/middleware/koa-login';
import { router } from './src/route/index';


const app = new Koa();

app.keys = [ 'sinight' ];

const SESSION_CONFIG = {
	key: 'rss-sinight', /** (string) cookie key (default is koa:sess) */
	/** (number || 'session') maxAge in ms (default is 1 days) */
	/** 'session' will result in a cookie that expires when session/browser is closed */
	/** Warning: If a session cookie is stolen, this cookie will never expire */
	maxAge: 86400000,
	autoCommit: true, /** (boolean) automatically commit headers (default true) */
	overwrite: true, /** (boolean) can overwrite or not (default true) */
	httpOnly: true, /** (boolean) httpOnly or not (default true) */
	signed: true, /** (boolean) signed or not (default true) */
	rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
	renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};


//跨域                                                                  
app.use(async (ctx, next) => {
	ctx.response.set('Access-Control-Allow-Origin', 'http://localhost:3000');
	ctx.response.set('Access-Control-Allow-Headers', 'Content-Type');
	ctx.response.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
	ctx.response.set("Access-Control-Allow-Credentials", 'true');
	await next();
});

app.use(koaLogger());
app.use(koaSession(SESSION_CONFIG, app));
app.use(koaBody());

//加载model
app.use(modelMiddleware);

//是否登录
app.use(loginMiddleware);

//加载路由
app.use(router.routes());

//404
app.use(async (ctx, next) => {
	ctx.body = '页面飞了~';
});



app.listen(5000, () => {
	console.log('http://localhost:5000');
});

