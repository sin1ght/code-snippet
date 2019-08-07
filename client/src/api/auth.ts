import { BaseAPI } from './base';

export const AuthAPI = new (class extends BaseAPI {
	/**
     * 登录
     */
	async auth(){
		return await this.get('/');
	}
    
})('/auth');