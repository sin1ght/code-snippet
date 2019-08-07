import React from 'react';
import './taginput.scss';


interface IProps {
    tagList:string[],
    onTagsChange(tags:string[]):void
}

interface IState {
    innerTagList:string [],
}

export default class extends React.Component<IProps, IState> {
	constructor(props:IProps){
		super(props);
		this.state = {
			innerTagList:props.tagList.concat(),
		};
	}

	render(){
		const tagsRender = this.state.innerTagList.map((item, index) => {
			return (
				<div className="tag-item" key={index}>
					<p>{ item }</p>
					<i className="fa fa-close" onClick={this.handleDeleteTag.bind(this, index)}></i>
				</div>
			);
		});

		return (
			<div className="tag-input">
				<div className="tags">
					{ tagsRender }
                    
					<input 
						type="text"
						placeholder="空格添加标签" 
						onKeyDown={this.handleInputKeyDown.bind(this)}/>
				</div>
			</div>
		);
	}
    
	//空格的时候 添加新的标签
	handleInputKeyDown(e:any){
		if (e.keyCode === 32){
			if (e.target.value.trim()){
				//输入值不为空
				this.setState({
					innerTagList:new Array<string>().concat(this.state.innerTagList, e.target.value.trim())
				}, () => {
					this.props.onTagsChange(this.state.innerTagList.concat());
				});
				e.target.value = '';
			}
		}
	}
    
	//点击删除图标时删除标签
	handleDeleteTag(index:number, e:any){
		console.log(index, this.state.innerTagList);
		const tagListCopy = this.state.innerTagList.concat();
		tagListCopy.splice(index, 1);
		this.setState({
			innerTagList:tagListCopy
		}, () => {
			this.props.onTagsChange(this.state.innerTagList.concat());
		});
	}
}