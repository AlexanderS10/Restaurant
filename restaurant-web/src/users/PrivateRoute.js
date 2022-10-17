import React from "react";
import {Navigate} from "react-router-dom"
import {connect} from "react-redux"
import {useSelector } from 'react-redux'
let PrivateRoute = ({children, ...rest})=>{
    const auth = useSelector((state)=>state.auth)
    if(auth.isLoading){
        return <h2>Loading...</h2>
    }
    else if(!auth.isAuthenticated){
        console.log(auth)
        return <Navigate to="/login"/>
    }
    else{
        console.log(auth)
        return children
    }
    
}

export default PrivateRoute
