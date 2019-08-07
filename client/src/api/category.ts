import { BaseAPI } from './base';

export const CategoryAPI = new (class extends BaseAPI {
	/**
     * 获取分类列表
     */
	async getList(){
		return await this.get('/');
	}
    
	/**
     * 添加分类
     */
	async add(data:{name:string}){
		return await this.post('/add', data);
	}
})('/category');