import { View, Text } from 'react-native'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from '../libs/config';


const MyContext = createContext()
const getContext = ()=>{
    return useContext(MyContext);
}
const GlobalContext = ({children}) => {
    const [user, setUser] = useState(null)
    const [name, setName] = useState(null);
    const [usrInfo,setUsrInfo]=useState("hi");
     useEffect(() => {
				const unsubscribe = onAuthStateChanged(authentication, (currentUser) => {
					setUser(currentUser);
				});

				return () => unsubscribe();
			}, []);
    // console.log("user: "+user)
  return (
    <MyContext.Provider value={{user,setUser,name,setName, setUsrInfo,usrInfo}}>
        {children}
    </MyContext.Provider>
  )
}

export {GlobalContext,getContext}