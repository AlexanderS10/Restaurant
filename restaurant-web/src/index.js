import React from 'react';
//import ReactDOM from 'react-dom';
import './index.css';
import './styles/user-search.css'
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './styles/messages-component.css'
import 'react-toastify/dist/ReactToastify.css';
import reportWebVitals from './reportWebVitals';
//import {CalendarComponent} from './customer/calendar'
//import {WeatherWidget} from './customer/weatherWidget'
import {CategoriesList} from './categories'
//import { ToastContainer } from "react-toastify";
import {DishListView} from "./dishes"
import {UsersSearch} from "./users"

//let calendarWidget = document.getElementById("calendar-widget");
//let weatherWidget = document.getElementById("weather-widget");
let categoriesListWidget = document.getElementById("categories-list")
let searchWidget = document.getElementById("user-search")
let menuWidget = document.getElementById("menu-view")
//let messagesWidget = document.getElementById("messages-component")
//let dishListViewWidget = document.getElementById("dish-list-view-widget")

// if (calendarWidget){
//   ReactDOM.render(<CalendarComponent/>,document.getElementById('calendar-widget'));
// }
// if (weatherWidget){
//   ReactDOM.render(<WeatherWidget/>, document.getElementById('weather-widget'));
// }

// if(categoriesListWidget){
//   ReactDOM.render(<CategoriesList/>, categoriesListWidget)
// }
// if(messagesWidget){
//   ReactDOM.render(<ToastContainer/>,messagesWidget)
// }
// if(dishListViewWidget){
//   ReactDOM.render(<DishListView/>,dishListViewWidget)
// }
// if(menuWidget){
//   reactDom.render(<DishListView/>,menuWidget)
// }
// if(searchWidget){
//   reactDom.render(<UsersSearch/>, searchWidget)
// }
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<CategoriesList />} />
    </Routes>
  </BrowserRouter>,
  categoriesListWidget
);
render(
  <BrowserRouter>
    <Routes>
      <Route path="menu" element={<DishListView />} />
    </Routes>
  </BrowserRouter>,
  menuWidget
);
render(
  <BrowserRouter>
    <Routes>
      <Route path='users' element={<UsersSearch/>}/>
    </Routes>
  </BrowserRouter>,
  searchWidget
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
