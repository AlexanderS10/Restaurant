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
const csrftoken = getCookie('csrftoken');
// console.log("This is the token: "+csrftoken)

/*
/NAVBAR FUNCTIONALITY
*/
const navbarToggle = navbar.querySelector("#navbar-toggle");
const navbarMenu = document.querySelector("#navbar-menu");
const navbarLinksContainer = navbarMenu.querySelector(".navbar-links");
let isNavbarExpanded = navbarToggle.getAttribute("aria-expanded") === "true";
const toggleNavbarVisibility = () => {
  isNavbarExpanded = !isNavbarExpanded;
  navbarToggle.setAttribute("aria-expanded", isNavbarExpanded);
};
navbarToggle.addEventListener("click", toggleNavbarVisibility);
navbarLinksContainer.addEventListener("click", (e) => e.stopPropagation());
navbarMenu.addEventListener("click", toggleNavbarVisibility);

/*
/Catch and send the calendar date to the backend
*/
//Grab the element in the p tag
let form = document.getElementById("form-date");
let form2 = document.getElementById("form-date2");
function setDate() {  
    let date = document.getElementById('date_picked').textContent;
    document.getElementById("form-date").action = "book-event/"+String(date)+"/"
    // document.getElementById("date-set").value=String(date) // here an input value is modified 
    form.submit();
    //console.log("This is the date: "+inputTemp);
}  
function setDate2() {  
    let date = document.getElementById('date_picked').textContent;
    document.getElementById("form-date2").action = "book-table/"+String(date)+"/"
    form2.submit();
    //console.log("This is the date: "+inputTemp);
}  