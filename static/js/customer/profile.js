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
        document.getElementById('email_address').value = String(user_details_api.email);
        let date_joined = new Date(user_details_api.date_joined);
        let options = {weekday: 'long', year:'numeric', month:'long',day: 'numeric'};
        let date_display=String(date_joined.toLocaleString('en-US',options)).split(',');
        document.getElementById("date-joined").textContent = date_display[0]+date_display[1]+","+date_display[2];
        // console.log("This is the date joined: "+date_joined.toISOString().split('T')[0])
        // document.getElementById('first_name').value = String(user_details_api.first_name);
        // document.getElementById('last_name').value = String(user_details_api.last_name);
        // document.getElementById('phone_number').value = String(user_details_api.phone_number);
        // console.log(user_details_api);
    }
}
xhr.send(null);//Trigger that request
/*
/PASSWORD CHANGE
*/
document.getElementById("id_old_password").classList.add("form-control");
document.getElementById("id_new_password1").classList.add("form-control");
document.getElementById("id_new_password2").classList.add("form-control");

/*
/IMAGE INPUT
*/
//Get the input tag
let imageInput = document.querySelector('#id_image');
imageInput.addEventListener('change', (e)=>{
    //Get the selected image
    let [file]=e.target.files; //destructuring is used to unpack values from arrays or properties from objects into distinct values
    // console.log(e.target.files)
    // for (var field in file){
    //     console.log(field)
    // }
    //Get the image name
    let fileName=file.name;
    //add the name to the p tag
    document.querySelector('.file-name').textContent=fileName;
});