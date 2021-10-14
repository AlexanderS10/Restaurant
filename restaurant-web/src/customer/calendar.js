import React, {useState} from 'react';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import Container from 'react-bootstrap/Container'
import { utils } from 'react-modern-calendar-datepicker';
export function CalendarComponent(){
    const gregorianToday = utils().getToday(); //This will set the current day
    const [selectedDay, setSelectedDay] = useState(gregorianToday);//set the state to be the current date
    const myVariable ={
      datePicked : selectedDay
    };
    
    if (selectedDay!=null){//This will only execute if and only if the day is not null 
    //   console.log("This is the date picked: "+myVariable.datePicked.day)
      return(
        <>
        <Container id = "calendarWidget">  
          <div className = "calendar-wrapper ">
            <Calendar
            value={selectedDay}
            onChange={setSelectedDay}
            calendarClassName = "responsive-calendar"
            shouldHighlightWeekends
          />
          </div>
          <div className = "date-wrapper">
            <p id="date_picked">{myVariable.datePicked.month}/{myVariable.datePicked.day}/{myVariable.datePicked.year}</p>
          </div>
        </Container>
        </>
      )
    }
    else{//if for some odd reason the calendar default date is empty then an error will be shown
      return(
      <>
        <div>
          <h1>An unexpected error has occurred.</h1>
        </div>
      </>
    )
    }
}