import React from "react";
import { connect } from "react-redux";
import { Toast } from "react-bootstrap";
import { onSetNotificationInfo } from "../actions";

const Notification = (props) => {
  const { notificationType, position, dialogText, isShow } = props;
  
  React.useEffect(() => {
    console.log('init data: ', notificationType, position, dialogText, isShow);
  }, []);

  return (
    <Toast
      id="toast-container"
      show={isShow}
      onClose={() => {props.onSetNotificationInfo({
        isShow: false,
      })}}
      className={`toast-${notificationType} toast-${position}`}
      autohide
    >
      <Toast.Body className={`toast-${notificationType} mb-0 ml-0`}>
        <strong className="mr-auto"> {dialogText} </strong>
        <button className="toast-close-button" onClick={() => {props.onSetNotificationInfo({
          isShow: false,
        })}}>
          x
        </button>
      </Toast.Body>
    </Toast>
  );
}

const mapStateToProps = ({ notificationReducer }) => ({
  notificationType: notificationReducer.notificationType,
  position: notificationReducer.position,
  dialogText: notificationReducer.dialogText,
  isShow: notificationReducer.isShow,
});

export default connect(mapStateToProps, {
  onSetNotificationInfo,
})(Notification);
