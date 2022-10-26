import React from "react";
import {Navigate} from "react-router-dom"
import {useSelector } from 'react-redux'
let PrivateRoute = ({children, ...rest})=>{
    const auth = useSelector((state)=>state.auth)
    console.log(auth)
    if(auth.isLoading){
        return <h2>Loading...</h2>
    }
    else if(auth.isAuthenticated===false && auth.isLoading===false){
        return <Navigate to="/login"/>
    }
    else{
        return children
    }
    
}

export default PrivateRoute
