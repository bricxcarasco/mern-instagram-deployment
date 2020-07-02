import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import M from 'materialize-css';

const Signin = () => {
    const { dispatch } = useContext(UserContext);

    const history = useHistory();

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const loginFunction = () => {
        fetch('/signin', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
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
                localStorage.setItem("jwt", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                dispatch({
                    type: "USER",
                    payload: data.user
                });
                M.toast({
                    html: "Successfully logged in",
                    classes: "#43a047 green darken-1"
                });
                history.push('/');
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

                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(event => setPassword(event.target.value))}
                    />

                <button 
                    className="btn waves-effect waves-light #64b5f6 blue darken-2"
                    onClick={() => loginFunction()}>Log In</button>
            </div>

            <div className="card auth-card-account input-field">
                <p>Don't have account an accout? <Link to="/signup">Sign Up</Link></p>
            </div>

            <div className="card auth-card-account input-field">
                <p>Forgot your password? <Link to="/reset-password">Reset Password</Link></p>
            </div>
        </div>
    );
}
 
export default Signin;