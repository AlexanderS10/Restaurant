import React, { useEffect, useState } from "react";
import '../styles/login.css'
import { Link } from 'react-router-dom';
import { apiRegisterCustomer } from "./backEndLookup";
export function RegistrationPage() {
    let [error, setError] = useState(null)
    let handleSubmit = (e) => {
        e.preventDefault()
        let form = new FormData(e.target)
        let entries = Object.fromEntries(form.entries())
        let error_temp = []
        //console.log(entries)
        if (entries.password !== entries.password2) {//check if passwords match
            setError([{ error: "Passwords do not match" }])
            document.getElementById("password").value = ""
            document.getElementById("password2").value = ""
        }
        if (String(entries.password).length < 8) {//check if the passwords are atl least the required length
            setError([{error: "Password should be at least 8 characters long" }])
        }
        if(String(entries.first_name).length>20 || String(entries.last_name).length>20){
            
        }
        else {//if no errors are found
            delete entries["password2"]
            let handleResponse = (response, data) => {
                console.log("The response status code is: ", response.status)
                error_temp=[]
                console.log(data)
                for(let x in data){
                    if (x === 'email') {
                        error_temp.push({error:"The email address entered is already in use or is invalid"}) 
                        continue
                    }
                    if(x==='first_name'){
                        error_temp.push({error:`Name: ${data[x][0]}`})
                        continue
                    }
                    if(x==='last_name'){
                        error_temp.push({error:`Last Name: ${data[x][0]}`})
                        continue
                    }
                    error_temp.push({error:data[x][0]})
                }
                setError(error_temp)
                if(response.status===200){
                    console.log("This works")
                }
            }
            apiRegisterCustomer(handleResponse, entries)
            //console.log(entries)
        }
    }

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

                                <form onSubmit={handleSubmit} className="mx-3" method="post">

                                    <div className="emailAddressLog">
                                        <label htmlFor="modalLRInput10" className="mt-3">Email
                                            Address:</label>
                                        <div className="input-group mb-3">
                                            <i className="bi bi-envelope-fill input-group-text"></i>
                                            <input className="form-control" name="email" required />
                                        </div>
                                    </div>
                                    <div className="emailAddressLog">
                                        <label htmlFor="modalLRInput10">First Name:</label>
                                        <div className="input-group mb-3">
                                            <i className="bi bi-person-fill input-group-text"></i>
                                            <input className="form-control" name="first_name" required />
                                        </div>
                                    </div>
                                    <div className="emailAddressLog ">
                                        <label htmlFor="modalLRInput10">Last Name:</label>
                                        <div className="input-group mb-3">
                                            <i className="bi bi-person-fill input-group-text"></i>
                                            <input className="form-control" name="last_name" required maxLength='20'/>
                                        </div>
                                    </div>
                                    <div className="emailAddressLog ">
                                        <label htmlFor="modalLRInput10">Phone Number:</label>
                                        <div className="input-group mb-3">
                                            <i className="bi bi-phone-fill input-group-text"></i>
                                            <input className="form-control" name="phone_number" required />
                                        </div>
                                    </div>
                                    <div className="passwordLog ">
                                        <label htmlFor="modalLRInput11">Password:</label>
                                        <div className="input-group mb-3">
                                            <i className="bi bi-lock-fill input-group-text"></i>
                                            <input className="form-control" name="password" id="password" type="password" />
                                        </div>
                                    </div>
                                    <div className="passwordLog ">
                                        <label htmlFor="modalLRInput11">Confirm
                                            Password:</label>
                                        <div className="input-group mb-3">
                                            <i className="bi bi-lock-fill input-group-text"></i>
                                            <input className="form-control" name="password2" id="password2" type="password" required />
                                        </div>
                                    </div>
                                    {error !== null ? (
                                        
                                        <div>
                                            {error.map(({error}) => {
                                                return (
                                                    <div key={parseInt(Math.random()*(1000-10)+10)} className="alert alert-danger col-12 alert-custom">
                                                        {error}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                    ) : ("")}
                                    <button type="submit" className="btn btn-success col-12 mb-3"><i
                                        className="bi bi-person-plus"> Register</i></button>
                                </form>
                                <p className="login-card-footer-text">Already have an account? <Link to="/login"
                                    className="">Login here</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}