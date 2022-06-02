import React from "react";
import { useEffect, useState } from 'react';
//import { Stage, Layer, Rect, RegularPolygon } from "react-konva";
import { ToastContainer, toast } from 'react-toastify';
import { ConfirmContextProvider, ConfirmModal, useConfirm } from "../components";


export function RoomCreationContainer() {

    return (
        <ConfirmContextProvider>
            <RoomCreation />
            <ToastContainer />
        </ConfirmContextProvider>
    )
}

export function RoomCreation(props) {
    let imageHandler = ()=>{

    }
    return (
        <div>
            <div className="container card col-md-6">
                <div className="card-title">
                    <h4>Create Dinning Area</h4>
                </div>
                <form className="form card-body ">
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <p>Area Name:</p>
                        </div>
                        <div className="col-md-9">
                            <input type='text' placeholder='Room name' className="form-control"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <p>Description:</p>
                        </div>
                        <div className="col-md-9">
                            <textarea placeholder="Description" className="form-control"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <p>Images:</p>
                        </div>
                        <div className="col-md-9">
                            <input type='file' accept="image/*" multiple onChange={()=>imageHandler()}/>
                        </div>
                    </div>
                    
                    
                </form>
            </div>
        </div>
    )
}