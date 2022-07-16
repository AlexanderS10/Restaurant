import {searchlookup} from "../api_lookup";
export function apiCreateTable(callback, data){
    searchlookup("POST", "tables/create/",callback,data)
}
export function apiCreateRoom(callback, data){
    searchlookup("POST", "rooms/create/", callback, data)
}
export function apiAddImages(callback, data){
    searchlookup("POST", "rooms/add-image/", callback, data)
}