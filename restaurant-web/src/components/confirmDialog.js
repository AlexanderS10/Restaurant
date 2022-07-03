import React, { useContext, useEffect } from "react";
import { createContext, useState } from "react";
export let ConfirmContext = createContext()

//the hook is established here
export function useConfirm() {
    let [confirm, setConfirm] = useContext(ConfirmContext)
    let [needsCleanup, setNeedsCleanUp] = useState(false)
    let isConfirmed = (prompt) => {//This will get called in the component to be used which will activate the modal and make use of the context provider
        setNeedsCleanUp(true)
        let promise = new Promise((resolve, reject) => {
            setConfirm({
                prompt,
                isOpen: true,
                proceed: resolve,
                cancel: reject
            })
        })
        return promise.then(
            () => {
                setConfirm({ ...confirm, isOpen: false })
                return true
            },
            () => {
                setConfirm({ ...confirm, isOpen: false })
                return false
            }
        )
    }
    useEffect(()=>{
        return()=>{
            if(confirm.cancel && needsCleanup){
                confirm.cancel()
            }
        }
    },[confirm, needsCleanup])
    return {//return the values so the component has access to them
        ...confirm,
        isConfirmed
    }
}

//Context
export function ConfirmContextProvider({children}) {
    let [confirm, setConfirm] = useState({//Passes vales to be used by any child in the tree so it does not have to be passed explicitly
        prompt: "",
        isOpen: false,
        proceed: null,
        cancel: null
    })
    return (
        <ConfirmContext.Provider value={[confirm, setConfirm]}>
            {children}
        </ConfirmContext.Provider>
    )
}

//Modal is established here
export function ConfirmModal(){
    let {
        prompt = "",
        isOpen = false,
        proceed,
        cancel
    } = useConfirm()
    useEffect(()=>{

    },[])
    if(isOpen===true){
        let bg = document.getElementById("delete-dish-bg")
        let box = document.getElementById("delete-dish-popup")
        if(bg && box){
            bg.style.display = "flex"
            box.style.display = "flex"
        
        }
    }
    else if (isOpen===false){
        let bg = document.getElementById("delete-dish-bg")
        let box = document.getElementById("delete-dish-popup")
        if(bg && box){
            bg.style.display = "none"
            box.style.display = "none"
        }
    }
    return (
        <>
            <div className="container-popup-2" id="delete-dish-popup">
                <div className="confirmation-text-2">
                    <p>{prompt}</p>
                </div>
                <div className="button-container">
                    <button className="cancel-button" id="cancel-delete-dish" onClick={cancel}>Cancel</button>
                    <button className="confirmation-button" id="delete-dish-btn" onClick={proceed}>Delete</button>
                </div>
            </div>
            <div className="confirm-bg-2" id="delete-dish-bg" onClick={cancel}></div>
        </>
    )
}
