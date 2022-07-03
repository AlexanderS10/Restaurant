import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import * as ReactDOM from 'react-dom';
import { Box, Button, DialogActions, DialogContent, Slider, Typography } from '@mui/material';
import CropIcon from '@mui/icons-material/Crop';
import { Cancel } from '@mui/icons-material';
import Cropper from "react-easy-crop"
let CropModalContext = createContext()
export function CropEasyModal(props) {//As a new react developer learning the frame and python I have to figure out how to implement all types of modals and the use of context
    let { setShowModal, showModal } = props
    let { showCroppedImage } = useGlobalContext()
    let { zoom, setZoom, crop, setCrop, rotation, setRotation, onCropComplete, imageSrc, imageSrcCropped } = useGlobalContext()
    let doneCropHandling = () => {
        setShowModal(false)
    }
    let cancelCropHandling = () => {
        setShowModal(false)
    }

    let cropImage = async () => {

    }
    useEffect(() => {
        let cropper = document.getElementById("modal-cropper")
        let bg_cropper = document.getElementById("bg-cropper")
        if (showModal === true && cropper && bg_cropper) {
            cropper.style.display = "block"
            cropper.style.zIndex = 2
            bg_cropper.style.display = "block"
            bg_cropper.style.display=1
        }
        if (showModal === false && cropper && bg_cropper) {
            cropper.style.zIndex = 0
            cropper.style.display = "none"
            bg_cropper.style.display=0
            bg_cropper.style.display = "none"
        }
    }, [showModal])
    let content = showModal && (
        <div>
            <div id="bg-cropper">
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
                            <Typography sx={{color:"white"}}>
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
                            <Typography sx={{color:"white"}}>
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
                        <Button
                            variant="outlined"
                            startIcon={<Cancel />}
                            onClick={() => cancelCropHandling()}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<CropIcon />}
                            onClick={() => doneCropHandling()}
                        >
                            Crop
                        </Button>
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
    const [croppedImage, setCroppedImage] = useState(null);
    let [imageSrc, setImageSrc] = useState([])
    let onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            let imageDataUrl = await readFile(file)
            console.log("Image loaded")
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
            imageSrc
        }
        }>
            {children}
        </CropModalContext.Provider>
    )
}

//establish the hook that will trigger the modal
export function useCropping() {
    let [imageSrc, setImageSrc] = useContext(CropModalContext)
    let [needsCleanup, setNeedsCleanup] = useState(false)
    let cropImageEasy = (imageSrc) => {
        setNeedsCleanup(true)
        let promise = new Promise((resolve, reject) => {
            setImageSrc({
                imageSrc,
                isOpen: true,
                proceed: resolve,
                cancel: reject
            })
        })
        return promise.then(
            () => {
                setImageSrc({ ...imageSrc, isOpen: false })
                return
            }
        )
    }
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