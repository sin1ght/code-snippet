import React from 'react';
import './index.scss';
import { RouteComponentProps } from 'react-router-dom';
import LightsView from '../../component/LightsView';
import { SnippetAPI } from '../../api/snippet';
import Editor from '../../component/Editor';
import { message } from 'antd';

interface IProps extends RouteComponentProps {

}

interface IState {
    isValid:boolean
    title:string
    tags:string[]
    content:string
    link:string
    createdAt:string
}

export default class extends React.Component<IProps, IState> {
	constructor(props:IProps){
		super(props);
		this.state = {
			isValid:false, // id是否有效
			title:'',
			tags:[],
			content:'',
			link:'',
			createdAt:'',
		};
	}
    
	async componentWillMount(){
		const params = this.props.match.params as {id:string};
		const id = params.id;
		const res = await SnippetAPI.valid({
			id,
		});
		if (res.data.status){
			const snippet = res.data.data;
			this.setState({
				isValid:true,
				title:snippet.title,
				tags:snippet.tags.split(','),
				content:snippet.content,
				link:snippet.link,
				createdAt:snippet.createdAt,
			});
		} else {
			message.error(res.data.data, 1);
		}
	}   

	render(){
		let snippetRender = null;
		if (this.state.isValid){
			const snippet = {
				title:this.state.title,
				tags:this.state.tags,
				content:this.state.content,
				link:this.state.link,
				createdAt:this.state.createdAt,
			};
			snippetRender = (<Editor mode={2} snippet={snippet}/>);
		}

		return (
			<div className="snippet-share-page">
				<img src="/img/bg.jpg" alt="" className="bg"/>
				<LightsView/>
				{snippetRender}
			</div>
		);
	}
}