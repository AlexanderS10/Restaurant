import { USER_LOADING, AUTH_ERROR, USER_LOADED, LOGIN_SUCCESS, LOGIN_FAIL } from "../reducers/types";
export function LoadUser(dispatch, getState) {
    console.log(getState)
    dispatch({ type: USER_LOADING })
    let request = new Request(
        'http://127.0.0.1:8000/api/auth/user', {
        method: "GET",
        headers: tokenConfig(getState),
        credentials:'include'
    }
    )
    fetch(request)
        .then(response => response.json().then(data => {
            if (response.status !== 200) {
                console.log("Not authorized")
                dispatch({
                    type: AUTH_ERROR
                })
            } else {
                dispatch({
                    type: USER_LOADED,
                    payload: data
                })
            }
        }))
        .catch(error => {
            alert(error.data)
            dispatch({
                type: AUTH_ERROR
            })
        })
}
export let tokenConfig = (getState) => {
    //get the token from the state
    let token = getState.auth.token
    let headers = new Headers(
        { 'Content-Type': 'application/json' }
    )
    if (token) {
        headers.append("Authorization", `Token ${token}`)
    }
    return headers
}

//LOGIN
export function Login(data, callback) {
    let jsonData;
    let headers = new Headers({ "Content-Type": "application/json" })//initialize the headers
    if (data) {
        jsonData = JSON.stringify(data)
    }
    let request = new Request(
        `http://127.0.0.1:8000/api/auth/login`,
        {
            method: "POST",
            headers: headers,
            credentials:'include',
            body: jsonData
        }
    )
    fetch((request))
        .then(response => response.json().then(data => callback(response, data)))
        .catch((error) => { alert(error) })
}