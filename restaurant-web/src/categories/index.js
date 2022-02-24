import {Category, CategoriesList,MessagesComponent } from "./components";

export{
    Category, 
    CategoriesList,
    MessagesComponent,
}

// export function OptionBtn(props) {
//     let { category, action } = props
//     let actionDisplay = action.display ? action.display : "Other"
//     let display = action.type === "delete" ? `${actionDisplay}` : actionDisplay
//     let handleDeleteClick = (event) => {
//         event.preventDefault()
//         let handleDeleteBackend = (response, status) => {
//             if (status === 202) {
//                 props.actionFunction(response, status)
//             }
//             else {
//                 alert("Action error")
//             }
//         }
//         apiDeleteCategory(category.id, handleDeleteBackend)
//     }
//     return (
//         action.type === "delete" ? <button className={props.className} onClick={handleDeleteClick}>{display}</button> : <button className={props.className} onClick={props.updateFunction}>{display}</button>
//     )
// }