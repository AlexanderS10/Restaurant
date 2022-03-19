import React from "react";
import { useEffect, useState } from 'react';
import { apiGetCategories } from "../categories/backEndLookUp";
import { apiGetDishes, apiPostDish, apiDeleteDish, apiPatchDish } from "./backEndLookUp";
import { toast } from "react-toastify";

export function DishForm(props) {
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
            console.log("The form was submitted successfully")
            let form = document.getElementById("dish-form")
            form.reset()//resets the entries in the form
            props.newDish(response)
            toast.success("Dish Created Successfully",
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
    return (
        <>
            <div className="card-body ">
                <div className="card-title">
                    <h4>Create Dish</h4>
                </div>
                <form className="form" id="dish-form" onSubmit={handleSubmit}>
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

export function DishListView() {
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
        <div className="container dish-view-container">
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

export function DishList(props) {
    let [isSet, setIsSet] = useState(false)
    let [dishesInit, setDishesInit] = useState([])
    useEffect(() => {
        if (isSet === false) {
            let fetchDishes = (response, status) => {
                if (status === 200) {
                    setDishesInit(response)
                    setIsSet(true)
                }
            }
            apiGetDishes(fetchDishes)
        }
        let list = document.querySelectorAll('#category-dropdown-list')
        list.forEach(function (el) {
            for (let cat in props.category_data) {
                let category = props.category_data[cat]
                el.options[cat] = new Option(category.category_name, category.id)
            }
        })
        return () => {
            document.getElementById('category-dropdown-list').innerHTML = "" //cleanup the select options on unmount
        }
    }, [isSet, props.category_data])

    useEffect(() => {
        console.log(props.newDish)
    }, [props.newDish])
    let handleInputChange = () => {

    }
    return (
        <div className="card-body">
            <div className="card-title">
                <h4>Dishes</h4>
            </div>
            <div >
                {dishesInit.map((item) => {
                    return (
                        <form key={item.id} className="form">
                            <div className="input-wrapper row">
                                <input defaultValue={item.dish_name} onChange={handleInputChange} className="form-control form-inputs" />
                                <input defaultValue={item.description} onChange={handleInputChange} className="form-control form-inputs" />
                                <select id="category-dropdown-list" className="form-control form-inputs"></select>
                            </div>

                        </form>

                    )
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
    document.querySelector('.filter-box.'.concat(value)).classList.add("filter-active")//add the filter active to the element selected
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