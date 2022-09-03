import React from "react";
import { useEffect, useState } from 'react';
import { Stage, Layer, Rect, RegularPolygon } from "react-konva";
import { ToastContainer, toast } from 'react-toastify';
import { ConfirmContextProvider, ConfirmModal, useConfirm } from "../components";
import { apiCreateTable, apiGetTables, apiUpdateTableList} from './backEndLookUp'
export function TableCreationComponent() {

    return (
        <ConfirmContextProvider>
            <CreateUpdateTables />
            <ToastContainer />
        </ConfirmContextProvider>
    )
}
export function CreateUpdateTables(props) {
    let [tables, setTables] = useState([])
    let [editMode, setEditMode] = useState(false)
    let [isOpen, setIsOpen] = useState(false)
    let [room, setRoom] = useState(null)
    let [newTable, setNewTable] = useState({})
    let [modifiedTables, setModifiedTables] = useState([])
    let parentRef = React.createRef()

    useEffect(() => {

        let modal = document.getElementById("modal")
        modal.style.zIndex = -1;//send the modal to the background 
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
        let fetchTables = (response, data) => {
            console.log(data, response)
            if (response.status === 200) {
                setTables(data)
            }
            else {
                toast.error(`There was an error fetching the data`,
                    {
                        theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                        progress: undefined,
                    }
                )
            }
        }
        apiGetTables(fetchTables, idUrl)

        return () => {

        }
    }, [])

    let addTable = (entries) => {
        setNewTable({
            room: room,
            id: entries.table_number,
            table_number: entries.table_number,
            capacity: entries.capacity,
            x: parseFloat((Math.random() * (1100 - 100) + 100).toFixed(3)),
            y: parseFloat((Math.random() * (600 - 100) + 100).toFixed(3)),
            sides: entries.sides,
            rotation: entries.rotation,
            shape: entries.shape,
            available: entries.available
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
        else {
            toast.success(data.message,
                {
                    theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                    progress: undefined,
                }
            )
        }
    }

    let handleDragStart = (e) => {
        let id = e.target.id()
        setTables(
            tables.map((table) => {
                return {
                    ...table,
                }
            })
        )
    }

    let handleDragEnd = (e) => {
        console.log("Finished drag=>", `(${e.target.x()},${e.target.y()})`)
        setTables(
            tables.map((table) => {
                if (parseInt(table.id) === parseInt(e.target.id())) {//execute only if the ids match or the table being dragged
                    return {
                        ...table,//copy all other attributes from table
                        x: parseFloat((e.target.x()).toFixed(3)),//update x and y to the new position
                        y: parseFloat((e.target.y()).toFixed(3)),
                    }
                }
                return {
                    ...table,
                }
            })
        )
        if(modifiedTables.length===0){//Here I will record all the tables that have changed so I do not have to send all the tables but just the ones that have changed
            setModifiedTables([...modifiedTables].concat(e.target.id()))
        }
        else{
            let exists = false
            for (let x of modifiedTables){
                if (x===e.target.id()){
                    exists=true
                }
                else{
                    continue
                }
            }
            if (!exists){
                setModifiedTables([...modifiedTables].concat(e.target.id()))
            }
            
        }
    }

    let handleDragEndNew = (e) => {//Here I will set the ending position of the new table and update the state
        let table = newTable
        setNewTable({
            ...table, //copies all attributes of the table
            x: parseFloat((e.target.x()).toFixed(3)),//update x and y to the new position
            y: parseFloat((e.target.y()).toFixed(3)),
        })
    }

    let handleClick = (e) => {
        console.log("The table id clicked is: ", e.target.id())
        console.log("Position: ", parseFloat((e.target.x()).toFixed(3)), e.target.y())

    }

    let handleFormSubmit = (entries) => {
        setIsOpen(false)//close the modal form 
        addTable(entries)
        document.getElementById('cancel-table-creation').style.display = "block"
        document.getElementById('confirm-table-creation').style.display = "block"
    }

    let updateTablePositions = ()=>{//update the new positions of the tables = > record the tables that changed and send those as a list
        let final = []
        for (let x of modifiedTables){
            for(let j of tables){
                if(parseInt(x)===parseInt(j.id)){
                    final.push({id:j.id, x:j.x, y:j.y})
                    break//breaks the current loop so it does not finish looking the rest of the array after it found the element
                }
                else{
                    continue
                }
            }
        }
        final.push({id:50, x:123.22, y:234.00})
        final.push({id:51, x:123.22, y:234.00})
        console.log("The tables that changed are:", JSON.stringify(final))
        let handleListUpdate = (response,data)=>{
            setModifiedTables([])
            console.log(data, response)
            if (response.status===400){
                for(let x of data){//Go through the data received and show the errors to the users
                    toast.error(x.message,
                        {
                            theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                            progress: undefined,
                        }
                    )
                }
            }
            else if (response.status===200){
                toast.success(data.message,
                    {
                        theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                        progress: undefined,
                    }
                )
            }
            else{
                toast.error("Unknown error has occurred",
                    {
                        theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                        progress: undefined,
                    }
                )
            }
        }
        if (final.length!==0){//make api call only if there were changes and that way spam is avoided
            apiUpdateTableList(handleListUpdate, final)
        }
        
    }

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
                                            x={parseFloat(shape.x)}
                                            y={parseFloat(shape.y)}
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
                                            x={parseFloat(shape.x)}
                                            y={parseFloat(shape.y)}
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
                                            x={parseFloat(shape.x)}
                                            y={parseFloat(shape.y)}
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
                                else {
                                    return ("")
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
            </div>
            <div className="container">
                <div className="d-flex edit-btns">
                    <button className="btn btn-primary" id="create-table-btn" onClick={() => {
                        setIsOpen(true)
                        document.getElementById("create-table-btn").style.display = "none"
                        document.getElementById("edit-tables-btn").style.display = "none"
                    }}>Create Table</button>
                    <button className="btn btn-primary" id="edit-tables-btn" onClick={()=>{
                        setEditMode(true)
                        document.getElementById("create-table-btn").style.display = "none"
                        document.getElementById("edit-tables-btn").style.display = "none"
                        document.getElementById("done-table-edits").style.display = "block"
                    }}>Edit Tables</button>
                </div>
                <div className="d-flex justify-content-center" >
                    <button className="btn btn-success" id="done-table-edits" style={{display:"none"}} onClick={()=>{
                        document.getElementById("create-table-btn").style.display = "block"
                        document.getElementById("edit-tables-btn").style.display = "block"
                        document.getElementById("done-table-edits").style.display = "none"
                        setEditMode(false)
                        updateTablePositions()
                    }}>Done <i className="bi bi-check2"></i></button>
                </div>
                <div className="button-group">
                    <button className="btn btn-cofirm" type="button" id="confirm-table-creation" style={{ display: "none" }} onClick={() => {
                        document.getElementById('confirm-table-creation').style.display = "none"
                        document.getElementById('cancel-table-creation').style.display = "none"
                        document.getElementById("create-table-btn").style.display = "block"
                        document.getElementById("edit-tables-btn").style.display = "block"
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
        if (!available.checked) {
            form.append("available", false)
        }
        else {
            form.append("available", true)
        }
        form.append("shape", shape)
        let entries = Object.fromEntries(form.entries())
        for (let x of data) {//if the same table number is found then this will be checked in the frontend as well as the backend 
            if (parseInt(x.table_number) === parseInt(entries.table_number)) {
                setError({ "table_number": "This table number already exists" })
                return//break the loop and exit the function
            }
        }
        if(entries.table_number>500){
            setError({"table_number":"Table number is too high"})
            return
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
                document.getElementById("edit-tables-btn").style.display = "block"
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
                            <button className="btn btn-primary" onClick={()=>{
                            }}>Create Table</button>
                            <button onClick={() => {
                                document.getElementById('table-creation-form').animate({ animation: 'backOutUp' })
                                setIsOpen(false)
                                document.getElementById("create-table-btn").style.display = "block"
                                document.getElementById("edit-tables-btn").style.display = "block"
                            }
                            } type='button' className="btn btn-danger">Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    )
}
