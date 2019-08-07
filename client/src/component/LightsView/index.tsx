import React from 'react';
import './index.scss';


//光源
interface ILight {
    left:number //x 位移
    top:number // y 位移
    xv: number // x方向速度
    yv: number // y方向速度
    radius:number
}


interface IState {
    randomLights:ILight[]  //一些随机光源
}


export default class extends React.Component<{}, IState> {
    private requestAnimationFrameId:number;

    constructor(props:{}){
    	super(props);
    	this.state = {
    		randomLights:this.createRandomLights(),
    	};
        
    	this.requestAnimationFrameId = 0;
    }

    render(){
    	const lightsRender = this.state.randomLights.map((item, index) => {
    		const ligthStyle = {
    			left:item.left + 'px',
    			top:item.top + 'px',
    			height:item.radius * 2,
    			width:item.radius * 2,
    			borderRadius:item.radius,
    		};

    		const bgStyle = {
    			filter: `blur(${item.radius / 2}px)`,
    		};

    		return (
    			<div className="light-item" key={index} style={ligthStyle}>
    				<div className="bg" style={bgStyle}></div>
    				<p></p>
    			</div>
    		);
    	});
    	

    	return (
    		<div className="lights-view">
    			{lightsRender}
    		</div>
    	);
    }
    
    componentDidMount(){
    	this.startLightAnimation();
    }
    
    componentWillUnmount(){
    	cancelAnimationFrame(this.requestAnimationFrameId);
    }

    //生成一些随机光源
    createRandomLights(baseNum:number = 15){
    	const num = baseNum + Math.round(Math.random() * 10);
    	const clientWidth = document.documentElement.clientWidth;
    	const clienHeight = document.documentElement.clientHeight;
    	const lights:ILight [] = [];
    	for (let i = 0;i < num ; i++ ){
    		const radius = Math.round(Math.random() * 30 + 7);
    		const left = Math.random() * (clientWidth - 2 * radius);
    		const top = Math.random() * (clienHeight - 2 * radius);
    		lights.push({
    			left,
    			top,
    			radius,
    			xv:0,
    			yv:0,
    		});
    	}
    	return lights;
    }


    //光源移动动画
    startLightAnimation(){
    	const loop = () => {
    		const maxXv = Math.random() * 1 + Math.random() * 3;//最大x方向速度
    		const maxYv = Math.random() * 2 + Math.random() * 2; //最大y方向速度
    		this.setState((prevState, props) => {
    			const newLights = prevState.randomLights.map(item => {
    				let ax = Math.random() * 0.5 + Math.random() * 0.5; //x 方向 加速度
    				let ay = Math.random() * 0.3 + Math.random() * 0.7; // y 方向 加速度
    				ax = Math.random() > 0.5 ? ax : -ax; // x 加速度速度 方向
    				ay = Math.random() > 0.5 ? ay : -ay; // y 加速度速度 方向

    				let newXv = ax  + item.xv;
    				let newYv = ay  + item.yv;
                    
    				if (newXv > maxXv || newXv < -maxXv){
    					newXv = newXv > 0 ? maxXv : - maxXv;
    				}

    				if (newYv > maxYv || newYv < - maxYv){
    					newYv = newYv > 0 ? maxYv : - maxYv;
    				}

    				let newItem = {
    					xv:newXv,
    					yv:newYv,
    					left:item.left + newXv,
    					top:item.top + newYv,
    					radius:item.radius,
    				};
                    
    				const width = (item.radius * 2);
                    
    				if (newItem.left < 0){
    					newItem.left = 0;
    					newItem.xv = - newItem.xv;
    				}
                    
    				if (newItem.left > document.body.clientWidth - width){
    					newItem.left = document.body.clientWidth - width;
    					newItem.xv = - newItem.xv;
    				}

    				if (newItem.top < 0){
    					newItem.top  = 0;
    					newItem.yv =  - newItem.yv;
    				}
                    
    				if (newItem.top > document.body.clientHeight - width){
    					newItem.top = document.body.clientHeight - width;
    					newItem.yv =  - newItem.yv;
    				}

    				return newItem;
    			});
                
    			this.setState({
    				randomLights:newLights
    			});
    		});
    		this.requestAnimationFrameId = requestAnimationFrame(loop);
    	};

    	this.requestAnimationFrameId = requestAnimationFrame(loop);
    }
}