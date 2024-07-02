import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebaseConfig';

// Auth context is used to authenticate users across the app

export const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user)=>{
            if(user){
                setIsAuthenticated(true);
                setUser(user);
            }else{
                setIsAuthenticated(false);
                setUser(null);
            }
        });
        return unsub;
    }, [])

    const login = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            return {success: true}
            
        } catch (e) {
            let msg = e.message;
            if(msg.includes("(auth/invalid-email)")) msg = "Invalid email"
            if(msg.includes("(auth/invalid-credential)")) msg = "Email address or password is incorrect!"
            return {success: false, msg};
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
            return {success: true}
        } catch (e) {
            return {success: false, msg: e.message, error: e}
        }
    }
    const register = async (email, password) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log('response.user : ', response?.user );

            return {success: true, data: response?.user};
        } catch (e) {
            let msg = e.message;
            if(msg.includes("(auth/invalid-email")) msg = "Invalid email"
            if(msg.includes("(auth/email-already-in-use")) msg = "Email is already in use"
            return {success: false, msg};
        }
    }
    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (e) {
            let msg = e.message;
            if (msg.includes("(auth/invalid-email)")) msg = "Invalid email address";
            if (msg.includes("(auth/user-not-found)")) msg = "No user found with this email address";
            return { success: false, msg };
        }
    };

    return(
        <AuthContext.Provider value={{user, isAuthenticated, login, register, logout, resetPassword}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=> {
    const value = useContext(AuthContext)

    if(!value){
        throw new Error("useAuth must be wrapped inside AuthContextProvider")
    }
    return value;
}