import React from "react";
import { Toast } from "react-bootstrap";
import { NotificationContextTemp } from "../providers/NotificationProvider";

const Notification = ({...rest}) => {
  const { notificationState, setNotificationState } = React.useContext(NotificationContextTemp);

  return (
    <div {...rest}>
      <Toast
        id="toast-container"
        show={notificationState?.isShow}
        onClose={() => {setNotificationState({isShow: false})}}
        className={`toast-${notificationState?.notificationType} toast-${notificationState?.position}`}
        autohide
      >
        <Toast.Body className={`toast-${notificationState?.notificationType} mb-0 ml-0`}>
          <strong className="mr-auto"> {notificationState?.dialogText} </strong>
          <button className="toast-close-button" onClick={() => {setNotificationState({isShow: true})}}>
            x
          </button>
        </Toast.Body>
      </Toast>
    </div>
  );
}

export default Notification;
