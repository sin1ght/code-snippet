import { BaseAPI } from './base';

export const SnippetAPI = new (class extends BaseAPI {
	/**
     * 查询列表
     */
	async getList(){
		return await this.get('/');
	}
    
	/**
     * 添加
     */
	async add(data:{title:string, tags:string, content:string, cid:number}){
		return await this.post('/add', data);
	}
    
	/**
     * 更新
     */
	async update(data:{id:number, title:string, tags:string, content:string, cid:number}){
		return await this.post('/update', data);
	}
    
	/**
     * 验证md5 是否合法
     */
	async valid(data:{id:string}){
		return await this.post('/valid', data);
	}
})('/snippet');