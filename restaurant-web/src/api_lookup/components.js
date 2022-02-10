export function loadCategories(callback){
    let xhr = new XMLHttpRequest();
    let method = 'GET';
    let url = "http://127.0.0.1:8000/api/categories/";
    xhr.responseType = "json"; // Let the xhr request know that its getting a json 
    xhr.open(method, url); //This opens the request with the method and url entered
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.onload = function(){
      callback(xhr.response, xhr.status)
    }
    xhr.onerror = function(){
      callback({"message":"The request was an error"}, 400)
    }
    xhr.send();//Trigger that request
  }