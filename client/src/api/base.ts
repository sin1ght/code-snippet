import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:5000/api/v1',
	withCredentials: true
});

export const BaseAPI = class {
    private axios:AxiosInstance
    private prefix:string  //请求的前缀

    constructor(prefix:string){
    	this.axios = axiosInstance;
    	this.prefix = prefix;
    }

    /**
     * get请求
     * @param url 请求的url /login
     * @param config 
     */
    protected async get(url:string, config?:AxiosRequestConfig){
    	return this.axios.get(this.prefix + url, config);
    }

    /**
     * psot 请求
     * @param url 
     * @param data post参数
     * @param config 
     */
    protected async post(url:string, data?:any, config?:AxiosRequestConfig){
    	return this.axios.post(this.prefix + url, data, config);
    }

}; 