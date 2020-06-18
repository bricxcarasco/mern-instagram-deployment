import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const CreatePost = () => {
    const history = useHistory();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        if (imageUrl) {
            sendPost(imageUrl);
        }
    // eslint-disable-next-line 
    }, [imageUrl]);

    const sendImage = () => {
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

    const sendPost = () => {
        fetch('/create-post', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                title,
                body,
                photo: imageUrl
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                M.toast({
                    html: data.error,
                    classes: "#e53935 red darken-1"
                })
            } else {
                M.toast({
                    html: "Successfully posted",
                    classes: "#43a047 green darken-1"
                })
                history.push('/');
            }
        });
    }

    return (
        <div className="card input-field create-post">
            <input 
                type="text" 
                placeholder="title" 
                value={title}
                onChange={event => setTitle(event.target.value)}
                />

            <input 
                type="text" 
                placeholder="body" 
                value={body}
                onChange={event => setBody(event.target.value)}
                />

            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-2">
                    <span>Upload Image</span>
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
                className="btn waves-effect waves-light #64b5f6 blue darken-2"
                onClick={() => sendImage()}
                >Submit Post</button>
        </div>
    );
}
 
export default CreatePost;