import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({children})=>{
  const[isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(()=>{
    const auth = localStorage.getItem("isAuth")
    setIsAuthenticated(!!auth)
  }, [])

  const login = () => {
    localStorage.setItem("isAuth", "true")
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("isAuth")
    setIsAuthenticated(false)
  }

  return(
    <AuthContext.Provider value={{isAuthenticated, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);