import React, { useEffect, createContext, useReducer, useContext } from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import './App.css'
import { reducer, initialState } from './reducers/userReducer';
import Navbar from './components/templates/Navbar';
import Home from './components/pages/Home';
import Signup from './components/pages/Signup';
import Signin from './components/pages/Signin';
import Profile from './components/pages/Profile';
import CreatePost from './components/pages/CreatePost';
import UserProfile from './components/pages/UserProfile';
import UserFollowingPost from './components/pages/UserFollowingPost';

export const UserContext = createContext();

const Routing = () => {
	const history = useHistory();
	const { dispatch } = useContext(UserContext);

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			dispatch({
				type: "USER",
				payload: user
			});
		} else {
			history.push('/signin');
		}
	},[dispatch, history]);

	return (
		<Switch>
			<Route path="/" exact>
				<Home />
			</Route>
			<Route path="/signin">
				<Signin />
			</Route>
			<Route path="/signup">
				<Signup />
			</Route>
			<Route path="/profile" exact>
				<Profile />
			</Route>
			<Route path="/profile/:id">
				<UserProfile />
			</Route>
			<Route path="/create">
				<CreatePost />
			</Route>
			<Route path="/following">
				<UserFollowingPost />
			</Route>
		</Switch>
	);
}

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<UserContext.Provider value={{ state, dispatch }}>
			<BrowserRouter>
				<Navbar />
				<Routing />
			</BrowserRouter>
		</UserContext.Provider>
	);
}

export default App;
