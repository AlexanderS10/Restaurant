import {searchlookup, searchlookupImageRoom} from "../api_lookup";
export function apiCreateTable(callback, data){
    searchlookup("POST", "tables/create/",callback,data)
}
export function apiCreateRoom(callback, data){
    searchlookup("POST", "rooms/create/", callback, data)
}
export async function apiAddImages(data){
    return await searchlookupImageRoom("POST", "rooms/add-image/", data)
} 