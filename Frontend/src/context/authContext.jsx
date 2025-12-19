import { createContext } from "react";
import api from "../api/axios";
import { useState , useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user , setUser] = useState(null);
    const [loading , setLoading ] = useState(true)
    const fetchUser = async () => {
        try {
            const res = await api.get('/user/');
            setUser(res.data.data.user)
        } catch (error) {
            setUser(null);
            console.log("ERROR : " , error);    
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUser();
    } , [])

    return (
        <AuthContext.Provider value={{user , setUser , loading}}>
            {children}
        </AuthContext.Provider>
    )
}