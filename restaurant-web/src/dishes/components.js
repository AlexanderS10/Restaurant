import React from "react";
import { useEffect, useState } from 'react';
import { apiGetCategories } from "../categories/backEndLookUp";
import { apiGetDishes, apiPostDish, apiDeleteDish, apiPatchDish } from "./backEndLookUp";
import { toast } from "react-toastify";
import { useConfirm } from "../components";

export function DishForm(props) {
    console.log("Form called")
    let categories = props.category_data
    useEffect(() => {//runs on component did mount
        let list = document.getElementById('category-dropdown')
        for (let cat in categories) {
            let category = categories[cat]
            list.options[cat] = new Option(category.category_name, category.id)
        }
        return () => {
            document.getElementById('category-dropdown').innerHTML = "" //cleanup the select options on unmount
        }
    }, [categories])
    let handleSubmit = (event) => {
        event.preventDefault()
        let formData = new FormData(event.target)
        let value = Object.fromEntries(formData.entries())
        apiPostDish(value, handleDishAdded)
    }
    let handleDishAdded = (response, status) => {
        if (status === 201) {
            let form = document.getElementById("dish-form")
            form.reset()//resets the entries in the form
            props.newDish(response)
            toast.success("Dish Created Successfully",
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
    return (
        <>
            <div className="card-body ">
                <div className="card-title">
                    <h4>Create Dish</h4>
                </div>
                <form className="form" id="dish-form" onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-sm-3">
                            <h6>Price:</h6>
                        </div>
                        <div className="col-sm-9">
                            <input className="form-control" placeholder="Price" type="number" name="price" required />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-3">
                            <h6>Dish Name: </h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                            <input placeholder="Add the dish name" className="form-control" id="dish-name" name="dish_name" required="required" />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-3">
                            <h6>Description: </h6>
                        </div>
                        <div className="col-sm-9">
                            <textarea className="form-control" placeholder="Add a description" name="description" required="required" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3">
                            <h6>Category: </h6>
                        </div>
                        <div className="col-sm-9">
                            <select className="form-control" id="category-dropdown" name="category"></select>
                        </div>
                    </div>
                    <div className="submit-dish">
                        <button className="submit-dish-btn btn btn-primary" type="submit">Create Dish</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export function DishList(props) {
    let [isSet, setIsSet] = useState(false)
    let [dishesInit, setDishesInit] = useState([])
    useEffect(() => {//Pull the data from the API
        if (isSet === false) {
            let fetchDishes = (response, status) => {
                if (status === 200) {
                    setDishesInit(response)
                    setIsSet(true)
                }
            }
            apiGetDishes(fetchDishes)
        }
    }, [isSet])

    useEffect(() => {
        let final = [...dishesInit].concat(props.newDish)
        setDishesInit(final)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.newDish])

    let handleDeleteFrontEnd = (response) => {
        let temp = [...dishesInit]
        let final = temp.filter(function (e) {
            if (temp.length !== 0) {
                return e.id !== response.id
            }
            return e
        })
        setDishesInit(final)
    }
    return (
        <div className="card-body container">
            <div className="card-title">
                <h4>Dishes</h4>
            </div>
            <div >
                {dishesInit.map((item) => {
                    return (
                        <Dish key={item.id} dish={item} deleteFunction={handleDeleteFrontEnd} category_data={props.category_data} />
                    )
                })}
            </div>
        </div>
    )
}
/*
DISHES ARE VIEWED HERE
*/
function Dish(props) {
    let item = props.dish
    let [updateStyle, setUpdateStyle] = useState(" d-none ")
    let { isConfirmed } = useConfirm()
    let handleInputChange = () => {
        setUpdateStyle('btn btn-primary ')
    }
    let handleDelete = async (id, dish, e) => {
        e.preventDefault()
        let confirmed = await isConfirmed(dish)
        if (confirmed) {
            let deleteConfirmed = (response, status) => {
                if (status === 202) {
                    props.deleteFunction(response)
                    toast.success("Deleted Successfully",
                        {
                            theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                            progress: undefined,
                        }
                    )
                }
                else {
                    toast.error("There was an error!",
                        {
                            theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                            progress: undefined,
                        }
                    )
                }
            }
            apiDeleteDish(id, deleteConfirmed)
        }
    }

    useEffect(() => {//if the categories change then this will be refreshed
        let select = document.getElementById(`dropdown-${item.id}`)
        let data = [...props.category_data]
        if (select) {//although this will not scale well the more dishes are added the truth is that this should not host a lot of dishes as this is built for small restaurants in mind 
            data.forEach(function (element) {
                if (element.id === item.category) {//if the element matches the category for the item then that will be the default selected
                    select[select.options.length] = new Option(element.category_name, element.id, true, true)
                }
                else {
                    select[select.options.length] = new Option(element.category_name, element.id, false, false)
                }
            })
        }
        return () => {
            let select = document.getElementById(`dropdown-${item.id}`)
            if (select) {
                select.innerHTML = ""
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.category_data])

    let handleUpdate = (event) => {
        event.preventDefault()
        let formValues = new FormData(event.target)
        let data = Object.fromEntries(formValues.entries())

        let handleUpdateBackend = (response, status) => {
            console.log(response)
            if (status === 202) {
                toast.success("Dish Updated Successfully",
                    {
                        theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                        progress: undefined,
                    }
                )
            }
            else{
                toast.error(response.message,
                {
                    theme: "colored", closeButton: false, position: "top-center", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true,
                    progress: undefined,
                }
            )
            }

        }
        apiPatchDish(item.id, handleUpdateBackend, data)
        setUpdateStyle("d-none")
    }

    return (
        <>
            <form className="form" id={`form-dish-${item.id}`} onSubmit={(e) => handleUpdate(e)}>
                <div className="dish-form-wrapper row d-flex">
                    <input defaultValue={item.price} onChange={handleInputChange} className="form-inputs col-lg-1" name="price" required />
                    <textarea defaultValue={item.dish_name} onChange={handleInputChange} className="form-inputs col-lg-3" name="dish_name" required />
                    <textarea defaultValue={item.description} onChange={handleInputChange} className="form-inputs col-lg-4" name="description" required />
                    <select id={`dropdown-${item.id}`} className="form-inputs col-lg-2 " onChange={handleInputChange} name="category"></select>
                    <div className="col-lg-1 dish-form-buttons">
                        <button className="btn btn-danger" onClick={(e) => handleDelete(item.id, item.dish_name, e)}><i className="bi bi-x-lg"></i></button>
                        <button className={updateStyle} type="submit"><i className="bi bi-check-lg"></i></button>
                    </div>
                </div>
            </form >
        </>
    )
}

export function DishListView() {//This will display the menu how a customer will see it 
    let [isSet, setIsSet] = useState(false)
    let [dishes, setDishes] = useState([])
    let [categories, setCategories] = useState([])
    useEffect(() => {
        if (isSet === false) {//Run just once on mount 
            let pullDishes = (response, status) => {
                if (status === 200) {
                    setDishes(response)
                    setIsSet(true)
                } else {
                    alert("An error while fetching dishes ")
                }
            }
            let pullCategories = (response, status) => {
                if (status === 200) {
                    setCategories(response)
                } else {
                    alert("An error while fetching categories ")
                }
            }
            apiGetDishes(pullDishes)
            apiGetCategories(pullCategories)
        }
    }, [isSet])
    return (
        <div className="dish-view-container animate__animated animate__fadeInLeft">
            <div className="section-article d-flex justify-content-center">
                <h2>Menu List</h2>
            </div>
            <div className="row ">
                <div className="col-lg-12 d-flex justify-content-center">
                    <ul id="menu-filters">
                        <li data-filter="*" className="filter-active filter-box show-all" onClick={(e) => filterObjects("show-all")}>Show all</li>
                        {categories.map((item) => {
                            return <li key={item.id} onClick={() => filterObjects(item.category_name.replace(/\s/g, '-'))} className={"filter-box ".concat(item.category_name.replace(/\s/g, '-'))}>{item.category_name}</li>
                        })}
                    </ul>
                </div>
            </div>
            <div className="row menu-container container ">
                {dishes.map((item) => {
                    let category_class_index = categories.findIndex(x => x.id === item.category)
                    if (category_class_index !== -1) {//if the index is not undefined print the dishes
                        let category_class = categories[category_class_index].category_name.replace(/\s/g, '-')
                        return (
                            <div key={item.id} className={"col-lg-6 menu-item show animate__animated box ".concat(category_class)}>
                                <div className="menu-title">{item.dish_name}</div>
                                <div className="menu-description">{item.description}</div>
                            </div>
                        )
                    }
                    else {
                        return (
                            <div key={Math.random() * (200 - 100) + 100}>loading...</div>
                        )
                    }
                })}
            </div>
        </div>
    )
}

function filterObjects(value) {
    let clicked = document.querySelector(".".concat(value))
    let filters = document.querySelectorAll(".filter-box")//grab all the html filters 
    let dishes = document.querySelectorAll(".menu-item")//grabs all the dishes
    if (clicked.classList.contains('filter-active') === false) {//if the class is not already active the code will be executed 
        dishes.forEach(function (el) {
            addOrRemoveClasses(el, value)//add or remove classes
        })
    }
    filters.forEach(function (el) {//clear filter active from all the elements
        el.classList.remove('filter-active')
    })
    let selector = document.querySelector('.filter-box.'.concat(value))//add the filter active to the element selected
    if (selector !== null) {
        selector.classList.add("filter-active")
    }
}

function addOrRemoveClasses(item, value) {
    if (value !== "show-all") {
        if (item.classList.contains(value)) {
            item.classList.remove("hide")

        } else {
            item.classList.add("animate__zoomOut")
            setTimeout(function () {
                item.classList.add("hide")
                item.classList.remove("animate__zoomOut")
            }, 700)
        }
    } else {
        item.classList.remove("hide")
        item.classList.add("animate__slideInLeft")
        setTimeout(function () {
            item.classList.remove("animate__slideInLeft")
        }, 700)
    }
}