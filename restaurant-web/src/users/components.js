import React from "react";
import { useEffect, useState } from 'react';
import { searchlookup, lookup } from "../api_lookup";
import { ToastContainer, toast } from 'react-toastify';
export function UsersSearch() {
    let [users, setUsers] = useState([])
    useEffect(() => {
        let searchusers = (response, data) => {
            if (response.status === 400) {
                toast.error(data.message,
                    {
                        theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                        progress: undefined,
                    }
                )
            }
            else {
                setUsers(data.results)
                console.log(data.results)
            }
        }
        searchlookup("GET", "users/", searchusers)
        //lookup("GET","users/",searchusers)
    }, [])
    return (
        <div className="user-search-container">
            <div className="container search-container">
                <div className="search-bar-wrapper col-lg-8 ">
                    <form className="search-bar">

                        <div className="search-text">
                            <input className="input-search" type="text" />
                        </div>
                        <button className="search-icon"><i className="bi bi-search"></i></button>

                    </form>

                </div>
            </div>
            <div className="user-results-container container">
                <div className="user-results-wrapper col-lg-8">
                    <table className="user-results">
                        <thead>
                            <tr>
                                <th>EMAIL</th>
                                <th>FIRST NAME</th>
                                <th>LAST NAME</th>
                                <th>PHONE NUMBER</th>
                                <th>DATE JOINED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((users, index) => {
                                return (
                                    <tr key={users.id}>
                                        <td>{users.email}</td>
                                        <td>{users.first_name}</td>
                                        <td>{users.last_name}</td>
                                        <td>{users.phone_number}</td>
                                        <td>{users.date_joined}</td>
                                    </tr>
                                )
                            })}

                        </tbody>

                    </table>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}