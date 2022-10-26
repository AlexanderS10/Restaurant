import * as React from "react";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from "react-router-dom";
import { UsersSearch } from "./users"
import { CategoriesList } from './categories'
import { UserPage } from './users'
import { TableCreationComponent } from './tableRoomCreation'
import { RoomCreationContainer } from './tableRoomCreation'
import { LandingPage } from './Templates/landing'
import { LoginPage } from './Templates/login'
import { RegistrationPage } from "./Templates/registration";
import PrivateRoute from "./users/PrivateRoute";
import { LoadUser } from "./api_lookup/frontendAuth";
import { UserPortal } from "./users/portal";
import store from "./store";


// import {CalendarComponent} from './customer/calendar'
// import {WheatherWidget} from './customer/wheatherWidget'
// import ReactWeather, {useOpenWeather} from 'react-open-weather';
//import { ConfirmContextProvider, ConfirmModal } from "./components";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route exact path="/users" element={
          <PrivateRoute>
            <UsersSearch />
          </PrivateRoute>}
        />
        <Route exact path="/portal" element={
          <PrivateRoute>
            <UserPortal />
          </PrivateRoute>}
        />
        <Route path="/menu" element={<CategoriesList />} />
        <Route exact path="/:userId" element={<UserPage />} />
        <Route exact path="/tables/create/:roomId" element={<TableCreationComponent />} />
        <Route exact path="/rooms/create" element={<RoomCreationContainer />} />
        <Route exact path='/login' element={<LoginPage />} />
        <Route exact path='/register' element={<RegistrationPage />} />
      </Routes>

    </div>

  );
}

export default App;