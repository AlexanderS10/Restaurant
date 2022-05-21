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
export function apiGetUserInfo(endpoint, callback){
    searchlookup("GET", `users/${endpoint}`, callback)
}
export function apiUpdateAndDeleteUser(method, endpoint, callback,data){
    searchlookup(method, `users/${endpoint}/`,callback,data)
}
export function apiResetProfileImage(callback, data){
    searchlookup("PUT", "reset_profile/",callback,data)
}