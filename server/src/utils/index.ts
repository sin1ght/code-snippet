import crypto = require('crypto'); 


/**
 * md5加密
 */
export function md5(str:string){
	let hash = crypto.createHash('md5');
	return hash.update(str).digest('hex');
}


/**
 * 请求成功返回体
 */
export function success(data:object|string){
	return {
		status:true,
		data:data
	};
}

/**
 * 请求失败返回体
 */
export function error(data:object|string){
	return {
		status:false,
		data:data
	};
}