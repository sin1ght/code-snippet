import React from 'react';
import './index.scss';
import { isEqual } from 'lodash';



//分类
interface ICategory {
    left:number
    top:number
    id:number
    name:string
}

interface IState {
   
}

interface IProps {
    categorys:{id:number, name:string} [] //要展示的分类
    onCategoryClick(cid:number):void
}

export default class extends React.Component<IProps, IState> {
	constructor(props:IProps){
    	super(props);
    	this.state = {
    		
    	};
	}

	shouldComponentUpdate(nextProps:any, nextState:any){
		if (isEqual(this.props.categorys, nextProps.categorys)){
			return false;
		}

		return true;
	}

	render(){
		const categorys = this.createCategorys(this.props.categorys);
    	const categorysRender = categorys.map((item) => {
    		return (
				<div 
					className="category-item animated fadeIn" 
					style={{ left:item.left + 'px', top:item.top + 'px' }} 
					key={item.id}
					onClick={(e) => { this.props.onCategoryClick(item.id) ; }}>
    				<div className="bg"></div>
    				<div className="circle"></div>
    				<p>{item.name}</p>
    			</div>
    		);
    	});

    	return (
    		<div className="category-view">
    			{categorysRender}
    		</div>
    	);
	}

	//为分类创建随机的坐标
	createCategorys(categorys:any []){
    	const clientWidth = document.documentElement.clientWidth;
    	const clientHeight = document.documentElement.clientHeight;
		//TODO: 避开头像的位置 两个分类不要冲突
		const items:ICategory[] = [];
    	categorys.forEach(item => {
			let left = Math.ceil(Math.random() * (clientWidth - 200));
			let top = Math.ceil(Math.random() * (clientHeight - 200));
            
			let maxRetry = 0;
			while (this.isCategoryPositionConflict(items, left, top)){
				maxRetry++;
				if (maxRetry >= 10){
					break;
				}
				left = Math.ceil(Math.random() * (clientWidth - 200));
			    top = Math.ceil(Math.random() * (clientHeight - 200));
			}

			items.push({
				left,
				top,
				name:item.name,
				id:item.id
			});
		});
        
		return items;
	}
    
	//两个分类是否重叠 分类是否与头像菜单重叠
	isCategoryPositionConflict(items:ICategory[], left:number, top:number){
		const clientHeight = document.documentElement.clientHeight;
		//与菜单冲突
		if (left <= 200 && (top + 200) >= clientHeight ){
			return true;
		}

		const index = items.findIndex(item => {
			return (Math.abs(item.left - left) < 150) && (Math.abs(item.top - top) < 150);
		});
		return index !== -1;
	}
}