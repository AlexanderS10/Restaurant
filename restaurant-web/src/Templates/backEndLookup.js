import {searchlookup, searchlookupLink } from "../api_lookup";
export function apiLogin(callback, data){
    searchlookup("POST", "auth/login", callback, data)
}
export function apiRegisterCustomer(callback, data){
    searchlookup("POST", "auth/register", callback, data)
}