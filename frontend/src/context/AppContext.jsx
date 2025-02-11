import { createContext, useEffect, useState } from "react";
import axios from "axios"
import { toast } from "react-toastify";



export const AppContext = createContext();


export const AppContextProvider = (props) => {

    axios.defaults.withCredentials=true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL.trim();;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false)

    const getUserData = async () => {
        try {
            const url = `${backendUrl}/auth/data`
            let { data } = await axios.get(`${url}`)
            data.success? setUserData(data.userData):toast.error(data.message);

        } catch (err) {
            toast.error(err.message)
        }
    }

    const getUserState=async(req,res)=>{
        try{
            const url = `${backendUrl}/auth/isAuth`
            let { data } = await axios.get(`${url}`)
            if(data.sucess){
                setIsLoggedin(true);
                getUserData();
            }

        }catch(err){
            toast.error(err.message)
        }
    }

    useEffect(()=>{
        getUserState()
    },[])

    let value = {
        backendUrl, userData, setIsLoggedin, isLoggedin,
        setUserData,getUserData,getUserState
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
