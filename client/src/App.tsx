import React from 'react';
import HomePage from './page/Home';
import LoginRegisterPage from './page/LoginRegister';
import SnippetSharePage from './page/SnippetSharePage';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import { AuthAPI } from '../src/api/auth';


const App = class extends React.Component<{}, {}> {

	async componentWillMount(){
		const res = await AuthAPI.auth();
	
	}

	render(){
		return ( 
			<div className="App">
				<Router>
					<Switch>
						<Route path="/login" exact component={LoginRegisterPage} />
						<Route path="/home" exact component={HomePage}/>
						<Route path="/share/:id" exact component={SnippetSharePage}  />
						<Redirect to='/login'/>
					    {/* <AuthComponent /> */}
					</Switch>
				</Router>
			</div>
		); 
	}
};

const routes = [
	{
		path:'/login',
		component:LoginRegisterPage,
		auth:false,
	},
	{
		path:'/share/:id',
		component:SnippetSharePage,
		auth:false,
	},
	{
		path:'/home',
		component:HomePage,
		auth:true,
	}
];

// const AuthComponent = (props:any) => {
// 	const {location} = props;
// 	if (authFinish){
// 		console.log('location', location);
// 		const route = routes.find(r => r.path === location.pathname);
// 		console.log(route);
// 		if (route){            
// 			if (!route.auth || isLogin){
// 				return (<Route path={route.path} exact component={route.component}/>);
// 			} else {
// 				return (<Redirect to='/login'/>);
// 			}
// 		} else {
// 			return (<Redirect to='/login'/>);
// 		}
// 	} else {
// 		return (<p>bg</p>);
// 	}
// };




export default App;
