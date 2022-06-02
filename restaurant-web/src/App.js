import * as React from "react";
import { Routes, Route } from "react-router-dom";
import {UsersSearch} from "./users"
import { CategoriesList } from './categories'
import {UserPage} from './users'
import {TableCreationComponent} from './tableRoomCreation'
import {RoomCreationContainer} from './tableRoomCreation'
// import {CalendarComponent} from './customer/calendar'
// import {WheatherWidget} from './customer/wheatherWidget'
// import ReactWeather, {useOpenWeather} from 'react-open-weather';
//import { ConfirmContextProvider, ConfirmModal } from "./components";
function App() {
  
  return (
   <div className="App">
      <Routes>
      <Route path="/" element={<UsersSearch />} />
        <Route path="/users" element={<UsersSearch />} />
        <Route path="/menu" element={<CategoriesList/>} />
        <Route exact path="/:userId" element={<UserPage/>} />
        <Route exact path="/tables/create" element={<TableCreationComponent/>} />
        <Route exact path="/rooms/create" element={<RoomCreationContainer/>} />
      </Routes>
      
    </div>
    
  );
}

export default App;