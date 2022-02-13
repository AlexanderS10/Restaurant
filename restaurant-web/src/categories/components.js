import React from "react";
import { useEffect, useState } from 'react';
import { apiGetCategories, apiPostCategories } from "./backEndLookUp";

export function CategoryComponent(props) {
    let inputRef = React.createRef()
    let [newCategory, setNewCategory] = useState([])
    let handleSubmit = (event) => {//Here we submit the request 
        event.preventDefault()
        let newVal = inputRef.current.value;
        apiPostCategories(newVal, handleBackendUpdate);
        inputRef.current.value = ''
    }
    let handleBackendUpdate = (response,status)=>{//Here we handle the request if it is successful
        let tempNewCategory = [...newCategory];
        if(status===201){
            tempNewCategory.unshift(response);
            setNewCategory(tempNewCategory)    
        }else{
            alert("An error has occurred");
        }
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
    let [categories, setCategories] = useState([])//this creates and helps update the state
    let [catsAreSet, setCatsAreSet] = useState(false)
    useEffect(() => {//This executes in every render depending on the dependencies that are specified
        let final = [...props.newCategory].concat(categoriesInit)
        if (final.length !== categories.length) {
            setCategories(final)
            console.log("set categories")
        }
    }, [props.newCategory, categories, categoriesInit])
    useEffect(() => {
        if (catsAreSet === false) {//This avoids an infinite loop in the useEffect Hook by only allowing the component to be mounted once at initial render
            const pullFunction = (response, status) => {
                if (status === 200) {
                    setCategoriesInit(response)
                    setCatsAreSet(true)
                }
                else {
                    alert("There seems to be an error")
                }
            }
            apiGetCategories(pullFunction)
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
    return action.type === "delete" ? <button className='btn btn-danger btn-sm form-control' id={category.category_name.concat("delete-btn")}>{display}</button> : <button className='btn btn-primary btn-sm' >{display}</button>
}

export function Category(props) {
    let { category } = props
    return <div className="mb-4 col-4 input-wrapper">
        <input id={category.category_name} value={category.category_name} className="form-control" />
        {/* <li>{category.id}</li> */}
        <div className='btn btn-group'>
            <OptionBtn category={category} action={{ type: "delete", display: "Delete" }} />
            <OptionBtn category={category} action={{ type: "edit", display: "Update" }} />
        </div>
    </div>
}