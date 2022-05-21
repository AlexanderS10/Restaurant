import React from "react";
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { apiFetchUsersInfo, apiFetchLinkInfo, apiSearchUser, apiGetUserInfo, apiUpdateAndDeleteUser, apiResetProfileImage } from "./backEndLookUp";
import { ConfirmContextProvider, ConfirmModal, useConfirm } from "../components";
import { ReservationMaker } from "./reservation-components";
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
    let [userData, setUserData] = useState([])
    let inputRef = React.createRef()
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
            //console.log(data)
            setUserData(data)
        }
        apiGetUserInfo(idUrl, hadleResponse)
    }, [])
    let userUpdate = (e) => {
        e.preventDefault()
        let form = new FormData(document.getElementById('user-form'))
        form.append("is_admin", false)
        let checkboxes = document.querySelectorAll('.checkbox')//["is-customer-checkbox","is-active-checkbox",""]
        checkboxes.forEach(function (el) {
            if (!el.checked) {
                form.append(el.name, false)
            }
            else {
                form.append(el.name, true)
            }
        })
        let values = Object.fromEntries(form.entries())
        console.log(values)
        apiUpdateAndDeleteUser("PUT", userData.id, handleUserUpdate, values)
    }
    let toggleEmailEdit = (e) => {
        e.preventDefault()
        let input = document.querySelector('#user-email-input')
        if (input.hasAttribute('readonly')) {
            input.removeAttribute('readonly')
        } else {
            input.setAttribute('readonly', 'readonly')
        }
    }
    let handleUserUpdate = (response, data) => {
        if (response.status === 200) {
            toast.success("Updated Successfully",
                {
                    theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                    progress: undefined,
                }
            )
        }
        else {
            toast.error(handleErrorResponse(data),
                {
                    theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                    progress: undefined,
                }
            )
        }
    }
    let handleErrorResponse = (data) => {
        if (data.email) {
            return "Email already exists or is too long"
        }
        if (data.first_name || data.last_name) {
            return "Max 20 characters allowed for name and last name"
        }
        if (data.phone_number) {
            return data.phone_number[0]
        }
    }
    return (
        <ConfirmContextProvider>
            <ConfirmModal />
            <div className="container">
            <ReservationMaker />
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title">
                                    <h4>{`${userData.first_name} ${userData.last_name}`}</h4>
                                </div>
                                <div className="card-title user-image-wrapper">
                                    <img src={userData.image} className="user-image" alt="Profile" />
                                </div>
                                <div className="card-title">
                                    <h4>{new Date(userData.date_joined).toDateString()}</h4>
                                </div>
                                <form onSubmit={(e) => userUpdate(e)} className="card-body form" id="user-form">
                                    <div className="row mb-3">
                                        <div className="col-sm-3 align-items-center d-flex">
                                            <h6 className="">Email</h6>
                                        </div>
                                        <div className="col-sm-7">
                                            <input defaultValue={userData.email} className="form-control" id="user-email-input" readOnly ref={inputRef} name="email" maxLength="60" />
                                        </div>
                                        <div className="col-sm-2">
                                            <button className="form-control" onClick={(e) => toggleEmailEdit(e)}><i className="bi bi-pencil"></i></button>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <h6>First Name</h6>
                                        </div>
                                        <div className="col-sm-9">
                                            <input defaultValue={userData.first_name} className="form-control" name="first_name" maxLength="20" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <h6>Last Name</h6>
                                        </div>
                                        <div className="col-sm-9">
                                            <input defaultValue={userData.last_name} className="form-control" name="last_name" maxLength="20" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <h6>Phone Number</h6>
                                        </div>
                                        <div className="col-sm-9">
                                            <input defaultValue={userData.phone_number} name="phone_number" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <h6>Comments</h6>
                                        </div>
                                        <div className="col-sm-9">
                                            <textarea defaultValue={userData.comments} name="comments" rows="7" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <h6>Active</h6>
                                        </div>
                                        <div className="col-sm-9 form-switch">
                                            <input defaultChecked={userData.is_active} defaultValue={userData.is_active} name="is_active" type="checkbox" id="is-active-checkbox" className="form-check-input checkbox" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <h6>Customer</h6>
                                        </div>
                                        <div className="col-sm-9 form-switch">
                                            <input defaultChecked={userData.is_customer} defaultValue={userData.is_customer} name="is_customer" id="is-customer-checkbox" type="checkbox" className="form-check-input checkbox" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <h6>Staff</h6>
                                        </div>
                                        <div className="col-sm-9 form-switch">
                                            <input defaultChecked={userData.is_staff} defaultValue={userData.is_staff} name="is_staff" id="is-staff-checkbox" type="checkbox" className="form-check-input checkbox" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <h6>Admin</h6>
                                        </div>
                                        <div className="col-sm-9 form-switch">
                                            <input defaultChecked={userData.is_admin} defaultValue={userData.is_admin} type="checkbox" id="is-admin-checkbox" name="is_admin" className="form-check-input checkbox" />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <h6>Superuser</h6>
                                        </div>
                                        <div className="col-sm-9 form-switch">
                                            <input defaultChecked={userData.is_superuser} defaultValue={userData.is_superuser} type="checkbox" id="is-superuser-checkbox" name="is_superuser" className="form-check-input checkbox" />
                                        </div>
                                    </div>
                                    <div className="row mb-4">
                                        <button className="btn btn-primary form-control">Confirm Changes</button>
                                    </div>
                                    <ResetImage user={userData} />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </ConfirmContextProvider>
    )
}
export function ResetImage(props) {
    let { isConfirmed } = useConfirm()
    let resetImage = async (e) => {
        e.preventDefault()
        let confirmed = await isConfirmed("Are you sure you want to reset this profile image?")
        if (confirmed) {
            apiResetProfileImage(handleImageReset, { "id": props.user.id })
        }
    }
    let handleImageReset = (response, data) => {
        if (response.status === 200) {
            toast.success(data.message,
                {
                    theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                    progress: undefined,
                }
            )
        }
        else {
            toast.error(data.message,
                {
                    theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                    progress: undefined,
                }
            )
        }
    }
    return (
        <div className="row mb-3">
            <div className="col-sm-3 d-flex align-items-center">
                <h6>Image</h6>
            </div>
            <div className="col-sm-9">
                <button className="form-control" onClick={(e) => resetImage(e)}>Reset</button>
            </div>
        </div>
    )
}
