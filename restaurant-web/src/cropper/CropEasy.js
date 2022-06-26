import React, { useState } from "react";
import { Box, Button, DialogActions, DialogContent, Slider, Typography } from '@mui/material';
import CropIcon from '@mui/icons-material/Crop';
import { Cancel } from '@mui/icons-material';
import Cropper from "react-easy-crop"
export function CropEasy(props) {//As a new react developer learning the frame and python I have to figure out how to implement all types of modals and the use of context
    let [crop, setCrop] = useState({ x: 0, y: 0 })
    let [zoom, setZoom] = useState(1)
    let [rotation, setRotation] = useState(0)
    let [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    let setOpenCrop=null
    
    let cropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }
    console.log("Crop easy")
    let cropImage = async () => {

    }
    return (

        <div>
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
                    image={props.image}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={16/9}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    onCropChange={setCrop}
                    onCropComplete={cropComplete}
                />
            </DialogContent>
            <DialogActions sx={{ flexDirection: "column", mx: 3, my: 2 }}>
                <Box 
                sx={{
                    width:'100%',
                    mb: 1
                }}
                >
                    <Box>
                        <Typography>
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
                        <Typography>
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
                        onClick={() => setOpenCrop('d-none')}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<CropIcon />}
                        onClick={cropImage}
                    >
                        Crop
                    </Button>
                </Box>
            </DialogActions>
        </div>
    )
}
function zoomPercentage(value) {
    return `${Math.round(value * 100)}%`
}