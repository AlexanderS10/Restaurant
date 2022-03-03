import React from "react";
import { useEffect, useState } from 'react';
import { apiGetCategories, apiPostCategories, apiDeleteCategory, apiPatchCategory } from "./backEndLookUp";
import { DishList } from "../dishes";
import { toast } from "react-toastify";

export function ParentCategoryDish(props){
    let categories = null
    console.log("Categories", categories)
    return(
        <>
            <CategoriesList categoriesParent = {categories}/>
            
        </>
    )
}
export function CategoriesList(props) {
    let [categoriesInit, setCategoriesInit] = useState([])
    let [categories, setCategories] = useState([])//this creates and helps update the state
    let [catsAreSet, setCatsAreSet] = useState(false)
    //This will set the initial categories to be the response of the api
    useEffect(() => {
        if (catsAreSet === false) {//This avoids an infinite loop in the useEffect Hook by only allowing the component to be mounted once at initial render
            const pullFunction = (response, status) => {
                if (status === 200) {
                    setCategoriesInit(response)
                    setCatsAreSet(true)
                }
                else {
                    toast.error(response.message,
                        {
                        theme: "colored",
                        closeButton:false,
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,}
                        )
                }
            }
            apiGetCategories(pullFunction)
        }
    }, [catsAreSet])
    useEffect(() => {//This will only trigger when the api responded and categoriesInit changes
        setCategories(categoriesInit)
    }, [categoriesInit])
    //Previous approach relied on the useEffect hook which changed the list but as a consequence it re-rendered the list the amount of times I used the hook
    //to avoid this I learned about the hook and realised I can only use it on mount of the list and do not need to be re-rendering the item multiple times but
    //only the amount of times I do an action.
    //FUNCTION SETTING OF ADDING AN ELEMENT
    let inputRef = React.createRef()
    let handleSubmit = (event) => {
        event.preventDefault()
        let newVal = inputRef.current.value;
        apiPostCategories(newVal, handleBackendUpdate);
        inputRef.current.value = ''
    }
    let handleBackendUpdate = (response, status) => {//Here we handle the request if it is successful
        if (status === 201) {
            let final = [...categories].concat(response)
            setCategories(final)
        } else {
            toast.error(response.message,
            {
            theme: "colored",
            closeButton:false,
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,}
            )
        }
    }

    //FUNCTION FOR DELETING AN OBJECT FROM THE LIST
    let handleDeleteFrontEnd = (obj, status) => {
        let final = [...categories].filter(function (e) {
            if (categories.length !== 0) {
                return e.id !== obj.id
            }
            return e
        })
        //console.log("Final list: ", final)
        setCategories(final)
    }
    return (
        <>
            <div>
                {categories.map((item, index) => {
                    return <Category category={item} key={item.id} actionFunction={handleDeleteFrontEnd} />
                })}
            </div>
            
            <div>
                <form onSubmit={handleSubmit} className="col-4 input-wrapper">
                    <input ref={inputRef} className="form-control " />
                    <button type="submit" className="btn btn-primary add-category">Add Category</button>
                </form>
            </div>
        </>
    )
}

export function Category(props) {
    let { category } = props
    let [categories, setCategory] = useState(category)
    console.log("Category Called: ",categories)
    let inputRef = React.createRef()
    let [updateStyle, setUpdateStyle] = useState('d-none')

    function handleInputChange() {
        setUpdateStyle('btn btn-primary btn-sm')
    }
    function handleUpdateBackend() {
        let currentValue = inputRef.current.value
        let handleUpdateBackend = (response, status) => {
            if (status === 200) {
                setCategory(response)
            }
            else {
                toast.error("An error has occurred",
                    {
                    theme: "colored",
                    closeButton:false,
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,}
                    )
            }
        }
        apiPatchCategory(category.id, handleUpdateBackend, currentValue)
        setUpdateStyle('d-none')
    }
    let handleDeleteClick = () => {
        let handleDeleteBackend = (response, status) => {
            if (status === 202) {
                props.actionFunction(response, status)
            }
            else {
                toast.error(response.message,
                    {
                    theme: "colored",
                    closeButton:false,
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,}
                    )
            }
        }
        apiDeleteCategory(categories.id, handleDeleteBackend)
        handleConfirmationBox(true)
    }

    const handleConfirmationBox = (wasSet) => {
        let deleteButton = document.getElementById('confirmation-button')
        if (wasSet === false) {
            document.querySelector(".confirm-bg").style.display = "flex"
            document.querySelector(".container-popup").style.display = "flex"
            deleteButton.addEventListener('click', handleDeleteClick)
            document.getElementById("confirmation-text").innerHTML = `Do you really want to delete ${categories.category_name}?`
        }
        else if (wasSet === true) {
            document.querySelector(".confirm-bg").style.display = "none"
            document.querySelector(".container-popup").style.display = "none"
            deleteButton.removeEventListener('click', handleDeleteClick)
        }
    }
    return <div className="mb-4 col-4 input-wrapper">
        <input id={categories.category_name} defaultValue={categories.category_name} onChange={handleInputChange} ref={inputRef} className="form-control" />

        <div className="container-popup">
            <div className="confirmation-text" id="confirmation-text">

            </div>
            <div className="button-container justify-content-center">
                <button className="cancel-button" onClick={() => handleConfirmationBox(true)}>
                    Cancel
                </button>
                <button className="confirmation-button" id='confirmation-button' >
                    Confirm
                </button>
            </div>
        </div>
        <div className="confirm-bg" onClick={() => handleConfirmationBox(true)}>
        </div>
        <div className='btn options-buttons'>
            <button className='btn btn-danger btn-sm form-control' onClick={() => handleConfirmationBox(false)}>Delete</button>
            <button className={updateStyle} onClick={handleUpdateBackend}><i className="bi bi-check"></i></button>
            {/* <OptionBtn category={categories} action={{ type: "delete", display: "Delete" }} actionFunction={props.actionFunction} className='btn btn-danger btn-sm form-control' />
            <OptionBtn category={categories} action={{ type: "edit", display: "Update" }} updateFunction={handleUpdateBackend} className={updateStyle} /> */}
        </div>
    </div>
}

export function MessagesComponent(props) {
    // console.log("Notification triggered")
    // let [message, setMessage] = useState("This is the error message")
    // let [classes, setClasses] = useState('animate__bounceInDown error-message-color ')
    // let [signClasses, setSignClasses] = useState(' error-sign-color ')
    
    // useEffect(() => {
    //     let timer1 = setTimeout(() => setClasses('animate__bounceOutLeft error-message-color'), 3000)
    //     return () => {
    //         clearTimeout(timer1)
    //     }
    // },[message])
    // return (
    //     <>
    //         <div className={classes.concat(' messages-wrapper  animate__animated error-message-color')} id="messages-wrapper">
    //             <div className={signClasses.concat(" message-sign")}><i className="bi bi-x-lg"></i></div>
    //             <div className="messages" id="messages">{message}</div>
    //         </div>
    //     </>
    // )
}

