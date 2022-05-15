import React from "react";
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { apiFetchUsersInfo, apiFetchLinkInfo, apiSearchUser, apiGetUserInfo } from "./backEndLookUp";
export function UsersSearch() {
    let [searchResult, setSearchResult] = useState([])
    let userSearchRef = React.createRef()
    let submitSearch = (e) => {
        e.preventDefault()
        let search = userSearchRef.current.value
        apiSearchUser(String(search), handleSearch)
    }
    let handleSearch = (response, data) => {
        if (response.status === 200) {
            if (data.results.length === 0) {
                toast.error("No Results",
                    {
                        theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                        progress: undefined,
                    }
                )
            }
            else {
                setSearchResult(data)
            }
        }
        else {
            toast.error("There was an error",
                {
                    theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                    progress: undefined,
                }
            )
        }
    }
    return (
        <div className="document-wrapper">
            <div className="user-search-container">
                <div className="search-container">
                    <div className="search-bar-wrapper col-lg-8 col-sm-11 col-xs">
                        <form className="search-bar" onSubmit={(e) => submitSearch(e)}>
                            <div className="search-text">
                                <input placeholder="Search user" ref={userSearchRef} className="input-search" type="text" />
                            </div>
                            <button className="search-icon"><i className="bi bi-search"></i></button>
                        </form>
                    </div>
                </div>
                <UserResults searchResult={searchResult} />
                <ToastContainer />
            </div>
        </div>
    )
}

export function UserResults(props) {
    let [users, setUsers] = useState([])
    let [prevStyle, setPrevStyle] = useState("btn btn-primary disabled")
    let [nextStyle, setNextStyle] = useState("btn btn-primary")
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
                if (data.next === null) {
                    setNextStyle("btn btn-primary disabled")
                }
            }
        }
        apiFetchUsersInfo(searchusers)
    }, [])
    useEffect(() => {
        if (props.searchResult.length !== 0) {//check if the 
            console.log(props.searchResult)
            checkButtons(props.searchResult, setNextStyle, setPrevStyle)
            document.getElementById("page-index").innerHTML = 1
            setUsers(props.searchResult.results)
            setFetched(props.searchResult)
        }
    }, [props.searchResult])
    let displayNewList = (response, data) => {
        if (response.status !== 400) {
            checkButtons(data, setNextStyle, setPrevStyle)
            setUsers(data.results)
            setFetched(data)
        }
        else {
            toast.error("An error has occured",
                {
                    theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                    progress: undefined,
                }
            )
        }
    }
    let fetchNext = () => {
        apiFetchLinkInfo(fetched.next, displayNewList)
        let index = parseInt(document.getElementById('page-index').innerHTML)
        index += 1
        document.getElementById('page-index').innerHTML = index
    }
    let fetchPrev = () => {
        apiFetchLinkInfo(fetched.previous, displayNewList)
        let index = parseInt(document.getElementById('page-index').innerHTML)
        index -= 1
        document.getElementById('page-index').innerHTML = index
    }
    return (
        <div className="user-results-container">
            <div className="user-results-wrapper col-lg-8 col-sm-11 col-xs">
                <table className="user-results">
                    <thead className="results-heading">
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
                            return (
                                <tr key={users.id}>
                                    <td><Link to={`/${users.id}`}>{users.email}</Link></td>
                                    <td>{users.first_name}</td>
                                    <td>{users.last_name}</td>
                                    <td>{users.phone_number}</td>
                                    <td>{date.toDateString()}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="pagination-wrapper">
                    <div className="btn-group">
                        <button className={`${prevStyle} btn-sm`} id="prev-button" onClick={() => fetchPrev()}>Prev</button>
                        <div className="btn btn-outline-primary btn-sm disabled" id="page-index">1</div>
                        <button className={`${nextStyle} btn-sm`} id="next-button" onClick={() => fetchNext()}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function checkButtons(data, next, previous) {
    if (data.next == null) {
        next('btn btn-primary disabled')
    }
    if (data.previous == null) {
        previous('btn btn-primary disabled')
    }
    if (data.next !== null) {
        next('btn btn-primary')
    }
    if (data.previous !== null) {
        previous('btn btn-primary')
    }
}

export function UserPage({ match, location }) {
    let [userId, setUserId] = useState()
    useEffect(() => {
        let url = window.location.href
        let urlArray = url.split('/')
        let idUrl;
        if (urlArray[urlArray.length - 1] === "") {//Since router does not get rendered by django I will have to use raw urls
            idUrl = urlArray[urlArray.length - 2]
        }
        else {
            idUrl = urlArray[urlArray.length - 1]
        }
        let hadleResponse = (response, data) => {
            console.log(data)
            setUserId(data.id)
        }
        apiGetUserInfo(idUrl, hadleResponse)
    }, [])
    return (
        <>
            <h1>This is the page</h1>

        </>

    )
}
