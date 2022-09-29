function getCookie(name) { //This is from the django website
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
export function lookup(method, endpoint, callback, data) {
  let jsonData;
  if (data) {
    jsonData = JSON.stringify(data);
  }
  let xhr = new XMLHttpRequest(); //TODO update this to the Fetch API data 
  let url = `http://127.0.0.1:8000/api/${endpoint}`;
  xhr.responseType = "json";
  xhr.open(method, url);
  xhr.setRequestHeader("Content-Type", "application/json");
  const csrftoken = getCookie('csrftoken');
  if (csrftoken) {
    xhr.setRequestHeader("HTTP_X_REQUEST_WITH", "XMLHttpRequest");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
  }
  xhr.onload = function () {
    callback(xhr.response, xhr.status);
  }
  xhr.onerror = function () {
    callback({ "message": "The request was an error" }, 400);
  }
  xhr.send(jsonData);
}

export function searchlookup(method, endpoint, callback, data) {//This time I will expriment with the fetch api rather than xml
  let jsonData;
  let csrftoken = getCookie('csrftoken');
  let headers = new Headers({ "Content-Type": "application/json" })//initialize the headers
  if (data) {
    jsonData = JSON.stringify(data)
  }
  if (csrftoken) {
    headers.append("X-CSRFToken", csrftoken)
  }
  let request = new Request(
    `http://127.0.0.1:8000/api/${endpoint}`,
    {
      method: method,
      headers: headers,
      body: jsonData
    }
  )
  fetch((request))
    .then(response => response.json().then(data => callback(response,data)))
    .catch((error) => {alert(error)}) 
}
export function searchlookupLink(method, endpoint, callback, data) {//This time I will expriment with the fetch api rather than xml
  let jsonData;
  let csrftoken = getCookie('csrftoken');
  let headers = new Headers({ "Content-Type": "application/json" })//initialize the headers
  if (data) {
    jsonData = JSON.stringify(data)
  }
  if (csrftoken) {
    headers.append("X-CSRFToken", csrftoken)
  }
  let request = new Request(
    endpoint,
    {
      method: method,
      headers: headers,
      body: jsonData
    }
  )
  fetch((request))
    .then(response => response.json().then(data => callback(response,data)))
    .catch((error) => alert(error)) 
}
export async function searchlookupImageRoom(method, endpoint, data, responseReturn) {//This time I will expriment with the fetch api rather than xml
  let formData;
  let csrftoken = getCookie('csrftoken');
  let headers = new Headers({"Content-Type": "multipart/form-data; boundary=123456"},{"Accept":"*/*"})//initialize the headers
  if (data) {
    formData = data
    //console.log(Object.fromEntries(formData))
  }
  if (csrftoken) {
    headers.append("X-CSRFToken", csrftoken)
  }
  let request = new Request(
    `http://127.0.0.1:8000/api/${endpoint}`,
    {
      method: method,
      body: formData//headers are not neccesary since the fetch api will figure out the correct headers a content type as well as boundary if needed
    }
  )
  try{
    let response=await fetch((request))
    responseReturn = response
    //console.log(response.status)
    if(response.status===201){
     // console.log("The image upload")
      return true //if the response is not ok then false is returned from the function
    }
    else if(response.status!==201){
      return false
    }
  }catch(error){
    alert(error)
  } 
}