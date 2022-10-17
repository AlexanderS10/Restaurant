import React, { useEffect, useState } from "react";
import { LOGIN_SUCCESS, LOGIN_FAIL } from "../reducers/types";
import { Link, Navigate } from 'react-router-dom';
import '../styles/login.css'
import { apiLogin } from './backEndLookup'
import { connect } from "react-redux"
import { Login } from "../api_lookup/frontendAuth";
import { useDispatch, useSelector } from 'react-redux'
export function LoginPage(props) {
    let dispatch = useDispatch()
    let [error, setError] = useState(null)
    const isAuthenticated = useSelector((state)=>state.auth.isAuthenticated)
    let handleFormSubmit = (e) => {
        e.preventDefault()
        let form = new FormData(e.target)
        let entries = Object.fromEntries(form.entries())
        let handleLogin = (response, data) => {
            console.log("handle function executed")
            //console.log(isAuthenticated)
            console.log(response, data)
            if (response.status !== 200) {
                dispatch({
                    type: LOGIN_FAIL
                })
                setError({ error: "Incorrect email or password" })
            }
            else {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: data
                })
            }
        }
        Login(entries, handleLogin, dispatch)
        //console.log(isAuthenticated)
    }
    return (
        // {if(){

        // }}
        <div className="login-body" style={{ background: 'url(static/landing/slide/view1.jpeg)' }}>
            {/* {isAuthenticated?(<Navigate to="/portal"></Navigate>):("")} */}
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
                                <form className="mx-3" onSubmit={(e) => handleFormSubmit(e)}>
                                    <div className="emailAddressLog">
                                        <label data-error="wrong" data-success="right" htmlFor="modalLRInput10" className="mt-3">Email
                                            Address:</label>
                                        <div className="input-group mb-3">
                                            <i className="bi bi-envelope-fill input-group-text"></i>
                                            <input className="form-control validate" id="id_username" name="email" required />
                                        </div>
                                    </div>
                                    <div className="passwordLog mb-4">
                                        <label data-error="wrong" data-success="right" htmlFor="modalLRInput11">Password:</label>
                                        <div className="input-group">
                                            <i className="bi bi-lock-fill input-group-text"></i>
                                            <input className="form-control calidate" id="id_password" name="password" type="password" required />
                                        </div>
                                    </div>
                                    {error !== null ? (
                                        <div className="alert alert-danger col-12 alert-custom">
                                            {error.error}
                                        </div>
                                    ) : ("")}
                                    <button type="submit" className="btn btn-primary col-12 mb-3" value="login">Log in</button>
                                </form>
                                <a href="none" className="forgot-password-link">Forgot password?</a>
                                <p className="login-card-footer-text">Don't have an account? <Link to="/register" >Register here</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

