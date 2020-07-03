import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css';

const NewPassword = () => {
    const { token } = useParams();

    const history = useHistory();

    const [ password, setPassword ] = useState("");

    const newPassword = () => {
        fetch('/new-password', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token,
                password
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
        });
    }

    return (
        <div className="my-card">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>

                <input 
                    type="password" 
                    placeholder="New Password" 
                    value={password}
                    onChange={(event => setPassword(event.target.value))}
                    />

                <button 
                    className="btn waves-effect waves-light #64b5f6 blue darken-2"
                    onClick={() => newPassword()}>Save New Password</button>
            </div>
        </div>
    );
}
 
export default NewPassword;