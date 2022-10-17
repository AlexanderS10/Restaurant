import {USER_LOADING,USER_LOADED ,AUTH_ERROR, LOGIN_FAIL, LOGIN_SUCCESS } from './types'
const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: false,
    user:null
}

export default function auth(state = initialState, action){
    switch(action.type){
        case USER_LOADING:
            return{
                ...state,
                isLoading:true
            }
        case USER_LOADED:
            return{
                ...state,
                isAuthenticated:true,
                isLoading:false,
                user:action.payload
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token)
            return{
                ...state, 
                ...action.payload,
                isAuthenticated:true,
                isLoading:false
            }
        case AUTH_ERROR:
            return{
                ...state,
                token:null,
                user:null,
                isAuthenticated:false,
                isLoading:false
            }
        case LOGIN_FAIL:
            return{
                ...state,
                token:null,
                user:null,
                isAuthenticated:false,
                isLoading:false
            }
        default:
            return state;
    }
}