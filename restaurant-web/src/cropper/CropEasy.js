import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import * as ReactDOM from 'react-dom';
import { Box, DialogActions, DialogContent, Slider, Typography } from '@mui/material';
import Cropper from "react-easy-crop"
import getCroppedImg from './utils/cropImage'
let CropModalContext = createContext()
export function CropEasyModal(props) {//As a new react developer learning the frame and python I have to figure out how to implement all types of modals and the use of context
    let { setShowModal, showModal } = props
    let { zoom, setZoom, crop, setCrop, rotation, setRotation, onCropComplete, imageSrc, setImageSrc, croppedAreaPixels, setImageSrcCropped, imageSrcCropped,selectedImage,imageName} = useGlobalContext()
    let doneCropHandling = useCallback(async () => {
        try {
            let croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation)
            if(imageSrcCropped.length===0){
                setImageSrcCropped([{id:selectedImage,img:croppedImage, name:imageName},...imageSrcCropped])
            }
            else{
                let temp = [...imageSrcCropped].filter(function(e){
                    return e.id !== selectedImage // if the id of the image is equal to the one being uploaded then this item will not be copied to the temp array of objects
                })
                setImageSrcCropped([...temp, {id:selectedImage,img:croppedImage,name:imageName}])
            }
            
        }
        catch (e) {
            console.log(e)
        }
        setShowModal(false)
        // eslint-disable-next-line
    }, [imageSrc,croppedAreaPixels,rotation])
    let cancelCropHandling = () => {
        let inputField = document.getElementById(`input-${selectedImage}`)
        inputField.value=""
        setShowModal(false)
        setImageSrc([])

    }
    useEffect(() => {
        let cropper = document.getElementById("modal-cropper")
        let bg_cropper = document.getElementById("bg-cropper")
        let modal = document.getElementById("modal")
        if (showModal === true && cropper && bg_cropper) {
            modal.style.zIndex = 1
            cropper.style.display = "block"
            cropper.style.zIndex = 2
            bg_cropper.style.display = "block"
            bg_cropper.style.zIndex = 1
        }
        if (showModal === false && cropper && bg_cropper) {
            //modal.style.display = "none"
            cropper.style.zIndex = 0
            cropper.style.display = "none"
            bg_cropper.style.zIndex = 0
            bg_cropper.style.display = "none"
        }
    }, [showModal])
    let content = showModal && (
        <div>
            <div id="bg-cropper" onClick={() => cancelCropHandling()}>
            </div>
            <div id="modal-cropper" className="position-relative">
                <DialogContent dividers
                    sx={{
                        backgroud: "#333",
                        position: 'relative',
                        height: 400,
                        width: "auto",
                        minWidth: { sm: 500 }
                    }}
                >
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={16 / 9}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                    />
                </DialogContent>
                <DialogActions sx={{ flexDirection: "column", mx: 3, my: 2 }}>
                    <Box
                        sx={{
                            width: '100%',
                            mb: 1
                        }}
                    >
                        <Box>
                            <Typography sx={{ color: "white" }}>
                                Zoom: {zoomPercentage(zoom)}
                            </Typography>
                            <Slider
                                valueLabelDisplay="auto"
                                valueLabelFormat={zoomPercentage}
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e, zoom) => setZoom(zoom)}
                            />
                        </Box>
                        <Box>
                            <Typography sx={{ color: "white" }}>
                                Rotation: {rotation}
                            </Typography>
                            <Slider
                                valueLabelDisplay="auto"
                                min={0}
                                max={360}
                                value={rotation}
                                onChange={(e, rotation) => setRotation(rotation)}
                            />
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        flexWrap: "wrap"
                    }}>
                        <button className="btn btn-danger" onClick={() => cancelCropHandling()}><i className="bi bi-crop"></i> Cancel</button>
                        <button className="btn btn-primary" onClick={() => doneCropHandling()}><i className="bi bi-crop"></i> Crop</button>

                    </Box>
                </DialogActions>
            </div>
        </div>
    )
    return ReactDOM.createPortal(content, document.getElementById("modal"))
}
function zoomPercentage(value) {
    return `${Math.round(value * 100)}%`
}

export function CropModalContextProvider({ children }) {
    //set the state of the modal
    let [showModal, setShowModal] = useState(false)
    //Set the cropper's state here
    let [crop, setCrop] = useState({ x: 0, y: 0 })
    let [zoom, setZoom] = useState(1)
    let [rotation, setRotation] = useState(0)
    let [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    let [imageSrcCropped, setImageSrcCropped] = useState([]);
    let [imageSrc, setImageSrc] = useState([])
    let [selectedImage, setSelectedImage] = useState()
    let [imageName, setImageName] = useState(null)

    let onFileChange = async (e,id) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            
            let imageDataUrl = await readFile(file)
            console.log("Image loaded",file.name)
            setImageName(file.name)
            setSelectedImage(id)
            setImageSrc(imageDataUrl)
            setShowModal(true)
        }
    }
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);
    return (
        <CropModalContext.Provider value={{
            crop,
            setCrop,
            zoom,
            setZoom,
            setCroppedAreaPixels,
            showModal,
            setShowModal,
            setImageSrc,
            setRotation,
            rotation,
            onFileChange,
            onCropComplete,
            croppedAreaPixels,
            imageSrcCropped,
            setImageSrcCropped,
            imageSrc,
            selectedImage,
            setSelectedImage,
            imageName, 
            setImageName
        }
        }>
            {children}
        </CropModalContext.Provider>
    )
}

export function useGlobalContext() {
    return useContext(CropModalContext)
}

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => resolve(reader.result), false)
        reader.readAsDataURL(file)
    })
}