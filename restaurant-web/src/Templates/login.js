import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import '../styles/login.css'
import {apiLogin} from './backEndLookup'
export function LoginPage() {
    let [error, setError] = useState(null)
    let handleFormSubmit = (e)=>{
        e.preventDefault()
        let form = new FormData(e.target)
        let entries = Object.fromEntries(form.entries())
        let handleLogin = (response, data)=>{
            console.log(response, data)
            if (response.status!==200){
                setError({error:"Incorrect email or password"})
            }
        }
        apiLogin(handleLogin, entries)
    }
    return (
        <div className="login-body" style={{background:'url(static/landing/slide/view1.jpeg)'}}>
            <div className="login-container vertical-center ">
                <div className="container container-login col-xl-3 col-lg-4 col-md-6 col-sm-7 col-xs-12 px-0">
                    <div className="row no-gutters px-0">
                        <div className="col-md">
                            <div className="card-body">
                                <div className="brand-wrapper">
                                    <h1> Restaurant </h1>
                                </div>
                                <p className="login-card-description">Sign into your account</p>
                                <Link className="btn btn-secondary back-home" to="/"><i className="bi bi-house-fill"></i></Link>
                                <form className="mx-3" onSubmit={(e)=>handleFormSubmit(e)}>
                                    <div className="emailAddressLog">
                                        <label data-error="wrong" data-success="right" htmlFor="modalLRInput10" className="mt-3">Email
                                            Address:</label>
                                        <div className="input-group mb-3">
                                            <i className="bi bi-envelope-fill input-group-text"></i>
                                            <input className="form-control validate" id="id_username" name="email"/>
                                            {/* {% comment %} <input type="text" className="form-control validate" name="username" autocapitalize="none" autocomplete="username" autofocus="" id="id_username" maxlength="60" required=""> {% endcomment %} */}
                                        </div>
                                    </div>
                                    <div className="passwordLog mb-4">
                                        <label data-error="wrong" data-success="right" htmlFor="modalLRInput11">Password:</label>
                                        <div className="input-group">
                                            <i className="bi bi-lock-fill input-group-text"></i>
                                            <input className="form-control calidate" id="id_password" name="password"/>
                                            {/* {% comment %} <input required type="password" id="id_password" className="form-control validate" contenteditable="true" autocomplete="current-password" name="password"> {% endcomment %} */}
                                        </div>
                                    </div>
                                    {error!==null?(
                                        <div className="alert alert-danger col-12 alert-custom">
                                            {error.error}
                                        </div>
                                    ):("")}
                                    <button type="submit" className="btn btn-primary col-12 mb-3" value="login">Log in</button>
                                </form>
                                <a href="none" className="forgot-password-link">Forgot password?</a>
                                <p className="login-card-footer-text">Don't have an account? <Link to="/register" className="text-reset">Register here</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}