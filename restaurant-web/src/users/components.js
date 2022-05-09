import React from "react";
import { useEffect, useState } from 'react';
import { searchlookup, lookup } from "../api_lookup";
import { ToastContainer, toast } from 'react-toastify';
export function UsersSearch() {
    let [users, setUsers] = useState([])
    let [prevStyle, setPrevStyle]= useState("btn btn-primary disabled")
    let [nextStyle, setNextStyle]= useState("btn btn-primary")
    let [fetched, setFetched] = useState()

    useEffect(() => {
        console.log("Call component")
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
                setFetched(data)
                console.log(data)
                if(data.next === null){
                    setNextStyle("btn btn-primary disabled")
                    
                } 
            }
        }
        searchlookup("GET", "users/", searchusers)
        //lookup("GET","users/",searchusers)
    }, [])
    let NavigatePagination = (value)=>{
        
    }
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
                                let date = new Date(users.date_joined)
                                console.log("Redraw")
                                return (
                                    <tr key={users.id}>
                                        <td>{users.email}</td>
                                        <td>{users.first_name}</td>
                                        <td>{users.last_name}</td>
                                        <td>{users.phone_number}</td>
                                        <td>{date.toUTCString()}</td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                    <div className="pagination-wrapper">
                        <div className="btn-group">
                            <button className={`${prevStyle} btn-sm`} id="prev-button">Prev</button>
                            <div className="btn btn-outline-primary btn-sm disabled">1</div>
                            <button className={`${nextStyle} btn-sm`} id="next-button">next</button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}