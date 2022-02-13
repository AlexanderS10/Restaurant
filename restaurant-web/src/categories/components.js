import React from "react";
import { useEffect, useState } from 'react';
import { loadCategories, createCategories } from "../api_lookup";

export function CategoryComponent(props) {
    let inputRef = React.createRef()
    let [newCategory, setNewCategory] = useState([])
    let handleSubmit = (event) => {
        ///console.log("Submitted")
        event.preventDefault()
        let newVal = inputRef.current.value;
        let tempNewCategory = [...newCategory];
        createCategories(newVal, (response, status) => {
            if(status===201){
                console.log(tempNewCategory)
                tempNewCategory.unshift(response);
                setNewCategory(tempNewCategory)    
            }else{
                alert("An error has occurred");
            }
        })
        inputRef.current.value = ''
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input ref={inputRef} className="form-control col-3" />
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
            <CategoriesList newCategory={newCategory} />
        </div>
    )
}

export function CategoriesList(props) {
    let [categoriesInit, setCategoriesInit] = useState([])
    let [categories, setCategories] = useState([])
    let [catsAreSet, setCatsAreSet] = useState(false)
    useEffect(() => {
        let final = [...props.newCategory].concat(categoriesInit)
        if (final.length !== categories.length) {
            setCategories(final)
           
        }
    }, [props.newCategory, categories, categoriesInit])
    useEffect(() => {
        if (catsAreSet === false) {//This avoids an infinite loop in the useEffect Hook
            const myCallBack = (response, status) => {
                if (status === 200) {
                    setCategoriesInit(response)
                    setCatsAreSet(true)
                }
                else {
                    alert("There seems to be an error")
                }
            }
            loadCategories(myCallBack)
        }
    //console.log(categories)
    }, [catsAreSet])
    return (
        <div>
            {categories.map((item, index) => {
                //console.log(item);
                return <Category category={item} key={`${index}-{item.id}`} />
            })}
        </div>
    )
}

export function OptionBtn(props) {
    let { category, action } = props
    let actionDisplay = action.display ? action.display : "Other"
    let display = action.type === "delete" ? `${actionDisplay}` : actionDisplay
    //Ternary operator ? works in as following => contintion to check ? execute if true: execute if false
    //id={category.id.concat("delete-btn")}
    return action.type === "delete" ? <button className='btn btn-danger btn-sm form-control' >{display}</button> : <button className='btn btn-primary btn-sm' >{display}</button>
}

export function Category(props) {
    let { category } = props
    return <div className="mb-4 col-4 input-wrapper">
        <input id={category.id} value={category.id} className="form-control" />
        {/* <li>{category.id}</li> */}
        <div className='btn btn-group'>
            <OptionBtn category={category} action={{ type: "delete", display: "Delete" }} />
            <OptionBtn category={category} action={{ type: "edit", display: "Update" }} />
        </div>
    </div>
}