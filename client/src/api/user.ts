import { BaseAPI } from './base';

export const UserAPI = new (class extends BaseAPI {
	/**
     * 登录
     */
	async login(data:{email:string, passwd:string}){
		return await this.post('/login', data);
	}
    
	/**
     * 注册
     */
	async register(data:{email:string, passwd:string}){
		return await this.post('/register', data);
	}
})('/user');