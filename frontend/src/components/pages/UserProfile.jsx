import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../App';


const UserProfile = () => {
    const { id } = useParams();
    const { dispatch } = useContext(UserContext);

    const [ userPost, setUserPost ] = useState([]);
    const [ user, setUser ] = useState({});
    const [ isFollow, setIsFollow ] = useState(JSON.parse(localStorage.getItem("user")).following.includes(id));
    const [ followingText, setFollowingText ] = useState("Following");

    useEffect(() => {
        fetch(`/user/${id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        })
        .then(response => response.json())
        .then(profile => {
            setUser(profile.user);
            setUserPost(profile.posts);
        })
        .catch(error => {
            console.log(error);
        });
    },[id]);

    const onFollowingHover = () => {
        setFollowingText("Unfollow");
    }

    const onFollowingAfter = () => {
        setFollowingText("Following");
    }

    const followUser = () => {
        fetch('/follow', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                id
            })
        })
        .then(response => response.json())
        .then(result => {
            dispatch({
                type: "UPDATE",
                payload: {
                    followers: result.followers,
                    following: result.following
                }
            });
            localStorage.setItem("user", JSON.stringify(result));
            setUser((prevState) => {
                return {
                    ...prevState,
                    followers:  [...prevState.followers, result._id]
                }
            });
            setIsFollow(true);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                id
            })
        })
        .then(response => response.json())
        .then(result => {
            dispatch({
                type: "UPDATE",
                payload: {
                    followers: result.followers,
                    following: result.following
                }
            });
            localStorage.setItem("user", JSON.stringify(result));
            setUser((prevState) => {
                const setFollowers = prevState.followers.filter(follower => follower !== result._id);
                return {
                    ...prevState,
                    followers: setFollowers
                }
            });
            setIsFollow(false);
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <React.Fragment>
            {
                Object.entries(user).length !== 0 ? 
                <div className="main-profile">
                    <div className="profile">
                        <div>
                            <img 
                                className="profile-picture" 
                                src={user.photo} 
                                alt={user.name}/>
                        </div>
                        <div>
                            <h5>
                                { user.name }
                                {
                                    isFollow ? 
                                    <button 
                                        className="following-button btn-small right #0094f6 blue darken-1"
                                        onMouseEnter={onFollowingHover}
                                        onMouseLeave={onFollowingAfter}
                                        onClick={unfollowUser}
                                        >{followingText}</button>
                                    :
                                    <button 
                                        className="follow-button btn-small right #0094f6 blue darken-2"
                                        onClick={followUser}
                                        >Follow</button>
                                }
                            </h5>
                            <h6>{ user.email }</h6>
                            <div className="profile-count">
                                <h6>{ userPost.length } posts</h6>
                                <h6>{ user.followers.length } followers</h6>
                                <h6>{ user.following.length } following</h6>
                            </div>
                        </div>
                    </div>
                    <div className="gallery">
                        {
                            userPost.map(post => {
                                return (
                                    <img 
                                        key={post._id} 
                                        className="gallery-image" 
                                        src={post.photo} 
                                        alt={post.title}/>
                                );
                            })
                        }
                    </div>
                </div>
                : <h2 className="user-profile-loading center-align">loading...</h2>
            }
        </React.Fragment>
    );
}
 
export default UserProfile;