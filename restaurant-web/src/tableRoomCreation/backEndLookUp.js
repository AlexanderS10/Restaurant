import {searchlookup, searchlookupImageRoom} from "../api_lookup";
export function apiCreateTable(callback, data){
    searchlookup("POST", "tables/create/",callback,data)
}
export function apiGetTables(callback,room){
    searchlookup("GET",`tables/${room}`,callback)
}
export function apiCreateRoom(callback, data){
    searchlookup("POST", "rooms/create/", callback, data)
}

export function apiUpdateTableList(callback, data){
    searchlookup("PATCH","tables/update-list/", callback, data)
}

export async function apiAddImages(data){
    return await searchlookupImageRoom("POST", "rooms/add-image/", data)
} 
