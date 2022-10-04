import React, { useEffect } from "react";
import '../styles/login.css'
import { Link } from 'react-router-dom';
export function RegistrationPage() {

    return (
        <div className="login-body" style={{ background: 'url(static/landing/slide/view1.jpeg)' }}>
            <div className="login-container vertical-center ">
                <div className="container container-login col-xl-3 col-lg-4 col-md-6 col-sm-7 col-xs-12 px-0">
                    <div className="row no-gutters px-0">
                        <div className="col-md">
                            <div className="card-body">
                                <div className="brand-wrapper">
                                    <h1> Restaurant </h1>
                                </div>
                                <p className="login-card-description">Register here</p>
                                <Link className="btn btn-secondary back-home" to="/"><i className="bi bi-house-fill"></i></Link>

                                <form action="{%url 'register'%}" className="mx-3" method="post">

                                    <div className="emailAddressLog">
                                        <label data-error="wrong" data-success="right" htmlFor="modalLRInput10" className="mt-3">Email
                                            Address:</label>
                                        <div className="input-group mb-3">
                                            <i className="bi bi-envelope-fill input-group-text"></i>
                                            <input className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="emailAddressLog">
                                        <label data-error="wrong" data-success="right" htmlFor="modalLRInput10">First Name:</label>
                                        <div className="input-group mb-3">
                                            <i className="bi bi-person-fill input-group-text"></i>
                                            <input className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="emailAddressLog ">
                                        <label data-error="wrong" data-success="right" htmlFor="modalLRInput10">Last Name:</label>
                                        <div className="input-group mb-3">
                                            <i className="bi bi-person-fill input-group-text"></i>
                                            <input className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="emailAddressLog ">
                                        <label data-error="wrong" data-success="right" htmlFor="modalLRInput10">Phone Number:</label>
                                        <div className="input-group mb-3">
                                            <i className="bi bi-phone-fill input-group-text"></i>
                                            <input className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="passwordLog ">
                                        <label data-error="wrong" data-success="right" htmlFor="modalLRInput11">Password:</label>
                                        <div className="input-group mb-3">
                                            <i className="bi bi-lock-fill input-group-text"></i>
                                            <input className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="passwordLog ">
                                        <label data-error="wrong" data-success="right" htmlFor="modalLRInput11">Confirm
                                            Password:</label>
                                        <div className="input-group mb-3">
                                            <i className="bi bi-lock-fill input-group-text"></i>
                                            <input className="form-control"/>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-success col-12 mb-3" value="login"><i
                                        className="bi bi-person-plus"> Register</i></button>
                                    <input type="hidden" name="next" value="{{ next }}" />
                                </form>
                                <p className="login-card-footer-text">Already have an account? <a href="{% url 'login' %}"
                                    className="text-reset">Login here</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}