import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const ResetPassword = () => {
    const history = useHistory();

    const [ email, setEmail ] = useState("");
    
    const validateEmailAddress = (email) => {
        // eslint-disable-next-line
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }

    const resetPassword = () => {
        if (!validateEmailAddress(email)) {
            M.toast({
                html: "Invalid email address",
                classes: "#e53935 red darken-1"
            });
            setEmail("");
            return;
        }

        fetch('/reset-password', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
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
                    html: data.message,
                    classes: "#43a047 green darken-1"
                });
                setEmail("");
                history.push('/signin');
            }
        });
    }

    return (
        <div className="my-card">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>

                <input 
                    type="text" 
                    placeholder="Email Address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    />

                <button 
                    className="btn waves-effect waves-light #64b5f6 blue darken-2"
                    onClick={() => resetPassword()}>Reset Password</button>
            </div>
        </div>
    );
}
 
export default ResetPassword;