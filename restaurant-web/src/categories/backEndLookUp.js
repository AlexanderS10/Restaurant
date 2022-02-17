import { lookup } from "../api_lookup";
export function apiGetCategories(callback){
    lookup("GET", "categories/",callback);
  }
  
export function apiPostCategories(newCategory, callback){
  lookup("POST", "categories/create/", callback, {category_name:newCategory});
}

export function apiDeleteCategory(category_id, callback){
  lookup("DELETE",`categories/${category_id}`,callback);
}