import React from 'react';
import './index.scss';
import marked from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import TagInput from './TagInput';
import moment from 'moment';
import { Select, message } from 'antd';
const { Option } = Select;

//markdown parser
marked.setOptions({
	highlight: function (code, lang) {
		return hljs.highlightAuto(code).value;
	},
	breaks:true,
	silent:true,
	smartLists:true,
	smartypants:true,
});

interface IState {
    id:number,
    title:string
    tags:string[]
    content:string //原始编辑文本
    cid:number //分类id
    link:string //分享链接
    mode:0|1|2 //0 本人查看 1 本人编辑/新建 2 他人查看
}

//代码片段
interface ISnippet {
    id?:number
    title?:string
    tags?:string[]
    content?:string
    cid?:number
    link?:string
    createdAt?:string
}

//添加代码片段
interface ISnippetInput {
    title:string
    tags:string
    content:string
    cid:number
}

interface IProps {
    mode:0|1|2, //0 本人查看 1 本人编辑/新建 2 他人查看
    snippet:ISnippet,
    categorys?:{id:number, name:string}[]
    onSnippetSave?(snippet:ISnippetInput):Promise<{id:number, link:string}>
    onSnippetUpdate?(snippet:ISnippetInput&{id:number}):void
}

export default class Editor extends React.Component<IProps, IState> {
    private refTextArea: React.RefObject<HTMLTextAreaElement>;

    constructor(props:IProps){
    	super(props);
    	this.state = {
    		id:props.snippet.id || -1,
    		title:props.snippet.title || '',
    		tags:props.snippet.tags || [],
    		content:props.snippet.content || '', //原始编辑文本
    		cid:props.snippet.cid || -1,
    		link:props.snippet.link || '',
    		mode:props.mode,
    	};
    	this.refTextArea = React.createRef();
    }
    
    handleContentChange(event:any){
    	this.setState({
    		content:event.target.value
    	});
    }

    handleTitleChange(event:any){
    	this.setState({
    		title:event.target.value
    	});
    }

    handleTagsChange(tags:string[]){
    	this.setState({
    		tags:tags
    	}); 
    }

    handleCategoryChange(value:any, option:any){
    	this.setState({
    		cid:value
    	});
    }

    //新建片段 / 更新片段
    async handleSnippetSave(e:any){
    	if (this.state.cid === -1){
    		message.error('请选择分类', 1);
    		return;
    	}
        
    	if (this.state.id !== -1){
    		if (this.props.onSnippetUpdate){
    			await this.props.onSnippetUpdate({
    				id:this.state.id,
    				title:this.state.title,
    				tags:this.state.tags.concat().join(','),
    				content:this.state.content,
    				cid:this.state.cid,
    			});
    		}
    	} else if (this.props.onSnippetSave){
    		const snippet = await this.props.onSnippetSave({
    			title:this.state.title,
    			tags:this.state.tags.concat().join(','),
    			content:this.state.content,
    			cid:this.state.cid,
    		});
    		if (snippet){
    			this.setState({
    				link:snippet.link,
    				id:snippet.id,
    			});
    		}
    	}
    }

    //改变模式 
    handleChangeMode(mode:any){
    	this.setState({
    		mode,
    	});
    }

    //打开 分享链接
    handleOpenShareLink(){
    	window.open('/share/' + this.state.link);
    }
    
    //处理textarea内tab和shift tab的情况
    handleKeyDown(e:any){
    	if (e.keyCode === 9){
    		const tab = '    ';
    		e.preventDefault();
    		const text:string = e.target.value;
    		const originStart:number = e.target.selectionStart;
    		let start:number = e.target.selectionStart;
    		let end:number = e.target.selectionEnd;
    		const selectText:string = text.slice(start, end);
    		let resultText:string;
    		let replaceText:string;
    		const isShiftKey = e.shiftKey; //是否按了shift
    		let isHeadOfLine = false ; //shift的时候 是否一行到头了
    		if (!e.shiftKey){
    			//只有tab
    			replaceText = tab + selectText.replace(/\n/g, '\n' + tab);
    			resultText = text.slice(0, start) + replaceText + text.slice(end);
    		} else {
    			//shift tab
    			const lastTab = text.slice(0, start).lastIndexOf('\n');
    			if (lastTab !== -1){
    				//没有选中第一行
    				replaceText = text.slice(lastTab, end).replace(/\n\s{4}/g, '\n');
    			    resultText = text.slice(0, lastTab) + replaceText + text.slice(end);
    			} else {
    				replaceText = text.slice(0, end).replace(/\n\s{4}/g, '\n');
    				replaceText = replaceText.replace(/\s{4}/, '');
    				resultText = replaceText + text.slice(end);
    			}
    			start = lastTab + 1 ;
    			if (start === originStart){
    				//一行到头了
    				isHeadOfLine = true;
    			}
    		}
    		end = start + replaceText.length ;
    		this.setState({
    			content:resultText
    		}, () => {
    			if (this.refTextArea.current ){
    				if (selectText.length){
    					//选中时保留选中状态
    					this.refTextArea.current.selectionStart = start;
    					this.refTextArea.current.selectionEnd = end;
    				} else {
    					if (!isShiftKey){
    						//tab
    						this.refTextArea.current.selectionStart = start + 4;
    					    this.refTextArea.current.selectionEnd = start + 4;
    					} else {
    						//shift tab
    						if (!isHeadOfLine){
    							this.refTextArea.current.selectionStart = originStart - 4;
    					        this.refTextArea.current.selectionEnd = originStart - 4;
    						}
    					}
    				}
    				
    			}
    		});
    	}
    }

    render(){
    	let titleRender = null;
    	let tagsRender = null;
    	let writeArea = null;
    	let readArea = null;
    	let categorySelectRender = null;

    	if (this.state.mode === 0){
    		//本人查看
    		titleRender = (<p className="title-view">{this.props.snippet.title}</p>);
    		tagsRender = (
    			<div className="tags-view">
    				{this.state.tags.map((tag, index) => {
    					return (
    						<p className="tag-item" key={index}>
    							<i className="fa fa-tag"></i>
    							{tag}
    						</p>
    					);
    				})}
    			</div>
    		);
    		readArea = (
    			<div className="read-area" style={{width:'100%'}}>
    				<div className="head">
    					<p className="label">
    						{moment(this.props.snippet.createdAt).format('YYYY年MM月DD')}
    					</p>
    					<p className="action">
    						<i className="fa fa-link" title={this.state.link} onClick={this.handleOpenShareLink.bind(this)}></i>
    						<i className="fa fa-pencil" onClick={(e) => { this.handleChangeMode(1) ; }}></i>
    					</p>
    				</div>
    				<div className="content" dangerouslySetInnerHTML={{__html: marked(this.state.content)}}>
    				</div>
    			</div>
    		);
            
    	} else if (this.state.mode === 1){
    		//本人编辑
    		titleRender = (
    			<input 
    				type="text" 
    				className="title-input" 
    				placeholder="请输入标题" 
    				value={this.state.title}
    				onChange={this.handleTitleChange.bind(this)}
    			/>);
    		tagsRender = (<TagInput tagList={this.state.tags} onTagsChange={this.handleTagsChange.bind(this)}/>);
            
    		categorySelectRender = (
    			<Select
    				notFoundContent="没有分类"
    				placeholder="选择分类"
    				defaultValue={this.state.cid === -1 ? '无' : this.state.cid}
    				onChange={this.handleCategoryChange.bind(this)}>
    				{this.props.categorys && this.props.categorys.map(c => {
    					return (<Option value={c.id} key={c.id}>{c.name}</Option>);
    				})}
    			</Select>
    		);
            
    		writeArea = (
    			<div className="write-area">
    				<div className="head">
    					<p className="label">
    						<i className="fa fa-code"></i>
                            编辑区
    					</p>
    					<p className="action">
    						<i className="fa fa-floppy-o" onClick={this.handleSnippetSave.bind(this)}></i>
    						{this.state.link && <i className="fa fa-link" title={this.state.link} onClick={this.handleOpenShareLink.bind(this)}></i>}
    					</p>
    				</div>
    				<textarea
    					placeholder="愉快的开始记录吧~"
    					className="content"
    					ref={this.refTextArea}
    					value={this.state.content} 
    					onChange={this.handleContentChange.bind(this)}
    					onKeyDown={this.handleKeyDown.bind(this)}>
    				</textarea>
    			</div>
    		);
            
    		readArea = (
    			<div className="read-area">
    				<div className="head">
    					<p className="label">
    						<i className="fa fa-code"></i>
                            预览区
    					</p>
    					<p className="action">
    						
    					</p>
    				</div>
    				<div className="content" dangerouslySetInnerHTML={{__html: marked(this.state.content)}}>

    				</div>
    			</div>
    		);
            
            
    	} else if (this.state.mode  === 2){
    		//他人查看
    		titleRender = (<p className="title-view">{this.props.snippet.title}</p>);
    		tagsRender = (
    			<div className="tags-view">
    				{this.state.tags.map((tag, index) => {
    					return (
    						<p className="tag-item" key={index}>
    							<i className="fa fa-tag"></i>
    							{tag}
    						</p>
    					);
    				})}
    			</div>
    		);
    		readArea = (
    			<div className="read-area" style={{width:'100%'}}>
    				<div className="head">
    					<p className="label">
    						{moment(this.props.snippet.createdAt).format('YYYY年MM月DD')}
    					</p>
    					<p className="action">
    						<i className="fa fa-link" title={this.state.link} onClick={this.handleOpenShareLink.bind(this)}></i>
    					</p>
    				</div>
    				<div className="content" dangerouslySetInnerHTML={{__html: marked(this.state.content)}}>
    				</div>
    			</div>
    		);
    	}


    	return (
    		<div className="custom-editor">
    			{titleRender}
    			{tagsRender}
    			{categorySelectRender}
    			<div className="write-read-area">
    				{writeArea}
    				{readArea}
    			</div>
    		</div>
    	);
    }
}