import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import M from 'materialize-css';

const NavbarT = () => {
    const history = useHistory();

    const { state, dispatch } = useContext(UserContext);
    
    const [ searchUser, setSearchUser ] = useState("");
    const [ usersList, setUsersList ] = useState([]);
    const searchModal = useRef(null);
    const mobileNavbar = useRef(null);

    const logoutFunction = () => {
        localStorage.clear();
        dispatch({
            type: "CLEAR"
        });
        history.push('/signin');
    }

    const resetSearchStrings = () => {
        setSearchUser("");
        setUsersList([]);
    }

    const closeNavbar = () => {
        let instance = M.Sidenav.getInstance(mobileNavbar.current);
        if (instance.isOpen) {
            instance.close();
        }
    }

    const closeModal = () => {
        resetSearchStrings();
        M.Modal.getInstance(searchModal.current).close();
    }

    const fetchUsers = (query) => {
        setSearchUser(query);
        if (query !== "") {
            fetch('/search-user', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                },
                body: JSON.stringify({
                    query
                })
            })
            .then(response => response.json())
            .then(result => {
                setUsersList(result.users);
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            resetSearchStrings();
        }
    }

    const renderList = () => {
        if (state) {
            return [
                <li key="0"><a href="false"><i data-target="search-modal" className="modal-trigger large material-icons navbar-search">search</i></a></li>,
                <li key="1"><Link to="/following">Posts</Link></li>,
                <li key="2" ><Link to="/profile">Profile</Link></li>,
                <li key="3"><Link to="/create">Create Post</Link></li>,
                <li key="4">
                    <button 
                    className="btn #c62828 red darken-3"
                    onClick={() => logoutFunction()}>Logout</button>
                </li>
            ];
        } else {
            return [
                <li key="5"><Link to="/signin">Signin</Link></li>,
                <li key="6"><Link to="/signup">Signup</Link></li>
            ];
        }
    }

    useEffect(() => {
        M.Modal.init(searchModal.current);
    }, [searchModal]);

    useEffect(() => {
        if (searchUser === "") {
            resetSearchStrings();
        }
    }, [searchUser]);

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

            <div id="search-modal" className="modal" ref={searchModal}>
                <div className="modal-content">
                    <input 
                        type="text" 
                        placeholder="Search user"
                        value={searchUser}
                        onChange={(event) => fetchUsers(event.target.value)}
                        />

                        {
                            usersList.length !== 0 || searchUser !== "" ?
                            <ul className="collection">
                                {
                                    usersList.map(user => {
                                        return <li 
                                            key={user._id} 
                                            className="collection-item">
                                                <Link 
                                                    to={ state._id === user._id ? `/profile` : `/profile/${user._id}`} 
                                                    onClick={closeModal}>
                                                        <b>{user.name}</b> <i>{user.email}</i>
                                                </Link>
                                            </li>
                                    })
                                }
                            </ul>
                            : <h5 className="center"><i>Search users</i></h5>
                        }
                </div>
                <div className="modal-footer">
                    <button 
                        className="modal-close waves-effect waves-green btn-flat" 
                        onClick={resetSearchStrings}>
                            Close</button>
                </div>
            </div>

            <ul className="sidenav" id="mobile-demo" ref={mobileNavbar} onClick={closeNavbar}>
                {
                    renderList()
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