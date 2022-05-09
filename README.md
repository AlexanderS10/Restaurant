# Restaurant
Due to issues with my db I restarted the project in a new branch and deleted the old one. 
This project will be used to learn more python and django at the same time with some React.js (More like an intro), features can be changed or added over time as I acquire the experience. The system will include as many as realistic use cases and features but also unnecessary ones that can teach me more about the framework. 
The purpose is to have a fully functional website for a restaurant where there will be three types of users: Customer, Staff and Admin. 
For security when loggin in I will use django and python provided functions and change them to my needs to keep it as secure as possible while also serving my needed purpose. 
I will also experiment with CSRF tokens and JWT to see how it can be implemented with React. Although I am using react, components will be rendered by django.
I will add a user interface where customers will be able to select a date and see all the tables that are available at that time. 
Users can esily make changes and see them on real time.
Admin will be able to override reservations, add new tables and add new rooms as well as create users and reservations. For user management 
I will make use of the django admin provided as that just makes it easier at the beginning but will ultimately implement my own.
Staff will be only be able to see all reservations and make new ones or cancel previous ones. They should not be able to delete users or create new
ones from their portal unless they use the registration page.
I will make use of Django Rest Framework to build API and communicate with react. Since django will render the react components access to the APIs will be restricted to specific user types.
The reason for the use of react is to build a user interface faster than with vanilla javascript. Although mantainance of such structure is cumbersome future projects will see better structures.
Some requirements for logging and registration:
  - A customer should not be able to access the staff portal using the urls. Each view shoulf be restricted to each user type including the admin.
  - If a logged in user leaves the page to the homepage and decides to go to the login page, they will be redirected to their portal 
    so they do not have to use their credentials again.
  - If an unregistered user tries to access a view through the urls then they will be redirected to the login page with an error message.
  - If a user inputs the incorrect credentials then they will receive an error message.
  - When registering if a user tries to use an already registered email then they will get an error message saying that the email address is already in use.
  - If passwords do not match when registering an error will be thrown.
  - If BOTH the previous cases occur at the same time then both errors will be printed.
  - If a phone number is not valid an error must be shown.
  - If a user forgets their password then they can access the forgot password page where they will input their email so the system can send them their password.
    although this can be a security issue using a link is unnecessary as for both cases if an impostor tries to reset the password means they have hold of the
    user's email.

User features:
  - Users can upload a profile image for aesthetic reasons.
  - Users can change their information any time except their email.
  - Customer will have access to a calendar and room view to select and see if there is anthing available. Some pictures will be shown of the room they select instead of a per table system
  - Big events should only be made thorugh the accounts where a customer puts a request and the manager can call them and if an agreement is made the the admin can     close a room. The puspose of the account for events is just to put a request with time in advance.

Other features:
  - Menu will be dynamic and only admins can add items or delete items from the db
  - Despite django having its own admin portal I will build a new one with react 
 
Although this system can probably not be used in a real world as anyone can register with many emails and reserve the entire restaurant, measures will be timplemented such as just one reservation per day or a better email integration where a new registered user will get an email with a unique code so they can activate reservation priviledges so this way emails will have to be real. I can also include a penalty method for last minute cancelled reservations or not showing up to a reservation such as payment integration where users will get charged. Things like this will be further integrated down the road but in the case of the latter it would be a business ready integration. 
