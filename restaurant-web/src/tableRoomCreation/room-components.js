import React from "react";
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { ConfirmContextProvider, ConfirmModal, useConfirm } from "../components";
import { CropEasyModal, CropModalContextProvider, useGlobalContext } from "../cropper/CropEasy"
import { apiAddImages, apiCreateRoom } from "./backEndLookUp";
export function RoomCreationContainer() {
    return (
        <ConfirmContextProvider>
            <CropModalContextProvider>
                <RoomCreation />
            </CropModalContextProvider>
            <ToastContainer />
        </ConfirmContextProvider>
    )
}

export function RoomCreation(props) {
    let id = null
    let modal = document.getElementById("modal")
    let { onFileChange, imageSrcCropped, selectedImage } = useGlobalContext()
    let { showModal, setShowModal } = useGlobalContext();
    if (showModal === false) {//set up the index for the initial render of the component 
        modal.style.zIndex = -1
    } else {
        modal.style.zIndex = 1
    }

    let handleForm = async (e) => {
        e.preventDefault()
        let form = new FormData(e.target)
        let formData = new FormData()
        let entries = Object.fromEntries(form.entries())
        formData.append("name", entries.name)
        formData.append("description", entries.description)
        let formDataInfo = Object.fromEntries(formData.entries())
        apiCreateRoom(handleSubmit, formDataInfo)
    }
    let handleSubmit = (response, data) => {
        console.log(response)
        if (response.status === 201) {//If the room is created successfuly and data will be sent back by which the images will be sent 
            // id = toast.loading("Room Created, Uploading Images...",//create loading bar which will be resolved when the images are successfully uploaded
            //     {
            //         theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
            //         progress: undefined,
            //     })
            let roomId = 2 //data.id//The way to recognize the room that the imges will be associated to is by getting the id of the object returned from the back end 
            let k = 0
            for(let i of imageSrcCropped){//loop through all the images in the state and then append them to the form that will be sent later on 
                //console.log(i)
                let formImages = new FormData()
                formImages.append(`image${k}`,await fetch(i.img).then(r => r.blob()),i.name)
                formImages.append('room_id', roomId)
                
                k+=1
            }
            
        } else {
            toast.error(data.message,
                {
                    theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                    progress: undefined,
                }
            )
        }
    }
    return (
        <>
            <CropEasyModal setShowModal={setShowModal} showModal={showModal} />
            <div>
                <div className="container card col-md-6" id="create-dinning-card">
                    <div className="card-title">
                        <h4>Create Dinning Area</h4>
                    </div>
                    <form className="form card-body" onSubmit={(e) => handleForm(e)} id="room-form" encType="multipart/form-data">
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <p>Area Name:</p>
                            </div>
                            <div className="col-md-9">
                                <input type='text' placeholder='Room name' className="form-control" name="name" required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <p>Description:</p>
                            </div>
                            <div className="col-md-9">
                                <textarea placeholder="Description" className="form-control" name="description" required />
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-3">
                                <p>Images:</p>
                            </div>
                            <div className="col-md-9">
                                <input type='file' accept="image/*" onChange={(e) => onFileChange(e, 0)} name="image-1" id="input-0" required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <p></p>
                            </div>
                            <div className="col-md-9">
                                <input type='file' accept="image/*" multiple onChange={(e) => onFileChange(e, 1)} name="image-2" id="input-1" required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <p></p>
                            </div>
                            <div className="col-md-9">
                                <input type='file' accept="image/*" multiple onChange={(e) => onFileChange(e, 2)} name="image-3" id="input-2" required />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="d-flex justify-content-center">
                                <button className="btn btn-primary">Create</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {imageSrcCropped.length !== 0 ? (
                <div className="container cropped-images">
                    <div className="row">
                        {imageSrcCropped.map((item) => {
                            return (
                                <div className="col-md-4 mt-4" key={item.id}>
                                    <img id="image-holder" src={item.img} alt="Cropped" />
                                </div>)
                        })}
                    </div>
                </div>
            ) : (
                <div></div>
            )
            }
        </>
    )
}
