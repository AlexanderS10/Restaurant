import React from "react";
import { useEffect, useState } from 'react';
import { Stage, Layer, Rect, RegularPolygon, Group, Text } from "react-konva";
import { ToastContainer, toast } from 'react-toastify';
import { ConfirmContextProvider, ConfirmModal, useConfirm } from "../components";
import { apiCreateTable, apiGetTables, apiUpdateTableList, apiDeleteTable } from './backEndLookUp'
export function TableCreationComponent() {
    return (
        <ConfirmContextProvider>
            <CreateUpdateTables />
            <ToastContainer />
            <ConfirmModal />
        </ConfirmContextProvider>
    )
}
export function CreateUpdateTables() {
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
        let fetchTables = (response, data) => {
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
        apiGetTables(fetchTables, getRoom())
        return () => {
        }
    }, [])
    let getRoom = () => {
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
        return idUrl
    }

    let addTable = (entries) => {
        setNewTable({
            room: room,
            id: entries.table_number,
            table_number: entries.table_number,
            capacity: entries.capacity,
            x: parseFloat((Math.random() * (1200 - 100) + 100).toFixed(3)),
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

        if ((parseInt(table.rotation) === 90 && table.x > 1300) || (parseInt(table.rotation) === 0 && table.x > 1200) || (parseInt(table.rotation) === 0 && table.x < 0) || (parseInt(table.rotation) === 90 && table.x < 100) || (table.y > 600) || (table.y < 0)) {
            toast.error(`There was an error in the table position, try again`,
                {
                    theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                    progress: undefined,
                }
            )
            setNewTable({})
        } else {
            apiCreateTable(handleTableCreation, table)
        }
    }

    let handleTableCreation = (response, data) => {
        console.log(response, data)
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
            setNewTable({})
            toast.error(data.message,
                {
                    theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                    progress: undefined,
                }
            )
        }
    }

    let handleDragStart = (e) => {
        setTables(
            tables.map((table) => {
                return {
                    ...table,
                }
            })
        )
    }

    let handleDragEnd = (e) => {
        // console.log("Finished drag=>", `(${e.target.x()},${e.target.y()})`)
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
        if (modifiedTables.length === 0) {//Here I will record all the tables that have changed so I do not have to send all the tables but just the ones that have changed
            setModifiedTables([...modifiedTables].concat(e.target.id()))
        }
        else {
            let exists = false
            for (let x of modifiedTables) {
                if (x === e.target.id()) {
                    exists = true
                }
                else {
                    continue
                }
            }
            if (!exists) {
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

    let updateTablePositions = () => {//update the new positions of the tables = > record the tables that changed and send those as a list
        let final = []
        for (let x of modifiedTables) {
            for (let j of tables) {
                if (parseInt(x) === parseInt(j.id)) {
                    final.push({ id: j.id, x: j.x, y: j.y, rotation: j.rotation })
                    break//breaks the current loop so it does not finish looking the rest of the array after it found the element
                }
                else {
                    continue
                }
            }
        }
        //console.log("The tables that changed are:", JSON.stringify(final))
        let handleListUpdate = (response, data) => {
            setModifiedTables([])
            console.log(data, response)
            if (response.status === 400) {
                for (let x of data) {//Go through the data received and show the errors to the users
                    toast.error(x.message,
                        {
                            theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                            progress: undefined,
                        }
                    )
                }
            }
            else if (response.status === 200) {
                toast.success(data.message,
                    {
                        theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                        progress: undefined,
                    }
                )
            }
            else {
                toast.error("Unknown error has occurred",
                    {
                        theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                        progress: undefined,
                    }
                )
            }
        }
        if (final.length !== 0) {//make api call only if there were changes and that way spam is avoided
            apiUpdateTableList(handleListUpdate, final)
        }
        else{
            console.log("List is empty")
        }
        

    }
    let { isConfirmed } = useConfirm()
    let handleDelete = async (e, index, table_number) => {
        e.preventDefault()
        let confirm = await isConfirmed(`Are you sure you want to delete table ${table_number}?`)
        if (confirm) {
            let handleDeleteFrontend = (response, data) => {
                if (response.status === 202) {
                    toast.success(data.message,
                        {
                            theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                            progress: undefined,
                        }
                    )
                    let array = [...tables]
                    array.splice(index, 1)
                    setTables(array)
                }
                else {
                    toast.error(data.message,
                        {
                            theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                            progress: undefined,
                        }
                    )
                }
                console.log(response)
            }
            apiDeleteTable(handleDeleteFrontend, { "table_number": table_number })
        } else {
            console.log("Naaaa")
        }

    }

    return (
        <div className="table-window-wrapper">
            {isOpen && <TableCreationModal setIsOpen={setIsOpen} handleFormSubmit={handleFormSubmit} data={tables} />}
            <div className="container canvas-area">
                <div id="canvas-wrapper" ref={parentRef}>
                    <Stage width={1300} height={700} id="canvas-table-creation">
                        <Layer>
                            {tables.map((shape) => {
                                if (shape.shape === "polygon") {
                                    return (
                                        <Group
                                            id={shape.id.toString()}
                                            key={shape.table_number}
                                            x={parseFloat(shape.x)}
                                            y={parseFloat(shape.y)}
                                            draggable={editMode}
                                            onDragStart={(e) => handleDragStart(e)}
                                            onDragEnd={(e) => handleDragEnd(e)}
                                            onClick={(e) => handleClick(e)}>
                                            <RegularPolygon
                                                sides={parseInt(shape.sides)}
                                                width={150}
                                                height={150}
                                                fill="blue"
                                                rotation={parseInt(shape.rotation)}
                                                shadowBlur={10}
                                            />
                                            <Text
                                                x={shape.table_number.toString().length < 2 ? -5 : -10}
                                                y={-8}
                                                text={shape.table_number}
                                                align="center"

                                                fontSize={20}
                                            />
                                        </Group>)
                                }
                                else if (shape.shape === "rectangle") {
                                    return (
                                        <Group
                                            key={shape.table_number}
                                            id={shape.id.toString()}
                                            x={parseFloat(shape.x)}
                                            y={parseFloat(shape.y)}
                                            draggable={editMode}
                                            onDragStart={(e) => handleDragStart(e)}
                                            onDragEnd={(e) => handleDragEnd(e)}
                                            onClick={(e) => handleClick(e)}
                                            width={150}
                                            height={100}>

                                            <Rect
                                                width={150}
                                                height={100}
                                                fill="blue"
                                                rotation={parseInt(shape.rotation)}
                                                shadowBlur={10}
                                            />
                                            <Text
                                                x={parseInt(shape.rotation) === 0 ? 0 : shape.table_number.toString().length < 2 ? -59 : -60}
                                                y={parseInt(shape.rotation) === 0 ? 0 : shape.table_number.toString().length < 2 ? 75 : 75}
                                                verticalAlign="middle"
                                                text={shape.table_number}
                                                fontSize={20}
                                                align="center"
                                                width={parseInt(shape.rotation) === 0 ? 150 : 24}
                                                height={parseInt(shape.rotation) === 0 ? 100 : 0}
                                            />
                                        </Group>)
                                }
                                else if (shape.shape === "square") {
                                    return (
                                        <Group
                                            key={shape.table_number}
                                            id={shape.id.toString()}
                                            x={parseFloat(shape.x)}
                                            y={parseFloat(shape.y)}
                                            draggable={editMode}
                                            onDragStart={(e) => handleDragStart(e)}
                                            onDragEnd={(e) => handleDragEnd(e)}
                                            onClick={(e) => handleClick(e)}>
                                            <Rect
                                                width={100}
                                                height={100}
                                                rotation={parseInt(shape.rotation)}
                                                shadowBlur={10}
                                                fill="blue"
                                                onDragStart={(e) => handleDragStart(e)}
                                                onDragEnd={(e) => handleDragEnd(e)}
                                                onClick={(e) => handleClick(e)}
                                            />
                                            <Text
                                                x={parseInt(shape.rotation) === 0 ? 0 : shape.table_number.toString().length < 2 ? -60 : -60}
                                                y={parseInt(shape.rotation) === 0 ? 0 : 50}
                                                text={shape.table_number}
                                                fontSize={20}
                                                width={parseInt(shape.rotation) === 0 ? 100 : 24}
                                                height={parseInt(shape.rotation) === 0 ? 100 : 0}
                                                align="center"
                                                verticalAlign="middle"
                                            />
                                        </Group>)
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
                    <button className="btn btn-primary" id="edit-tables-btn" onClick={() => {
                        setEditMode(true)
                        document.getElementById("create-table-btn").style.display = "none"
                        document.getElementById("edit-tables-btn").style.display = "none"
                        document.getElementById("done-table-edits").style.display = "block"
                    }}>Edit Tables</button>
                </div>
                <div className="d-flex justify-content-center" >
                    <button className="btn btn-success" id="done-table-edits" style={{ display: "none" }} onClick={() => {
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
                        document.getElementById("edit-tables-btn").style.display = "block"
                    }}>Cancel</button>
                </div>
            </div>
            <TableList tables={tables} setTables={setTables} handleDelete={handleDelete} />
        </div>
    )
}
function TableList(props) {
    //console.log(props.tables)
    let handleInputChange = (index, table_number) => {
        console.log(index)
        document.getElementById(`confirm-${table_number}`).style.display = "block"
    }

    let handleConfirm = (e, index, table_number) => {
        let entries = document.querySelectorAll(`.table-input-${table_number}`)//here we get all the value that correspond to the table number 
        let data = {"table_number":table_number}
        let error = []
        for (let i of entries) {//iterate through the data and validate 
            if (i.id === "checkbox-rotation") {
                if (i.checked) {
                    data['available'] = true
                }
                else {
                    data['available'] = false
                }
            }
            else if (i.name === "capacity" && (i.value <= 0 || i.value > 50)) {
                error.push("The capacity is not within parameters")
                break
            }
            else if (i.name === "sides" && (i.value < 4 || i.value > 20)) {
                error.push("The sides are not within parameters")
                break
            }
            else {
                data[`${i.name}`] = i.value
            }

        }
        if (error.length !== 0) {
            toast.error(error[0],
                {
                    theme: "colored", closeButton: false, position: "bottom-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                    progress: undefined,
                }
            )
        }
        else {
            document.getElementById(`confirm-${table_number}`).style.display = "none"
            let handleTableUpdate = (response, data_response)=>{
                console.log(data_response)
                if (response.status===202){
                    toast.success(data_response.message,
                        {
                            theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                            progress: undefined,
                        }
                    )
                    props.setTables(
                        props.tables.map((table)=>{
                            if(table.table_number===parseInt(table_number)){
                                return{
                                    ...table,
                                    available:data.available,
                                    rotation:data.rotation,
                                    capacity:data.capacity,
                                    sides:data.sides,
                                    shape:data.shape
                                }
                            }
                            else{
                                return{
                                    ...table
                                }
                            }
                        })
                    )

                }else{
                    toast.error(data_response.message,
                        {
                            theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                            progress: undefined,
                        }
                    )
                }
            }
            apiUpdateTableList(handleTableUpdate, data)
        }
    }
    return (
        <div className="container mt-5 mb-5" id="table-list-wrapper">
            <table className="" style={{ width: "100%" }} id="tables-list">
                <thead>
                    <tr>
                        <th>Table</th>
                        <th>Available</th>
                        <th>Rotation</th>
                        <th>Capacity</th>
                        <th>Sides</th>
                        <th>Shape</th>
                        <th>Delete/Confirm</th>
                    </tr>
                </thead>
                <tbody>
                    {props.tables.map((table, index) => {
                        return (
                            <tr key={table.table_number} >
                                <td>{table.table_number}</td>
                                <td className={`form-switch d-flex`}><input type="checkbox" className={`form-check-input table-input-${table.table_number}`} id="checkbox-rotation" defaultChecked={table.available} defaultValue={table.available} onChange={() => handleInputChange(index, table.table_number)} /></td>
                                <td><select name="rotation" className={`table-input-${table.table_number} form-select`} onChange={() => handleInputChange(index, table.table_number)} defaultValue={table.rotation}>
                                    <option value={0}>0</option>
                                    <option value={90}>90</option>
                                </select></td>
                                <td><input type="number" className={`table-input-${table.table_number} form-control`} name="capacity" defaultValue={table.capacity} onChange={() => handleInputChange(index, table.table_number)} /></td>
                                <td><input type="number" className={`table-input-${table.table_number} form-control`} name="sides" defaultValue={table.sides} onChange={() => handleInputChange(index, table.table_number)} /></td>
                                <td><select className={`table-input-${table.table_number} form-select`} name="shape" defaultValue={table.shape} onChange={() => handleInputChange(index, table.table_number)}>
                                        <option value={'rectangle'}>Rectangle</option>
                                        <option value={'square'}>Square</option>
                                        <option value={'polygon'}>Polygon</option>
                                    </select>
                                </td>
                                <td className="d-flex ">
                                    <button type="button" onClick={(e) => props.handleDelete(e, index, table.table_number)} className="btn btn-danger">Delete</button>
                                    <button type="submit" className="btn btn-success" id={`confirm-${table.table_number}`} style={{ display: "none" }} onClick={(e) => handleConfirm(e, index, table.table_number)}>Confirm</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>

            </table>

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
        if (entries.table_number > 500) {
            setError({ "table_number": "Table number is too high" })
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
                            <input type="checkbox" defaultChecked={false} name="rotation" className="form-check-input" id="rotation-checked" />
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-md-12 d-flex button-container">
                            <button className="btn btn-primary" onClick={() => {
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
