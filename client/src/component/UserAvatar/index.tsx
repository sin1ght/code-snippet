import React from 'react';
import './index.scss';
import { MenuType } from '../../const';

interface IProps {
    onClick(type:number):void
}

interface IMenu {
    type:number
    name:string
    left:number
    top:number
}

interface IState {
    menus:IMenu[],
    isShowMenus:boolean, //是否展示菜单
}

const menusDefines = [
	{
		type:MenuType.SHOW_CATEGORY,
		name:'查看分类'
	},
	{
		type:MenuType.CREATE_CATEGORY,
		name:'创建分类'
	},
	{
		type:MenuType.CREATE_SNIPPET,
		name:'创建片段'
	},
	{
		type:MenuType.CHANGE_AVATAR,
		name:'更换头像'
	},
	{
		type:MenuType.SHOW_HOME,
		name:'主页'
	},
];

export default class extends React.Component<IProps, IState> {
	constructor(props:IProps){
    	super(props);
    	this.state = {
			menus:this.createMenus(),
			isShowMenus:false,
    	};
	}

	render(){
		let menusRender = null;
    	if (this.state.isShowMenus){
			menusRender = this.state.menus.map((item, index) => {
				const style = {
					left:item.left,
					top:item.top,
					animationDelay:`${0.05 * index}s`
				};
    
				return (
					<div 
						className="menu-item animated fadeIn" 
						style={style} 
						key={index} 
						onClick={this.props.onClick.bind(null, item.type)}
					>
						<div className="bg"></div>
						<p>{item.name}</p>
					</div>
				);
			});
		}

    	return (
    		<div className="user-avatar">
    			<div className="circle circle-delay-1"></div>
    			<div className="circle circle-delay-2"></div>
    			<div className="circle circle-delay-3"></div>
    			<img src="/img/avatar.jpg" alt="" onClick={this.handleOpenMenu.bind(this)}/>
    			<div className="menus-view">
    				{menusRender}
    			</div>
    		</div>
    	);
	}


	//分类生成位置
	createMenus(){
    	const menus:IMenu[] = [];
    	const r = 100;//半径
    	const cLeft = 50; //圆心
    	const cTop = 50; //圆心
    	const aAngle = 360 / menusDefines.length; //平均角度
    	menusDefines.forEach((item, index) => {
    		const angle = index * aAngle * (Math.PI / 180);
    		const left = cLeft + r * Math.cos(angle);
    		const top = cTop - r * Math.sin(angle);
    		menus.push({
    			type:item.type,
    			name:item.name,
    			left,
    			top
    		});
    	});
        
    	return menus;
	}
    
	//打开或者关闭菜单
	handleOpenMenu(){
		this.setState({
			isShowMenus:!this.state.isShowMenus
		});
	}
}