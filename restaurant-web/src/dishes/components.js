import React from "react";
import { useEffect, useState } from 'react';
import { apiGetDishes, apiPostDish, apiDeleteDish, apiPatchDish } from "./backEndLookUp";
import { toast } from "react-toastify";

export function DishList(props){
    console.log("Categories from dishes", props.categories)
    return(
        <></>
    )
}