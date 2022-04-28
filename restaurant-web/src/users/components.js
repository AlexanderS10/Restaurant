import React from "react";
import { useEffect, useState } from 'react';
import { searchlookup, lookup } from "../api_lookup";
import { ToastContainer, toast } from 'react-toastify';
export function UsersSearch(){
    useEffect(()=>{
        let data =  {
            "email": "imanraja@rest.com",
            "first_name": "Iman",
            "last_name": "Raja",
            "phone_number": "+15168496366"
        }
        searchlookup("GET","users/",searchusers)
        //lookup("GET","users/",searchusers)
    },[])
    let searchusers = (response, data)=>{
        console.log(data)
    }
    return(
        <div>
            <ToastContainer />
            <h1>This is the set for the user search</h1>
        </div>
    )
}