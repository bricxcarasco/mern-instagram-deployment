import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import M from 'materialize-css';

const NavbarT = () => {
    const history = useHistory();

    const { state, dispatch } = useContext(UserContext);

    const logoutFunction = () => {
        localStorage.clear();
        dispatch({
            type: "CLEAR"
        });
        history.push('/signin');
    }

    const renderList = () => {
        if (state) {
            return [
                <li key="0"><Link to="/following">Posts</Link></li>,
                <li key="1" ><Link to="/profile">Profile</Link></li>,
                <li key="2"><Link to="/create">Create Post</Link></li>,
                <li key="3">
                    <button 
                    className="btn #c62828 red darken-3"
                    onClick={() => logoutFunction()}>Logout</button>
                </li>
            ];
        } else {
            return [
                <li key="4"><Link to="/signin">Signin</Link></li>,
                <li key="5"><Link to="/signup">Signup</Link></li>
            ];
        }
    }

    const renderListMobile = () => {
        if (state) {
            return [
                <li key="0"><a href="/following">Posts</a></li>,
                <li key="1" ><a href="/profile">Profile</a></li>,
                <li key="2"><a href="/create">Create Post</a></li>,
                <li key="3">
                    <button 
                    className="btn #c62828 red darken-3 btn-logout"
                    onClick={() => logoutFunction()}>Logout</button>
                </li>
            ];
        } else {
            return [
                <li key="4"><Link to="/signin">Signin</Link></li>,
                <li key="5"><Link to="/signup">Signup</Link></li>
            ];
        }
    }

    return (
        <>
            <nav>
                <div className="nav-wrapper white">
                    <div className="container">
                        <Link to={state ? "/" : "/signin"} className="brand-logo">Instagram</Link>
                        <a 
                            href="/" 
                            data-target="mobile-demo" 
                            className="sidenav-trigger">
                            <i className="material-icons">menu</i>
                        </a>
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            { renderList() }
                        </ul>
                    </div>
                </div>
            </nav>

            <ul className="sidenav" id="mobile-demo">
                {
                    renderListMobile()
                }
            </ul>

            {
                document.addEventListener('DOMContentLoaded', () => {
                    let elems = document.querySelectorAll('.sidenav');
                    M.Sidenav.init(elems);
                })
            }
        </>
    );
}
 
export default NavbarT;