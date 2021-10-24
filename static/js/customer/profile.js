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
/API USE
*/
const xhr = new XMLHttpRequest();
const method = 'GET';
const url = "../api/userdetails";
const responseType = "json";
let user_data = null;
xhr.responseType = responseType; // Let the xhr request know that its getting a json 
xhr.open(method, url, true); //This opens the request with the method and url entered
xhr.onload = function(){//onload is a property that is available on mostly modern browsers 
    if(xhr.status!=200){

    }else{
        let user_details_api = xhr.response;
        document.getElementById('first_name').value = String(user_details_api.first_name);
        document.getElementById('last_name').value = String(user_details_api.last_name);
        document.getElementById('phone_number').value = String(user_details_api.phone_number);
        console.log(user_details_api);
    }
}
xhr.send(null);//Trigger that request