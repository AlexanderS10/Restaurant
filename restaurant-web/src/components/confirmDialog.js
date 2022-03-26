import React, { useContext } from "react";
import { createContext, useState, useCallback } from "react";
export let ConfirmContext = createContext()

//the hook is established here
let useConfirm = () => {
    let [confirm, setConfirm] = useContext(ConfirmContext)
    let isConfirmed = (prompt) => {
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
                return true
            }
        )
    }
    return {
        ...confirm,
        isConfirmed
    }
}
export default useConfirm
//Context
let ConfirmContextProvider = ({ children }) => {
    let [confirm, setConfirm] = useState({
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
let ConfirmModal = () => {
    let {
        prompt = "",
        isOpen = false,
        proceed,
        cancel
    } = useConfirm()
    return (
        <>
            <div className="container-popup" id="delete-dish-popup">
                <div className="confirmation-text">
                    <p>{prompt}</p>
                </div>
                <div className="button-container">
                    <button className="cancel-button" id="cancel-delete-dish" onClick={cancel}>Cancel</button>
                    <button className="confirmation-button" id="delete-dish-btn" onClick={proceed}>Delete</button>
                </div>
            </div>
            <div className="confirm-bg" id="delete-dish-bg" onClick={cancel}></div>
        </>
    )
}