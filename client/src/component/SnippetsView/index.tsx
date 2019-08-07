import React from 'react';
import './index.scss';

interface IProps {
    snippets:{id:number, title:string, tags:string[], content:string, link:string, cid:number}[]
    onSnippetClick(sid:number):void
}

interface IState {
    snippetCards:ISnippetCard[]
}

interface ISnippetCard {
    id:number
    title:string
    img:string
}

export default class extends React.Component<IProps, IState> {
	constructor(props:IProps){
		super(props);
		this.state = {
			snippetCards:this.createCards(props.snippets)
		};
	}

	render(){
		const cradsRender = this.state.snippetCards.map((item, index) => {
			const cardBgStyle = {
				backgroundImage:`url(${item.img})`,
			};
			const cardStyle = {
				animationDelay:`${0.1 * index}s`, 
			};
			return (
				<div 
					className="snippet-card animated fadeIn" 
					key={item.id} 
					style={cardStyle}
					onClick={(e) => { this.props.onSnippetClick(item.id) ; }}>
					<div className="snippet-card-bg" style={cardBgStyle}></div>
					<div className="info">
						{item.title}
					</div>
				</div>
			);
		});

		return (
			<div className="snippets-view">
				{cradsRender}
			</div>
		);
	}
    

	//生成一些card数据
	createCards(snippets:IProps['snippets']):ISnippetCard[]{
		const cards : ISnippetCard[] =  [] ;
		const baseImgUrl = 'img/actor/';

		snippets.forEach(s => {
			cards.push({
				id:s.id,
				title:s.title,
				img:baseImgUrl + (Math.round(Math.random() * 11 + 1)) + '.jpg',
			});
		});
		return cards;
	}
}