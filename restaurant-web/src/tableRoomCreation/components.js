import React from "react";
import { useEffect, useState } from 'react';
import { Stage, Layer, Rect, RegularPolygon } from "react-konva";
import { ToastContainer, toast } from 'react-toastify';
import { ConfirmContextProvider, ConfirmModal, useConfirm } from "../components";
import { apiCreateTable } from './backEndLookUp'
let apiData = [
    {
        id: 7,
        table_number: 7,
        sides: 8,
        rotation:90,
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
        rotation:0,
        isDraggin: false,
        shape: 'square',
        x: 84.61,
        y: 212.64,
        capacity: 2
    },
    {
        id: 4,
        table_number: 4,
        sides: 4,
        rotation:90,
        isDraggin: false,
        shape: 'rectangle',
        x: 189.96,
        y: 398.43,
        capacity: 4
    },
    {
        id: 3,
        table_number: 3,
        sides: 4,
        rotation:90,
        isDraggin: false,
        shape: 'rectangle',
        x: 380.61,
        y: 398.00,
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
    let [editMode, setEditMode] = useState(false)
    let [isOpen, setIsOpen] = useState(false)
    let [room, setRoom] = useState(null)
    let [newTable, setNewTable] = useState({})
    let parentRef = React.createRef()
    let resizeCanvas = () => {
        // let parent = document.getElementById("canvas-wrapper")
        // let width = parent.offsetWidth
        // setCanvasWidth(width)
    }
    useEffect(() => {
        console.log("Component mounted")
        //let width = parentRef.current.offsetWidth
        let modal = document.getElementById("modal")
        modal.style.zIndex = -1;//send the modal to the background 
        //setCanvasWidth(width)
        window.addEventListener('resize', resizeCanvas)
        //
        let url = window.location.href
        let urlArray = url.split('/')
        let idUrl;
        if (urlArray[urlArray.length - 1] === "") {//Since router does not get rendered by django I will have to use raw urls
            idUrl = urlArray[urlArray.length - 2]
        }
        else {
            idUrl = urlArray[urlArray.length - 1]
        }
        setRoom(idUrl)
        return () => {
            console.log("Component unmounted")
            window.removeEventListener('resize', resizeCanvas)
        }

    }, [])

    let addTable = (entries) => {
        //console.log(entries)
        setNewTable({
            room:room,
            id: entries.table_number,
            table_number: entries.table_number,
            capacity: entries.capacity,
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasWidth / 2,
            sides: entries.sides,
            rotation: entries.rotation,
            shape: entries.shape,
            available:entries.available
        })
    }

    let handleConfirmCreation = () => {
        let table = newTable;
        console.log("The table created is: ", table)
        if (table.x <= 1200 || table.y <= 700 || table.x > 0 || table.y > 0) {
            apiCreateTable(handleTableCreation, table)
        } else {
            toast.error(`There was an error in the table position, try again`,
                {
                    theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                    progress: undefined,
                }
            )
        }
    }

    let handleTableCreation = (response, data) => {
        console.log(response)
        if (response.status === 201) {
            toast.success(data.message,
                {
                    theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                    progress: undefined,
                }
            )
            let final = [...tables].concat(newTable)
            setTables(final)
            setNewTable({})
        }
        else{
            console.log(data)
        }
    }

    let handleDragStart = (e) => {
        let id = e.target.id()
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
                if (table.id === e.target.id()) {//execute only if the ids match or the table being dragged
                    return {
                        ...table,//copy all other attributes from table
                        x: e.target.x(),//update x and y to the new position
                        y: e.target.y(),
                    }
                }
                return {
                    ...table,
                }
            })
        )
    }

    let handleDragEndNew = (e) => {//Here I will set the ending position of the new table and update the state
        let table = newTable
        setNewTable({
            ...table, //copies all attributes of the table
            x: e.target.x(),//modify x and y position 
            y: e.target.y()
        })
    }

    let handleClick = (e) => {
        console.log("The table id clicked is: ", e.target.id())
        console.log("Position: ", e.target.x(), e.target.y())

    }
    let handleFormSubmit = (entries) => {
        //setTableForm(JSON.stringify(entries))//Put the object in the state so it can be used later
        //console.log(entries)
        setIsOpen(false)//close the modal form 
        addTable(entries)
        document.getElementById('cancel-table-creation').style.display = "block"
        document.getElementById('confirm-table-creation').style.display = "block"
    }
    //console.log(tableForm)
    return (
        <div>
            {isOpen && <TableCreationModal setIsOpen={setIsOpen} handleFormSubmit={handleFormSubmit} data={tables} />}
            <div className="container canvas-area">
                <div id="canvas-wrapper" ref={parentRef}>
                    <Stage width={1200} height={700} id="canvas-table-creation">
                        <Layer>
                            {tables.map((shape) => {
                                if (shape.shape === "polygon") {
                                    return (
                                        <RegularPolygon
                                            key={shape.table_number}
                                            id={shape.id.toString()}
                                            sides={parseInt(shape.sides)}
                                            x={shape.x}
                                            y={shape.y}
                                            draggable={editMode}
                                            width={100}
                                            height={150}
                                            fill="blue"
                                            rotation={parseInt(shape.rotation)}
                                            shadowBlur={10}
                                            onDragStart={(e) => handleDragStart(e)}
                                            onDragEnd={(e) => handleDragEnd(e)}
                                            onClick={(e) => handleClick(e)}
                                        />)
                                }
                                else if (shape.shape === "rectangle") {
                                    return (
                                        <Rect
                                            key={shape.table_number}
                                            id={shape.id.toString()}
                                            x={shape.x}
                                            y={shape.y}
                                            draggable={editMode}
                                            width={150}
                                            height={100}
                                            fill="blue"
                                            rotation={parseInt(shape.rotation)}
                                            shadowBlur={10}
                                            onDragStart={(e) => handleDragStart(e)}
                                            onDragEnd={(e) => handleDragEnd(e)}
                                            onClick={(e) => handleClick(e)}
                                        />)
                                }
                                else if (shape.shape === "square") {
                                    return (
                                        <Rect
                                            key={shape.table_number}
                                            id={shape.id.toString()}
                                            x={shape.x}
                                            y={shape.y}
                                            draggable={editMode}
                                            width={100}
                                            height={100}
                                            rotation={parseInt(shape.rotation)}
                                            shadowBlur={10}
                                            fill="blue"
                                            onDragStart={(e) => handleDragStart(e)}
                                            onDragEnd={(e) => handleDragEnd(e)}
                                            onClick={(e) => handleClick(e)}
                                        />)
                                }
                            })}
                            {newTable.shape === "rectangle" ? (
                                <>
                                    <Rect
                                        key={newTable.table_number}
                                        id={newTable.id.toString()}
                                        x={newTable.x}
                                        y={newTable.y}
                                        draggable={true}
                                        width={150}
                                        height={100}
                                        fill="red"
                                        rotation={parseInt(newTable.rotation)}
                                        onDragStart={(e) => handleDragStart(e)}
                                        onDragEnd={(e) => handleDragEndNew(e)}
                                        onClick={(e) => handleClick(e)}
                                    />
                                </>
                            ) : ("")}
                            {newTable.shape === "square" ? (
                                <>
                                    <Rect
                                        key={newTable.table_number}
                                        id={newTable.id.toString()}
                                        x={newTable.x}
                                        y={newTable.y}
                                        draggable={true}
                                        width={100}
                                        height={100}
                                        fill="red"
                                        rotation={parseInt(newTable.rotation)}
                                        onDragStart={(e) => handleDragStart(e)}
                                        onDragEnd={(e) => handleDragEndNew(e)}
                                        onClick={(e) => handleClick(e)}
                                    />
                                </>
                            ) : ("")}
                            {newTable.shape === "polygon" ? (
                                <>
                                    <RegularPolygon
                                        key={newTable.table_number}
                                        id={newTable.id.toString()}
                                        x={newTable.x}
                                        y={newTable.y}
                                        draggable={true}
                                        sides={parseInt(newTable.sides)}
                                        width={100}
                                        height={150}
                                        rotation={parseInt(newTable.rotation)}
                                        fill="red"
                                        onDragStart={(e) => handleDragStart(e)}
                                        onDragEnd={(e) => handleDragEndNew(e)}
                                        onClick={(e) => handleClick(e)}
                                    />
                                </>
                            ) : ("")}
                        </Layer>
                    </Stage>
                </div>
                <button className="btn btn-primary" id="create-table-btn" onClick={() => {
                    setIsOpen(true)
                    document.getElementById("create-table-btn").style.display = "none"
                }}>Create Table</button>
                <div className="button-group">
                    <button className="btn btn-cofirm" type="button" id="confirm-table-creation" style={{ display: "none" }} onClick={() => {
                        document.getElementById('confirm-table-creation').style.display = "none"
                        document.getElementById('cancel-table-creation').style.display = "none"
                        document.getElementById("create-table-btn").style.display = "block"
                        handleConfirmCreation()
                    }}>Confirm</button>
                    <button className="btn btn-danger" type="button" id="cancel-table-creation" style={{ display: "none" }} onClick={() => {
                        console.log("Cancel clicked")
                        setNewTable({})
                        document.getElementById('confirm-table-creation').style.display = "none"
                        document.getElementById('cancel-table-creation').style.display = "none"
                        document.getElementById("create-table-btn").style.display = "block"
                    }}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
function TableCreationModal({ setIsOpen, handleFormSubmit, data }) {
    let [error, setError] = useState({})
    let [shape, setShape] = useState("rectangle")
    useEffect(() => {
        console.log("Form component mounted")
        //form.classList.add('animate__backInDown')
        return () => {

        }
    }, [])
    let handleSubmit = (e) => {//check errors in the front end first that way an instant response is received rather than wait for the server and relieves load from the backend
        e.preventDefault()
        let form = new FormData(e.target)
        let checkbox = document.getElementById("availability-checked")
        let rotation = document.getElementById("rotation-checked")
        let available = document.getElementById("availability-checked")
        if (!checkbox.checked) {
            form.append(checkbox.name, false)
        }
        else {
            form.append(checkbox.name, true)
        }
        if (!rotation.checked) {
            form.append("rotation", 0)
        }
        else {
            form.append("rotation", 90)
        }
        if(!available.checked){
            form.append("available", false)
        }
        else{
            form.append("available", true)
        }
        form.append("shape", shape)
        let entries = Object.fromEntries(form.entries())
        for (let x of data) {//if the same table number is found then this will be checked in the frontend as well as the backend 
            if (x.table_number == entries.table_number) {
                setError({ "table_number": "This table number already exists" })
                return//break the loop and exit the function
            }
        }
        if (entries.capacity > 50 || entries.capacity < 1) {
            setError({ "capacity": "Table capacity is exaggerated" })
            return
        }
        if (entries.sides > 20 || entries.sides < 4) {
            setError({ "sides": "Table sides are unreal" })
            return
        }
        //console.log(entries)
        //if the end of loop is reached it means no error was found 
        handleFormSubmit(entries)
    }
    return (
        <div>
            <div className="" id="table-creation-form-bg" onClick={() => {
                setIsOpen(false)
                document.getElementById("create-table-btn").style.display = "block"
            }}
            ></div>
            <div id="table-creation-form-wrapper">
                <form className="form card-body" id="table-creation-form" onSubmit={(e) => handleSubmit(e)}>
                    <div className="card-title mb-3">
                        <h4>Table Creation Form</h4>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-3 align-items-center d-flex">
                            <h6>Table Number:</h6>
                        </div>
                        <div className="col-md-9">
                            <input type="number" name="table_number" className="form-control" required />
                            <p id="table-form-error">{error.table_number ? (<>{error.table_number}</>) : ("")}</p>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-3 align-items-center d-flex">
                            <h6>Capacity:</h6>
                        </div>
                        <div className="col-md-9">
                            <input type="number" name="capacity" className="form-control" required />
                            <p id="table-form-error">{error.capacity ? (<>{error.capacity}</>) : ("")}</p>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-3 align-items-center d-flex">
                            <h6>Sides:</h6>
                        </div>
                        <div className="col-md-9">
                            <input type="number" name="sides" className="form-control" required />
                            <p id="table-form-error">{error.sides ? (<>{error.sides}</>) : ("")}</p>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-3 align-items-center d-flex">
                            <h6>Available:</h6>
                        </div>
                        <div className="col-md-9 form-switch " >
                            <input type="checkbox" defaultChecked="false" name="available" className="form-check-input" id="availability-checked" />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-3 align-items-center d-flex">
                            <h6>Shape:</h6>
                        </div>
                        <div className="col-md-9 btn-group">
                            <button className="btn btn-primary btn-sm option" type="button" style={{ background: "#1a59b5" }} onClick={(e) => {
                                setShape("rectangle")
                                let buttons = document.querySelectorAll("button.btn.btn-primary.btn-sm.option")
                                buttons.forEach(function (el) {
                                    el.style.background = "#116EFD"
                                })
                                e.target.style.background = "#1a59b5"
                            }}>Rectangle</button>
                            <button className="btn btn-primary btn-sm option" type="button" onClick={(e) => {
                                setShape("square")
                                let buttons = document.querySelectorAll("button.btn.btn-primary.btn-sm.option")
                                buttons.forEach(function (el) {
                                    el.style.background = "#116EFD"
                                })
                                e.target.style.background = "#1a59b5"
                            }}>Square</button>
                            <button className="btn btn-primary btn-sm option" type="button" onClick={(e) => {
                                setShape("polygon")
                                let buttons = document.querySelectorAll("button.btn.btn-primary.btn-sm.option")
                                buttons.forEach(function (el) {
                                    el.style.background = "#116EFD"
                                })
                                e.target.style.background = "#1a59b5"
                            }}>Polygon</button>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-3 align-items-center d-flex">
                            <h6>Rotate 90°:</h6>
                        </div>
                        <div className="col-md-9 form-switch " >
                            <input type="checkbox" defaultChecked="false" name="rotation" className="form-check-input" id="rotation-checked" />
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-md-12 d-flex button-container">
                            <button className="btn btn-primary">Create Table</button>
                            <button onClick={() => {
                                document.getElementById('table-creation-form').animate({ animation: 'backOutUp' })
                                setIsOpen(false)
                                document.getElementById("create-table-btn").style.display = "block"
                            }
                            } type='button' className="btn btn-danger">Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    )
}
