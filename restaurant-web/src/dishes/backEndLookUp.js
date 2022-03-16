import { lookup } from "../api_lookup";
export function apiGetDishes(callback){
    lookup("GET", "dishes/",callback);
  }
  
export function apiPostDish(newDish, callback){
  lookup("POST", "dishes/create/", callback, newDish);
}

export function apiDeleteDish(dish_id, callback){
  lookup("DELETE",`dishes/${dish_id}`,callback);
}

export function apiPatchDish(dish_id, callback, dish_name){
  
  lookup("PATCH", `dishes/${dish_id}/`, callback, {dish_name:dish_name})
}