import React from "react";
import { useEffect, useState } from 'react';
import { apiGetCategories, apiPostCategories, apiDeleteCategory, apiPatchCategory } from "./backEndLookUp";
import { toast } from "react-toastify";
import { DishForm } from "../dishes";

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
                            closeButton: false,
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        }
                    )
                }
            }
            apiGetCategories(pullFunction)
        }
    }, [catsAreSet])
    useEffect(() => {//This will only trigger when the api responded and categoriesInit changes
        setCategories(categoriesInit)
    }, [categoriesInit])

    let inputRef = React.createRef()
    let handleSubmit = (event) => {
        event.preventDefault()
        let newVal = inputRef.current.value;
        apiPostCategories(newVal, handleAddCategory);
        inputRef.current.value = ''
    }
    let handleAddCategory = (response, status) => {//Here we handle the request if it is successful
        if (status === 201) {
            let final = [...categories].concat(response)
            setCategories(final)
            toast.success("Added Successfully",
                {
                    theme: "colored",
                    closeButton: false,
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
            )
        } else {
            toast.error(response.message,
                {
                    theme: "colored",
                    closeButton: false,
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
            )
        }
    }

    //Handle deleting an onject after the function was successful
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
    //Handle updating a category successfully
    let handleUpdateFrontEnd = (obj) => {
        let final = [...categories]
        let index = final.findIndex(x => x.id === obj.id)
        final[index] = obj
        console.log("Updated list: ", final)
        setCategories(final)
    }
    
    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-6  ">
                    <div className="col-md card card-body">
                        <div className="card-title card-body">
                            <h4>Dish Categories</h4>
                        </div>
                        <div>
                            {categories.map((item, index) => {
                                return <Category category={item} key={item.id} actionFunction={handleDeleteFrontEnd} updateCategoryFunction={handleUpdateFrontEnd} />
                            })}
                        </div>

                        <div>
                            <form onSubmit={handleSubmit} className="input-wrapper">
                                <input ref={inputRef} className="form-control " required/>
                                <button type="submit" className="btn btn-primary add-category">Create Category</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 animate__animated animate__fadeInRight dish-create-container">
                    <div className="card col-md">
                        <DishForm className="" category_data={categories} />
                    </div>
                </div>


            </div>
        </div>
    )
}

/*
    CATEGORY
*/

export function Category(props) {
    let { category } = props
    //console.log("Category Called: ",category)
    let inputRef = React.createRef()
    let [updateStyle, setUpdateStyle] = useState('d-none')

    function handleInputChange() {
        setUpdateStyle('btn btn-primary ')
    }
    function handleUpdateBackend() {
        let currentValue = inputRef.current.value
        if (currentValue === "") {
            toast.error("Cannot submit empty values", {
                theme: "colored",
                closeButton: false,
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
        else {
            let handleUpdateBackend = (response, status) => {
                if (status === 200) {
                    //setCategory(response)
                    props.updateCategoryFunction(response)
                    toast.success("Updated Successfully", {
                        theme: "colored",
                        closeButton: false,
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                }
                else {
                    toast.error(response.message, {
                        theme: "colored",
                        closeButton: false,
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                }
            }
            apiPatchCategory(category.id, handleUpdateBackend, currentValue)
        }
        setUpdateStyle('d-none')
    }
    let handleDeleteClick = () => {
        let handleDeleteBackend = (response, status) => {
            if (status === 202) {
                props.actionFunction(response, status)
                toast.success("Deleted Successfully",
                    {
                        theme: "colored",
                        closeButton: false,
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }
                )
            }
            else {
                toast.error(response.message,
                    {
                        theme: "colored",
                        closeButton: false,
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }
                )
            }
        }
        apiDeleteCategory(category.id, handleDeleteBackend)
        handleConfirmationBox(true)
    }

    const handleConfirmationBox = (wasSet) => {
        let deleteButton = document.getElementById('confirmation-button')
        if (wasSet === false) {
            document.querySelector(".confirm-bg").style.display = "flex"
            document.querySelector(".container-popup").style.display = "flex"
            deleteButton.addEventListener('click', handleDeleteClick)
            document.getElementById("confirmation-text").innerHTML = `Do you really want to delete ${category.category_name}?`
        }
        else if (wasSet === true) {
            document.querySelector(".confirm-bg").style.display = "none"
            document.querySelector(".container-popup").style.display = "none"
            deleteButton.removeEventListener('click', handleDeleteClick)
        }
    }
    return <div className="mb-4 input-wrapper">
        <input id={category.category_name} defaultValue={category.category_name} onChange={handleInputChange} ref={inputRef} className="form-control" required />

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
            <button className='btn btn-danger cancel-category' onClick={() => handleConfirmationBox(false)}><i className="bi bi-x-lg"></i></button>
            <button className={updateStyle} onClick={handleUpdateBackend}><i className="bi bi-check-lg"></i></button>
            {/* <OptionBtn category={categories} action={{ type: "delete", display: "Delete" }} actionFunction={props.actionFunction} className='btn btn-danger btn-sm form-control' />
            <OptionBtn category={categories} action={{ type: "edit", display: "Update" }} updateFunction={handleUpdateBackend} className={updateStyle} /> */}
        </div>
    </div>
}



