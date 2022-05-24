import React from "react";
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { ConfirmContextProvider, ConfirmModal, useConfirm } from "../components";
export function TableCreationComponent(){

    return(
        <ConfirmContextProvider>
            <CreateUpdateTables/>
            <ToastContainer/>
        </ConfirmContextProvider>
    )
}
export function CreateUpdateTables(props){
    return(
        <div>
            This is the page to create tables
        </div>
    )
}