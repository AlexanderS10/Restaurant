const xhr = new XMLHttpRequest();
const method = 'GET';
const url = "/userdetails";
const responseType = "json";

xhr.responseType = responseType; // Let the xhr request know that its getting a json 
xhr.open(method, url); //This opens the request with the method and url entered
xhr.onload = function(){//Once it loads it is going to be logged to the console
    console.log(xhr.response);
}
xhr.send();//Trigger that request