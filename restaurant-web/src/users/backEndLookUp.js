import {searchlookup, searchlookupLink } from "../api_lookup";
export function apiFetchUsersInfo(callback){
    searchlookup("GET", "users/",callback)
}
export function apiFetchLinkInfo(endpoint,callback){
    searchlookupLink("GET",endpoint,callback )
}
export function apiSearchUser(endpoint, callback){
    searchlookup("GET",`users/?search=${endpoint}`,callback)
}