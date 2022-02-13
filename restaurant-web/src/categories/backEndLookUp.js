import { lookup } from "../api_lookup";
export function apiGetCategories(callback){
    lookup("GET", "categories/",callback)
  }
  
  export function apiPostCategories(newCategory, callback){
    lookup("POST", "categories/create/", callback, {category_name:newCategory})
  }