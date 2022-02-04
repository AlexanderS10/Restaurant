import {useEffect, useState} from 'react';
import './App.css';
// import {CalendarComponent} from './customer/calendar'
// import {WheatherWidget} from './customer/wheatherWidget'
// import ReactWeather, {useOpenWeather} from 'react-open-weather';
function getCookie(name) {
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
let csrftoken = getCookie('csrftoken');
console.log("This is the token: "+csrftoken)
function loadUserInfo(callback){
  let xhr = new XMLHttpRequest();
  let method = 'GET';
  let url = "http://127.0.0.1:8000/api/userdetails/";
  xhr.responseType = "json"; // Let the xhr request know that its getting a json 
  xhr.open(method, url); //This opens the request with the method and url entered
  xhr.setRequestHeader("Content-Type","application/json")
  if (csrftoken){
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
  }
  xhr.onload = function(){
    if(xhr.status==403){
      let detail = xhr.response.detail;
      if(detail ==="Authentication credentials were not provided.");
        if(window.location.href.indexOf("login")===-1){
          window.location.href="/login"
        }
    }
    callback(xhr.response, xhr.status)
  }
  xhr.onerror = function(){
    callback({"message":"The request was an error"}, 400)
  }
  xhr.send();//Trigger that request
}

function App() {
  const [info, setinfo] = useState(null)
  
  useEffect(()=>{
    const myCallBack = (response,status)=>{
      console.log(response,status)
      if (status === 200){
        setinfo(response)
      }
    }
    loadUserInfo(myCallBack)
  },[])
  
  return (
    // WheatherWidget()
    <div>Here</div>
  );
}

export default App;