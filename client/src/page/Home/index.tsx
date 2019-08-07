import React from 'react';
import './index.scss';
import { MenuType } from '../../const';
import Editor from '../../component/Editor';
import UserAvatar from '../../component/UserAvatar';
import CategoryView from '../../component/CategoryView';
import SnippetsView from '../../component/SnippetsView';
import LightsView from '../../component/LightsView';
import { Modal, Input, message } from 'antd';
import { CategoryAPI } from '../../api/category';
import { SnippetAPI } from '../../api/snippet';
import { pick } from 'lodash';

//当前主页展示的内容
enum CurrentContentType {
    Nothing,
    CategorysView,
    SnippetsView,
    CreateSnippetView,
    SnippetDetailView,
}   

interface IStore{
    categorys:{id:number, name:string}[]
    snippets:{id:number, title:string, tags:string[], content:string, link:string, cid:number}[]
    currentCategoryId:number
    currentSnippetId:number
}

interface IState {
    isCreateCategoryModalShow:boolean,
    createCategoryValue:string,
    currentShowContent:CurrentContentType
    store:IStore
}

interface IProps{

}

export default class extends React.Component<IProps, IState> {
	constructor(props:IProps){
		super(props);
		this.state = {
			isCreateCategoryModalShow:false,
			createCategoryValue:'',
			currentShowContent:CurrentContentType.Nothing,
			store:{
				categorys:[],
				snippets:[],
				currentCategoryId:-1,
				currentSnippetId:-1,
			}
		};
	}

	render(){
		let categorysViewRender = null;
		if (this.state.currentShowContent === CurrentContentType.CategorysView){
			categorysViewRender = ( 
				<CategoryView 
					categorys={this.state.store.categorys} 
					onCategoryClick={this.handleCategoryClick.bind(this)}/>
			);
		}

		let createSnippetViewRender = null;
		if (this.state.currentShowContent === CurrentContentType.CreateSnippetView){
			createSnippetViewRender = (
				<Editor 
					mode={1} 
					snippet={{}}
					categorys={this.state.store.categorys} 
					onSnippetSave={this.handleSnippetSave.bind(this)}
					onSnippetUpdate={this.handleSnippetUpdate.bind(this)}
				/>);
		}
        
		let snippetsViewRender = null;
		if (this.state.currentShowContent === CurrentContentType.SnippetsView){
			const snippets = this.state.store.snippets.filter(s => s.cid === this.state.store.currentCategoryId);
			snippetsViewRender = (<SnippetsView snippets={snippets} onSnippetClick={this.handleSnippetClick.bind(this)}/> );
		}
        
		let snippetDetailView = null ;
		if (this.state.currentShowContent === CurrentContentType.SnippetDetailView){
			const snippet = this.state.store.snippets.find(s => s.id === this.state.store.currentSnippetId);
			if (snippet){
				snippetDetailView = (
					<Editor 
						mode={0} 
						snippet={snippet}
						categorys={this.state.store.categorys} 
						onSnippetUpdate={this.handleSnippetUpdate.bind(this)}
					/>
				);
			}
		}
        

		return (
			<div className="home-page">
				<img src="/img/bg.jpg" alt="" className="home-bg"/>
				<LightsView/>
				<UserAvatar onClick={this.handleMenuItemClick.bind(this)}/>
				{ categorysViewRender }
				{ createSnippetViewRender }
				{ snippetsViewRender }
				{ snippetDetailView }
                
				{/*创建分类modal */}
				<Modal
					title="创建分类"
					okText="确认"
					cancelText="取消"
					maskClosable={false}
					closable={false}
					destroyOnClose={true}
					visible={this.state.isCreateCategoryModalShow}
					onOk={this.handleCreateCategoryOk.bind(this)}
					onCancel={(e) => { this.setState({isCreateCategoryModalShow:false}); }}
				>
					<Input 
						placeholder="请输入分类名称" 
						value={this.state.createCategoryValue}
						onChange={(e) => { this.setState({createCategoryValue:e.target.value}) ; }}/>
				</Modal>
			</div>
		);
	}
    
	async componentDidMount(){
		const ress = await Promise.all([ CategoryAPI.getList(), SnippetAPI.getList() ]);
		if (ress[0].data.status){
			this.setState({
				store:{
					...this.state.store,
					categorys:ress[0].data.data.map((item:any) => ({id:item.id, name:item.name})) 
				}
			});
			console.log(ress[0].data.data);
		} else {
			message.error(ress[0].data.data, 1);
		}
        
		if (ress[1].data.status){
			this.setState({
				store:{
					...this.state.store,
					snippets:ress[1].data.data.map((item:any) => {
						return {
							id:item.id,
							title:item.title,
							content:item.content,
							tags:item.tags.split(','),
							cid:item.categoryId,
							link:item.link
						};
					})
				}
			});
			console.log(ress[1].data.data);
		} else {
			message.error(ress[1].data.data, 1);
		}
	}
    

	//处理菜单功能
	handleMenuItemClick(type:MenuType){
		if (type === MenuType.CREATE_CATEGORY){
			this.setState({
				isCreateCategoryModalShow:true,
			});
		} else if (type === MenuType.SHOW_CATEGORY){
			this.setState({
				currentShowContent:CurrentContentType.CategorysView
			});
		} else if (type === MenuType.CREATE_SNIPPET){
			this.setState({
				currentShowContent:CurrentContentType.CreateSnippetView
			});
		} else if (type === MenuType.SHOW_HOME){
			this.setState({
				currentShowContent:CurrentContentType.Nothing
			});
		}
	}
    
	//处理创建分类Ok
	async handleCreateCategoryOk(e:any){
		this.setState({
			isCreateCategoryModalShow:false,
		});
		console.log(this.state.createCategoryValue);
		const res = await CategoryAPI.add({name:this.state.createCategoryValue});
		if (res.data.status){
			this.setState({
				store:{
					...this.state.store,
					categorys:this.state.store.categorys.concat(pick(res.data.data, [ 'id', 'name' ])) 
				}
			});
			console.log(res.data.data);
		} else {
			message.error(res.data.data, 1);
		}
	}
    
	//添加代码片段
	async handleSnippetSave(snippet:any){
		const res = await SnippetAPI.add(snippet);
		if (res.data.status){
			const item = res.data.data;
			this.setState({
				store:{
					...this.state.store,
					snippets:this.state.store.snippets.concat({
						id:item.id,
						title:item.title,
						content:item.content,
						tags:item.tags.split(','),
						cid:item.categoryId,
						link:item.link
					})	
				}
			});
			message.success('添加成功', 1);
			return res.data.data;
		} else {
			message.error(res.data.data);
			return null;
		}
	}
    
	//更新代码片段
	async handleSnippetUpdate(snippet:any){
		const res = await SnippetAPI.update(snippet);
		if (res.data.status){
			console.log(res.data.data);
			const snippet = res.data.data;
			const copy = this.state.store.snippets.concat();
			const index = copy.findIndex(s => s.id === snippet.id);
			if (index !== -1){
				copy[index].title = snippet.title;
				copy[index].tags = snippet.tags.split(',');
				copy[index].content = snippet.content;
				copy[index].cid = snippet.categoryId;
				this.setState({
                	store:{
						...this.state.store,
                		snippets:copy
                	}
				});
			}
			message.success('更新成功', 1);
		} else {
			message.error(res.data.data);
		}
	}
    
	//点击分类 产看片段
	handleCategoryClick(cid:number){
		this.setState({
			currentShowContent:CurrentContentType.SnippetsView,
			store:{
				...this.state.store,
				currentCategoryId:cid
			}
		});
	}
    
	//点击片段查看详情
	handleSnippetClick(sid:number){
		this.setState({
			currentShowContent:CurrentContentType.SnippetDetailView,
			store:{
				...this.state.store,
				currentSnippetId:sid
			}
		});
	}
}