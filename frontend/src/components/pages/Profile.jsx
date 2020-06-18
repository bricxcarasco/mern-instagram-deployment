import React, { useEffect, useState, useContext } from 'react';
import M from 'materialize-css'
import { UserContext } from '../../App';

const Profile = () => {
    const { state, dispatch } = useContext(UserContext);
    const [ myPostImage, setMyPostImage ] = useState([]);
    const [ profilePictureUrl, setProfilePictureUrl ] = useState("");

    useEffect(() => {
        fetch('/my-post', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setMyPostImage(data.myposts);
        })
        .catch(error => {
            console.log(error);
        })
    }, []);

    useEffect(() => {
        if (profilePictureUrl) {
            fetch('/change/profile/picture', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                },
                body: JSON.stringify({
                    photo: profilePictureUrl
                })
            })
            .then(response => response.json())
            .then(result => {
                localStorage.setItem("user", JSON.stringify({...state, photo: result.photo}));
                dispatch({
                    type: "CHANGEPIC",
                    payload: result.photo
                });
                document.querySelector(".profile-picture-text").innerHTML = "";
                M.toast({
                    html: result.message,
                    classes: "#43a047 green darken-1"
                });
            })
            .catch(error => {
                console.log(error);
                M.toast({
                    html: "Check your internet connection", 
                    classes: "#e53935 red darken-1"
                });
            });
            setProfilePictureUrl("");
        }
    }, [profilePictureUrl, dispatch, state]);

    const uploadProfilePicture = (profilePictureFile) => {
        const imageForm = new FormData();
        imageForm.append("file", profilePictureFile);
        imageForm.append("upload_preset", "instagram-clone");
        imageForm.append("cloud_name", "gss-bricx-carasco");
        fetch(process.env.REACT_APP_IMAGE_BUCKET_API, {
            method: "POST",
            body: imageForm
        })
        .then(response => response.json())
        .then(data => {
            setProfilePictureUrl(data.secure_url);
        })
        .catch(error => {
            console.log(error);
            M.toast({
                html: "Check your internet connection", 
                classes: "#e53935 red darken-1"
            });
        });
    }

    return (
        <React.Fragment>
            {
                state ? 
                <div className="main-profile">
                    <div className="profile">
                        <div>
                            <div>
                                <img 
                                    className="profile-picture" 
                                    src={state.photo} 
                                    alt={state.name}/>
                            </div>
                            <div className="profile-upload-pic" style={{ textAlign: "center" }}>
                                <div className="file-field input-field">
                                    <div className="btn btn-small #64b5f6 blue darken-2 profile-upload-pic-btn">
                                        <span>Profile Pic</span>
                                        <input 
                                            type="file"
                                            onChange={event => uploadProfilePicture(event.target.files[0])}
                                            />
                                    </div>
                                    <div className="file-path-wrapper">
                                        <input 
                                            className="file-path validate profile-picture-text" 
                                            type="text" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4>{ state.name }</h4>
                            <h5>{ state.email }</h5>
                            <div className="profile-count">
                                <h6>{ myPostImage.length } posts</h6>
                                <h6>{ state.followers.length } followers</h6>
                                <h6>{ state.following.length } following</h6>
                            </div>
                        </div>
                    </div>
                    <div className="gallery">
                        {
                            myPostImage.map(mypost => {
                                return (
                                    <img 
                                        key={mypost._id} 
                                        className="gallery-image" 
                                        src={mypost.photo} 
                                        alt={mypost.title}/>
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
 
export default Profile;