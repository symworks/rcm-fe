import createAxios from "../util/createAxios";
import React from "react";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../constant/constant";

export const AuthContextTemp = React.createContext({
  authState: undefined,
  setAuthState: undefined,
});

export const AuthContextProvider = ({children}) => {
  const [authState, setAuthState] = React.useReducer((state, newState) => ({
    ...state,
    ...newState,
  }),
  {
    isLoading: true,
    isLoggedin: false,
    myUserInfo: undefined,
  });

  React.useEffect(() => {
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get('/api/user/self', {withCredentials: true})
    .then(response => {
      if (response.data.error_code == 200) {
        setAuthState({
          isLoading: false,
          isLoggedin: true,
          myUserInfo: response.data.payload,
        });

        return;
      }

      setAuthState({
        isLoading: false,
        isLoggedin: false,
        myUserInfo: undefined,
      })
    })
  }, []);

  return (
    <AuthContextTemp.Provider value={{authState, setAuthState}}>
      {children}
    </AuthContextTemp.Provider>
  )
}