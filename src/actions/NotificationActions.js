export const ON_SET_NOTIFICATION_INFO = "notificationReducer/ON_SET_NOTIFICATION_INFO";

export const onSetNotificationInfo = (val) => (dispatch) => {
  dispatch({
    type: ON_SET_NOTIFICATION_INFO,
    payload: val
  });
};
