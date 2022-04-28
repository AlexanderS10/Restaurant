import React from "react";
import { useEffect, useState } from 'react';
import { apiGetCategories, apiPostCategories, apiDeleteCategory, apiPatchCategory } from "./backEndLookUp";
import { ToastContainer, toast } from 'react-toastify';
import { DishForm, DishList } from "../dishes";
import { ConfirmContextProvider, ConfirmModal, useConfirm } from "../components";
export function CategoriesList(props) {
    console.log("Category list called")
    let [categories, setCategories] = useState([])//this creates and helps update the state
    let [catsAreSet, setCatsAreSet] = useState(false)
    let [newDish, setNewDish] = useState([])
    //This will set the initial categories to be the response of the api
    useEffect(() => {
        if (catsAreSet === false) {//This avoids an infinite loop in the useEffect Hook by only allowing the component to be mounted once at initial render
            let pullFunction = (response, status) => {
                if (status === 200) {
                    console.log("Initial category set")
                    setCategories(response)
                    setCatsAreSet(true)
                }
                else {
                    alert(response)
                }
            }
            apiGetCategories(pullFunction)
        }
    }, [catsAreSet])

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
            console.log("Category added")
            setCategories(final)
            toast.success("Added Successfully",
                {
                    theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                    progress: undefined,
                }
            )
        } else {
            toast.error(response.message,
                {
                    theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
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
        console.log("Category deleted")
        setCategories(final)
    }
    //Handle updating a category successfully
    let handleUpdateFrontEnd = (obj) => {
        let final = [...categories]
        let index = final.findIndex(x => x.id === obj.id)
        final[index] = obj
        console.log("Category updated")
        setCategories(final)
    }
    let addNewDish = (dish) => {
        setNewDish(dish)
    }
    return (
        <ConfirmContextProvider>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6  ">
                        <div className="col-md card card-body animate__animated animate__fadeInLeft">
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
                                    <input ref={inputRef} className="form-control " required />
                                    <button type="submit" className="btn btn-primary add-category">Create Category</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 animate__animated animate__fadeInRight dish-create-container">
                        <div className="card col-md">
                            <DishForm className="" category_data={categories} newDish={addNewDish} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 animate__animated animate__fadeIn">
                        <div className="card container col-md mt-4">
                            <DishList newDish={newDish} category_data={categories} />
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal />
            <ToastContainer />
        </ConfirmContextProvider>
    )
}

/*
    CATEGORY
*/
export function Category(props) {
    let { category } = props
    let { isConfirmed } = useConfirm()
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
                theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                progress: undefined,
            })
        }
        else {
            let handleUpdateBackend = (response, status) => {
                if (status === 200) {
                    //setCategory(response)
                    props.updateCategoryFunction(response)
                    toast.success("Updated Successfully", {
                        theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                        progress: undefined,
                    })
                }
                else {
                    toast.error(response.message, {
                        theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
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
                        theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                        progress: undefined,
                    }
                )
            }
            else {
                toast.error(response.message,
                    {
                        theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                        progress: undefined,
                    }
                )
            }
        }
        apiDeleteCategory(category.id, handleDeleteBackend)
    }

    let handleDelete = async (id, category, e) => {
        e.preventDefault()
        let confirmed = await isConfirmed(category)
        console.log(confirmed)
        if (confirmed) {
            handleDeleteClick()
        }
    }
    return <div className="mb-4 input-wrapper">
        <input id={category.category_name} defaultValue={category.category_name} onChange={handleInputChange} ref={inputRef} className="form-control" required />
        <div className='btn options-buttons'>
            <button className='btn btn-danger cancel-category' onClick={(e) => handleDelete(category.id, category.category_name, e)}><i className="bi bi-x-lg"></i></button>
            <button className={updateStyle} onClick={handleUpdateBackend}><i className="bi bi-check-lg"></i></button>
            {/* <OptionBtn category={categories} action={{ type: "delete", display: "Delete" }} actionFunction={props.actionFunction} className='btn btn-danger btn-sm form-control' />
            <OptionBtn category={categories} action={{ type: "edit", display: "Update" }} updateFunction={handleUpdateBackend} className={updateStyle} /> */}
        </div>
    </div>
}