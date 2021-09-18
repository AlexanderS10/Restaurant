import React, {useEffect, useState} from 'react';
import './App.css';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";

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
function loadUserInfo(callback){
  const xhr = new XMLHttpRequest();
  const csrftoken = getCookie('csrftoken');
  console.log("This is the token: "+csrftoken)
  const method = 'GET';
  const url = "http://127.0.0.1:8000/userdetails/";
  xhr.responseType = "json"; // Let the xhr request know that its getting a json 
  xhr.open(method, url); //This opens the request with the method and url entered
  xhr.onload = function(){
    console.log("This is the response: ",xhr.response)
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
  const [selectedDay, setSelectedDay] = useState(null);
  return (
    
    <Calendar
       value={selectedDay}
      onChange={setSelectedDay}
       shouldHighlightWeekends
     />
    
  );
}

export default App;
