import * as React from "react";
import { Routes, Route } from "react-router-dom";
import {UsersSearch} from "./users"
import { CategoriesList } from './categories'
import {UserPage} from './users'
// import {CalendarComponent} from './customer/calendar'
// import {WheatherWidget} from './customer/wheatherWidget'
// import ReactWeather, {useOpenWeather} from 'react-open-weather';
function App() {
  
  return (
   <div className="App">
      <Routes>
      <Route path="/" element={<UsersSearch />} />
        <Route path="/users" element={<UsersSearch />} />
        <Route path="/menu" element={<CategoriesList/>} />
        <Route exact path="/:userId" element={<UserPage/>} />
      </Routes>
    </div>
    
  );
}

export default App;