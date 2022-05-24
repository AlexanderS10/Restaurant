import {searchlookup} from "../api_lookup";
export function apiCreateTable(callback, data){
    searchlookup("POST", "tables/create/",callback,data)
}