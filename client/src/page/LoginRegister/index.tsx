import React, { KeyboardEvent } from 'react';
import './index.scss';
import { UserAPI } from '../../api/user';
import { message } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import LightsView from '../../component/LightsView';

interface IProps extends RouteComponentProps{
    
}

interface ILoginData {
    email:string
    passwd:string
}

interface IRegisterData {
    confirmPasswd:string //却密码
}

interface IState {
    isLogin:boolean //此时是登录还是注册
    loginData:ILoginData // 登录数据
    registerData:ILoginData & IRegisterData // 注册数据
}

export default class extends React.Component<IProps, IState>{
	constructor(props:IProps){
		super(props);
		this.state = {
			isLogin : true,
			loginData:{
				email:'',
				passwd:'',
			},
			registerData:{
				email:'',
				passwd:'',
				confirmPasswd:'',
			}
		};
	}


	render(){
		let loginRender = null;
		let registerRender = null ;
		if (this.state.isLogin){
			loginRender = (
				<div className="login animated fadeIn">
					<div className="input-item">
						<label>邮箱</label>
						<input 
							type="text" 
							value={ this.state.loginData.email }
							onChange = {this.handleLoginDataChange.bind(this, 'email')}
						/>
					</div>
					<div className="input-item">
						<label>密码</label>
						<input 
							type="password"
							value={this.state.loginData.passwd}
							onChange = {this.handleLoginDataChange.bind(this, 'passwd')}
						/>
					</div>

					<div className="button" onClick={this.handleLogin.bind(this)}>登录</div>

					<footer>忘记密码</footer>
				</div>
			);
		} else {
			registerRender = (
				<div className="register animated fadeIn">
					<div className="input-item">
						<label>邮箱</label>
						<input 
							type="text"
							value={this.state.registerData.email}
							onChange={this.handleRegisterDataChange.bind(this, 'email')}
						/>
					</div>
					<div className="input-item">
						<label>密码</label>
						<input 
							type="password"
							value={this.state.registerData.passwd}
							onChange={this.handleRegisterDataChange.bind(this, 'passwd')}
						/>
					</div>
					<div className="input-item">
						<label>确认密码</label>
						<input 
							type="password"
							value={this.state.registerData.confirmPasswd}
							onChange={this.handleRegisterDataChange.bind(this, 'confirmPasswd')}
						/>
					</div>

					<div className="button" onClick={this.handleRegister.bind(this)}>注册</div>
				</div>
			);
		}

		return (
			<div className="login-register-page">
				<img src="/img/bg.jpg" alt="" className="bg"/>
				<LightsView/>
				<div className="center-content" onKeyDown={this.handleEnter.bind(this)}>
					<div className="title">
						<p 
							className={this.state.isLogin ? 'active' : ''}
							onClick={(e) => { this.setState({isLogin:true}) ; }}>
                            登录
						</p>
						<p 
							className={this.state.isLogin ? '' : 'active'}
							onClick={(e) => { this.setState({isLogin:false}) ; }}>
                            注册
						</p>
					</div>
					<div className="content">
						{loginRender}
						{registerRender}
					</div>
				</div>
			</div>
		);
	}
    
	/**
     * 登录
     */
	async handleLogin(){
		const res = await UserAPI.login(Object.assign({}, this.state.loginData));
		if (!res.data.status){
			message.error(res.data.data, 1);
			sessionStorage.setItem('isLogin', '0');
		} else {
			sessionStorage.setItem('isLogin', '1');
			this.props.history.push('/home');
		}
		console.log(res.data);
	}
    
	/**
     * 注册
     */
	async handleRegister(){
		if (this.state.registerData.passwd !== this.state.registerData.confirmPasswd){
			message.error('两次密码不一致', 1);
			return false;
		}
		if (!this.state.registerData.email){
			message.error('邮箱不能为空', 1);
			return false;
		}
		if (!this.state.registerData.passwd){
			message.error('密码不能为空', 1);
			return false;
		}
        
		const res = await UserAPI.register({
			email:this.state.registerData.email,
			passwd:this.state.registerData.passwd
		});
		if (!res.data.status){
			message.error(res.data.data, 1);
		} else {
			message.success(res.data.data, 1);
		}
	}
    
	/**
     * 登录data change
     */
	handleLoginDataChange(key:string, e:any){
		this.setState({
			loginData:{
				...this.state.loginData,
				[key]:e.target.value.trim(),
			}
		});
	}
    
	/***
     * 注册data change
     */
	handleRegisterDataChange(key:string, e:any){
		this.setState({
			registerData:{
				...this.state.registerData,
				[key]:e.target.value.trim(),
			}
		}); 
	}
    
	/**
     * 处理回车键
     */
	handleEnter(e:KeyboardEvent){
		if (e.keyCode === 13){
			if (this.state.isLogin){
				this.handleLogin();
			} else {
				this.handleRegister();
			}
		}
	}
}