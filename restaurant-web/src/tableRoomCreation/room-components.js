import React from "react";
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { ConfirmContextProvider, ConfirmModal, useConfirm } from "../components";
import { CropEasy } from "../cropper/CropEasy";


export function RoomCreationContainer() {

    return (
        <ConfirmContextProvider>
            
           
            <RoomCreation /> 
            
            <ToastContainer />
        </ConfirmContextProvider>
    )
}

export function RoomCreation(props) {
    let [openCrop, setOpenCrop] = useState('d-none')
    let [imageSrc, setImageSrc] = useState(null)
    let [file, setFile] = useState(null)

    let onFileChange = async(e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            let imageDataUrl = await readFile(file)
      
            // apply rotation if needed
            
            console.log("Image loaded")
            setImageSrc(imageDataUrl)
          }
    }
    let handleForm = (e) => {
        e.preventDefault()
        let form = new FormData(e.target)
        let entries = Object.fromEntries(form.entries())
        console.log(entries)
    }
    return (
        <>
            <div>
                <div className="container card col-md-6">
                    <div className="card-title">
                        <h4>Create Dinning Area</h4>
                    </div>
                    <form className="form card-body" onSubmit={(e) => handleForm(e)} id="room-form">
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <p>Area Name:</p>
                            </div>
                            <div className="col-md-9">
                                <input type='text' placeholder='Room name' className="form-control" name="name" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <p>Description:</p>
                            </div>
                            <div className="col-md-9">
                                <textarea placeholder="Description" className="form-control" name="description" />
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-3">
                                <p>Images:</p>
                            </div>
                            <div className="col-md-9">
                                <input type='file' accept="image/*" onChange={(e) => onFileChange(e)} name="image-1" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <p></p>
                            </div>
                            <div className="col-md-9">
                                <input type='file' accept="image/*" multiple onChange={(e) => onFileChange(e)} name="image-2" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <p></p>
                            </div>
                            <div className="col-md-9">
                                <input type='file' accept="image/*" multiple onChange={() => onFileChange()} name="image-3" />
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
            {imageSrc ?(
                <React.Fragment>
                    <div className={`${openCrop} position-relative`}>
                        <CropEasy image={imageSrc} />
                    </div>
                </React.Fragment>
                
            ):(<div>Nope</div>)}
            
            
        </>
    )
}
function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }