import React from "react";
import { useEffect, useState } from 'react';
import { apiGetDishes, apiPostDish, apiDeleteDish, apiPatchDish } from "./backEndLookUp";
import { toast } from "react-toastify";

export function DishForm(props) {
    
    let categories = props.category_data
    console.log("Data passed: ", categories)
    useEffect(()=>{//runs on component did mount
        let list = document.getElementById('category-dropdown')
        for (let cat in categories){
            let category = categories[cat]
            list.options[cat] = new Option(category.category_name,category.id)
            console.log(category)
        }  
    },[categories])
    
    
    return (
        <div className="card-body ">
            <div className="card-title">
                <h4>Create Dish</h4>
            </div>
            <form className="form">
                <div className="row mb-3">
                    <div className="col-sm-3">
                        <h6>Dish Name: </h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                        <input placeholder="Dish name" className="form-control"/>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-3">
                        <h6>Description: </h6>
                    </div>
                    <div className="col-sm-9">
                        <textarea className="form-control"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-3">
                        <h6>Category: </h6>
                    </div>
                    <div className="col-sm-9">
                        <select className="form-control" id="category-dropdown"></select>
                    </div>
                </div>
            </form>
        </div>

    )
}