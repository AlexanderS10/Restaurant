import React from "react";
import {useEffect, useState} from 'react';
import { loadCategories } from "../api_lookup";

export function CategoryComponent(props){
    let handleSubmit = (event)=>{
        event.preventDefault()
        console.log(event)
    }
    return (
        <form onSubmit={handleSubmit}>
            <input className="form-control col-3"/>
            <button type="submit" className="btn btn-primary">Update</button>
        </form>
    )
}

export function CategoriesList(props){
    const [categories, setCategories] = useState([])
    useEffect(()=>{
      const myCallBack = (response,status)=>{
        if (status === 200){
          setCategories(response)
        }
      }
      loadCategories(myCallBack)
    },[])
    return (
      <div>
        {categories.map((item, index)=>{
          return <Category category={item} key={`${index}-{item.id}`} />
        })}
      </div>
    )
  }

export function OptionBtn(props){
    let {category,action} = props 
    let actionDisplay = action.display ? action.display : "Other"
    let display = action.type === "delete" ? `${actionDisplay}`: actionDisplay
    //Ternary operator ? works in as following => contintion to check ? execute if true: execute if false
    return action.type==="delete"?<button className='btn btn-danger btn-sm form-control' id = {category.id.concat("-btn")}>{display}</button>:<button className='btn btn-primary btn-sm' id = {category.id.concat("-btn")}>{display}</button>
  }
  
 export function Category(props){
    let {category}=props
    return <div className="mb-4 col-4 input-wrapper">
      <input id={category.id} value={category.id} className="form-control" readOnly/>
      <div className='btn btn-group'>
          <OptionBtn category = {category} action={{type:"delete", display:"Delete"}}/>
          <OptionBtn category = {category} action={{type:"edit", display:"Edit"}}/>
      </div>
    </div>
  }