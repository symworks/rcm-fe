import React from 'react';

export const NotificationContextTemp = React.createContext({
  notificationState: undefined,
  setNotificationState: undefined
});

export const NotificationContextProvider = ({children}) => {
  const [notificationState, setNotificationState] = React.useReducer((state, newState) => ({
    ...state,
    ...newState,
  }),
  {
    notificationType: "info",
    position: "bottom-right",
    dialogText: "",
    isShow: false,
  })

  return (
    <NotificationContextTemp.Provider value={{notificationState, setNotificationState}}>
      {children}
    </NotificationContextTemp.Provider>
  )
};
