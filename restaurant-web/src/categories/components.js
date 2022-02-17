import React from "react";
import { useEffect, useState } from 'react';
import { apiGetCategories, apiPostCategories, apiDeleteCategory } from "./backEndLookUp";

export function CategoryComponent(props) {
    let inputRef = React.createRef()
    let [newCategory, setNewCategory] = useState([])
    let handleSubmit = (event) => {//Here we submit the request 
        event.preventDefault()
        let newVal = inputRef.current.value;
        apiPostCategories(newVal, handleBackendUpdate);
        inputRef.current.value = ''
    }
    let handleBackendUpdate = (response, status) => {//Here we handle the request if it is successful
        //let tempNewCategory = [...newCategory];
        if (status === 201) {
            //tempNewCategory.unshift(response);
            setNewCategory(response)
            
        } else {
            alert("An error has occurred");
        }
    }
    return (
        <div>
            <CategoriesList newCategory={newCategory} />
            <form onSubmit={handleSubmit}>
                <input ref={inputRef} className="form-control col-3" />
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
            
        </div>
    )
}
export function CategoriesList(props) {
    let [categoriesInit, setCategoriesInit] = useState([])
    let [categories, setCategories] = useState([])//this creates and helps update the state
    let [catsAreSet, setCatsAreSet] = useState(false)
    let [deletedCategory, setDeletedCategory] = useState([])
    let [tempCategory, setTempCategory] = useState([])
    let [changed, setChanged]= useState(false)
    //This will set the initial categories to be the response of the api
    useEffect(() => {
        if (catsAreSet === false) {//This avoids an infinite loop in the useEffect Hook by only allowing the component to be mounted once at initial render
            const pullFunction = (response, status) => {
                if (status === 200) {
                    console.log("Get response")
                    setCategoriesInit(response)
                    setCatsAreSet(true)
                }
                else {
                    alert("There seems to be an error")
                }
            }
            apiGetCategories(pullFunction)
        }
    }, [catsAreSet])
    //This will listen for a change in newCategory which means an item has been submitted and need to add it, equally this will listen for a deleted item
    useEffect(()=>{
        //Need to set common equal to the initial array which will trigger the next useEffect
        console.log("Initial set of temp category")
        setTempCategory(categoriesInit)
    },[categoriesInit])

    useEffect(()=>{
        let final = [...tempCategory].concat(props.newCategory)
        console.log("executed when adding value changed")
        setTempCategory(final)
    },[props.newCategory])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        let final = [...tempCategory].filter(function(e){
            if(deletedCategory.length !==0){
                return e.id !== deletedCategory.id
            }
            return e
        })
        console.log("Delete trigger")
        setTempCategory(final)
    },[deletedCategory])// eslint-disable-line react-hooks/exhaustive-deps
    useEffect(()=>{
        console.log("Executed set categories")
        setCategories(tempCategory)
    },[tempCategory])
    //This will listen for the common array and set it equals to categories
    // useEffect(() => {//This executes in every render depending on the dependencies that are specified
    //     let final = [...props.newCategory].concat(categoriesInit).filter(function(e){
    //         if(deletedCategory.length!==0){
    //             return e.id !== deletedCategory.id
    //         }
    //         return e
    //     })
    //     if (final.length !== categories.length) {
    //         console.log("Added executed", final)
    //         setCategories(final) 
    //         console.log("set categories")
    //     }
    // }, [deletedCategory, props.newCategory,  categories, categoriesInit])
    
    return (
        <div>
            {categories.map((item, index) => {
                return <Category category={item} key={`${index}-{item.id}`} actionFunction={setDeletedCategory}  />
            })}
        </div>
    )
}

export function Category(props) {
    let { category } = props
    return <div className="mb-4 col-4 input-wrapper">
        <input id={category.category_name} value={category.category_name} className="form-control" />
        {/* <li>{category.id}</li> */}
        <div className='btn btn-group'>
            <OptionBtn category={category} action={{ type: "delete", display: "Delete" }} actionFunction={props.actionFunction} />
            <OptionBtn category={category} action={{ type: "edit", display: "Update" }} />
        </div>
    </div>
}

export function OptionBtn(props) {
    let { category, action } = props
    let actionDisplay = action.display ? action.display : "Other"
    let display = action.type === "delete" ? `${actionDisplay}` : actionDisplay
    let handleClick = (event) => {
        event.preventDefault()
        let handleDeleteBackend = (response, status)=>{
            if (status===202){
                props.actionFunction(category)
                
                console.log("api success", response)
            }
            else{
                alert("Action error")
            }
        }
        apiDeleteCategory(category.id, handleDeleteBackend)
        console.log("Button clicked!")
    }
    return action.type === "delete" ? <button className='btn btn-danger btn-sm form-control' onClick={handleClick}>{display}</button> : <button className='btn btn-primary btn-sm' >{display}</button>
}

