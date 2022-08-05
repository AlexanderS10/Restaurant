import React from "react";
import { useEffect, useState } from 'react';
import { Stage, Layer, Rect, RegularPolygon } from "react-konva";
import { ToastContainer, toast } from 'react-toastify';
import { ConfirmContextProvider, ConfirmModal, useConfirm } from "../components";
let apiData = [
    {
        id: 7,
        table_number: 7,
        sides: 8,
        isDraggin: false,
        shape: 'polygon',
        x: 284.22,
        y: 86.34,
        capacity: 8
    },
    {
        id: 6,
        table_number: 6,
        sides: 4,
        isDraggin: false,
        shape: 'rectangle',
        x: 84.61,
        y: 212.64,
        capacity: 2
    },
    {
        id: 4,
        table_number: 4,
        sides: 4,
        isDraggin: false,
        shape: 'rectangle',
        x: 73.96,
        y: 433.43,
        capacity: 4
    },
    {
        id: 3,
        table_number: 3,
        sides: 4,
        isDraggin: false,
        shape: 'rectangle',
        x: 269.61,
        y: 541.00,
        capacity: 6
    }
]
export function TableCreationComponent() {

    return (
        <ConfirmContextProvider>
            <CreateUpdateTables />
            <ToastContainer />
        </ConfirmContextProvider>
    )
}
export function CreateUpdateTables(props) {
    let [canvasWidth, setCanvasWidth] = useState(300)
    let [tables, setTables] = useState(apiData)
    let [editMode, setEditMode] = useState(true)
    let [isOpen, setIsOpen] = useState(false)
    let [tableForm, setTableForm] = useState({})
    let parentRef = React.createRef()
    let table_button = document.getElementById("create-table-btn")
    let resizeCanvas = () => {
        // let parent = document.getElementById("canvas-wrapper")
        // let width = parent.offsetWidth
        // setCanvasWidth(width)
    }
    useEffect(() => {
        console.log("Component mounted")
        let width = parentRef.current.offsetWidth
        let modal = document.getElementById("modal")
        modal.style.zIndex = -1;//send the modal to the background 
        //setCanvasWidth(width)
        window.addEventListener('resize', resizeCanvas)
        return () => {
            console.log("Component unmounted")
            window.removeEventListener('resize', resizeCanvas)
        }

    }, [])

    let addTable = (e) => {
        //console.log("Button is clicked")
        let final = [...tables].concat({
            id: Math.floor(Math.random() * 1000).toString(),
            table_number: Math.floor(Math.random() * 1000).toString(),
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasWidth / 2,
            sides: 4,
            isDraggin: false
        })
        //console.log(final)

        setTables(final)
    }

    let handleDragStart = (e) => {
        let id = e.target.id()
        console.log(id)
        setTables(
            tables.map((table) => {
                return {
                    ...table,
                    isDraggin: table.id === id
                }
            })
        )
    }
    let handleDragEnd = (e) => {
        //console.log("Finished drag=>", `(${e.target.x()},${e.target.y()})`)
        setTables(
            tables.map((table) => {
                if (table.id === e.target.id()) {//execute only if the ids match
                    return {
                        ...table,//copy all other attributes from table
                        x: e.target.x(),//update x and y to the new position
                        y: e.target.y(),
                        isDraggin: false
                    }
                }
                return {
                    ...table,
                    isDraggin: false
                }
            })
        )
    }
    let handleClick = (e) => {
        console.log("The table id clicked is: ", e.target.id())
    }
    let handleFormSubmit = (e) => {
        e.preventDefault()
        let form = new FormData(e.target)
        setTableForm(JSON.stringify(Object.fromEntries(form.entries())))//Put the object in the state so it can be used later
        setIsOpen(false)//close the modal form 
        addTable(e)
        document.getElementById('cancel-table-creation').style.display = "block"
        document.getElementById('confirm-table-creation').style.display = "block"
    }
    //console.log(tableForm)
    return (
        <div>
            {isOpen && <TableCreationModal setIsOpen={setIsOpen} handleFormSubmit={handleFormSubmit} setTableForm={setTableForm} data={tables} />}
            <div className="container canvas-area">
                <div id="canvas-wrapper" ref={parentRef}>
                    <Stage width={1000} height={600} id="canvas-table-creation">
                        <Layer>
                            {tables.map((shape) => {
                                if (shape.capacity > 2) {
                                    return (
                                        <RegularPolygon
                                            key={shape.table_number}
                                            id={shape.id.toString()}
                                            sides={shape.sides}
                                            x={shape.x}
                                            y={shape.y}
                                            draggable={editMode}
                                            width={100}
                                            height={150}
                                            fill="blue"
                                            rotation={45}
                                            onDragStart={(e) => handleDragStart(e)}
                                            onDragEnd={(e) => handleDragEnd(e)}
                                            onClick={(e) => handleClick(e)}
                                        />)
                                }
                                else {
                                    return (
                                        <RegularPolygon
                                            key={shape.table_number}
                                            id={shape.id.toString()}
                                            sides={shape.sides}
                                            x={shape.x}
                                            y={shape.y}
                                            draggable={editMode}
                                            width={100}
                                            height={100}
                                            fill="blue"
                                            rotation={45}
                                            onDragStart={(e) => handleDragStart(e)}
                                            onDragEnd={(e) => handleDragEnd(e)}
                                            onClick={(e) => handleClick(e)}
                                        />)
                                }
                            })}
                        </Layer>
                    </Stage>
                </div>
                <button className="btn btn-primary" id="create-table-btn" onClick={() => {
                    setIsOpen(true)
                    //document.getElementById("create-table-btn").style.display = "none"
                }}>Create Table</button>
                <div className="button-group">
                    <button className="btn btn-cofirm" type="button" id="confirm-table-creation" style={{ display: "none" }}>Confirm</button>
                    <button className="btn btn-danger" type="button" id="cancel-table-creation" style={{ display: "none" }}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
function TableCreationModal({ setIsOpen, handleFormSubmit, data }) {
    useEffect(() => {
        console.log("Form component mounted")
        let form = document.getElementById('table-creation-form')
        //form.classList.add('animate__backInDown')
        return () => {

        }
    }, [])
    let [error, setError] = useState({})
    let handleSubmit = (e) => {
        e.preventDefault()
        let form = new FormData(e.target)
        let entries = Object.fromEntries(form.entries())
        console.log("The table number input:", entries.table_number)
        for (let x of data) {//if the same table number is found then this will be checked in the frontend as well as the backend 
            console.log(x.table_number)
            if (x.table_number == entries.table_number) {
                console.log("The table number exits")
                setError({ "table_number": "This table number already exists" })
                return//break the loop and exit the function
            }
        }
        console.log("End of the loop was reached ")
    }
    return (
        <div>
            <div className="card col-md-6" id="table-creation-form-bg" onClick={() => setIsOpen(false)}></div>
            <div id="table-creation-form-wrapper">
                <form className="form card-body" id="table-creation-form" onSubmit={(e) => handleSubmit(e)}>
                    <div className="card-title">
                        <h4>Table Creation Form</h4>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-3 align-items-center d-flex">
                            <h6>Table Number</h6>
                        </div>
                        <div className="col-md-9">
                            <input type="number" name="table_number" className="form-control" required />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-3 align-items-center d-flex">
                            <h6>Capacity</h6>
                        </div>
                        <div className="col-md-9">
                            <input type="number" name="capacity" className="form-control" required />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-3 align-items-center d-flex">
                            <h6>Sides</h6>
                        </div>
                        <div className="col-md-9">
                            <input type="number" name="sides" className="form-control" required />
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-md-12 d-flex button-container">
                            <button className="btn btn-primary">Create Table</button>
                            <button onClick={() => {
                                document.getElementById('table-creation-form').animate({animation:'backOutUp'})
                                //setIsOpen(false)
                            }
                            } type='button' className="btn btn-danger">Cancel</button>
                        </div>

                    </div>
                </form>
            </div>
        </div>

    )
}
