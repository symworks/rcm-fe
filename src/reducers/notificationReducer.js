import {
  ON_SET_NOTIFICATION_INFO,
} from "../actions/NotificationActions";

const initialState = {
  notificationType: "info",
  position: "bottom-right",
  dialogText: "",
  isShow: false,
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ON_SET_NOTIFICATION_INFO: {
      return {
        ...state,
        ...action.payload,
      }
    }
    default:
      return state;
  }
}

export default notificationReducer;
