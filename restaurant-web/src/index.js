import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './styles/messages-component.css'
// import App from './App';
import reportWebVitals from './reportWebVitals';
import {CalendarComponent} from './customer/calendar'
import {WeatherWidget} from './customer/weatherWidget'
import {CategoriesList} from './categories'
import {MessagesComponent} from './categories'
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
let calendarWidget = document.getElementById("calendar-widget");
let weatherWidget = document.getElementById("weather-widget");
let categoriesListWidget = document.getElementById("categories-list")
let messagesWidget = document.getElementById("messages-component")
if (calendarWidget){
  ReactDOM.render(<CalendarComponent/>,document.getElementById('calendar-widget'));
}
if (weatherWidget){
  ReactDOM.render(<WeatherWidget/>, document.getElementById('weather-widget'));
}

if(categoriesListWidget){
  ReactDOM.render(<CategoriesList/>, categoriesListWidget)
}
if(messagesWidget){
  ReactDOM.render(<MessagesComponent/>,messagesWidget)
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
