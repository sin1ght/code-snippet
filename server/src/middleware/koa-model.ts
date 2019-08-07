import * as path from 'path';
import * as fs from 'fs';
import * as Koa from 'koa';



/**
 * 将model注入到ctx.model上
 */
export const modelMiddleware:Koa.Middleware = async (ctx, next) => {
	const dir = path.resolve(__dirname, '../', 'model');
	ctx.model = {};
	for (let filename of fs.readdirSync(dir)){
		const modelModule = require(path.resolve(dir, filename));
		const modelName = path.basename(filename, path.extname(filename));
		ctx.model[modelName] = modelModule;
	}
	await next();
};