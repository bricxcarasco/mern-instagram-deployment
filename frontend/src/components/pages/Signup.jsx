import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import { useEffect } from 'react';

const Signup = () => {
    const history = useHistory();

    const [ name, setName ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ image, setImage ] = useState("");
    const [ imageUrl, setImageUrl ] = useState(undefined);

    useEffect(() => {
        if (imageUrl) {
            uploadUserInformation();
        }
    });

    const validateEmailAddress = (email) => {
        // eslint-disable-next-line
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }

    const uploadProfilePicture = () => {
        const imageForm = new FormData();
        imageForm.append("file", image);
        imageForm.append("upload_preset", "instagram-clone");
        imageForm.append("cloud_name", "gss-bricx-carasco");
        fetch(process.env.REACT_APP_IMAGE_BUCKET_API, {
            method: "POST",
            body: imageForm
        })
        .then(response => response.json())
        .then(data => {
            setImageUrl(data.secure_url);
        })
        .catch(error => {
            console.log(error);
        });
    }

    const uploadUserInformation = () => {
        if (!validateEmailAddress(email)) {
            M.toast({
                html: "Invalid email adress format", 
                classes: "#e53935 red darken-1"
            });
            return;
        }

        fetch('/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                imageUrl
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                M.toast({
                    html: data.error, 
                    classes: "#e53935 red darken-1"
                });
            } else {
                M.toast({
                    html: data.message,
                    classes: "#43a047 green darken-1"
                });
                history.push('/signin');
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    const postCredential = () => {
        if (image) {
            uploadProfilePicture();
        } else {
            uploadUserInformation();
        }
    }

    return (
        <div className="my-card">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>

                <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={name} 
                    onChange={(event) => setName(event.target.value)}
                    />

                <input 
                    type="text" 
                    placeholder="Email Address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    />

                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    />
                
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-2">
                        <span>Profile Pic</span>
                        <input 
                            type="file" 
                            onChange={event => setImage(event.target.files[0])}
                            />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                    
                <button 
                    onClick={() => postCredential()} 
                    className="btn waves-effect waves-light #64b5f6 blue darken-2">Sign up</button>
            </div>

            <div className="card auth-card-account input-field">
                <p>Have account an accout? <Link to="/signin">Log In</Link></p>
            </div>
        </div>
    );
}
 
export default Signup;