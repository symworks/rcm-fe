import { combineReducers } from "redux";
import navigationReducer from "./navigationReducer";
import analyticalReducer from "./analyticalReducer";
import demographicReducer from "./demographicReducer";
import ioTReducer from "./ioTReducer";
import mailInboxReducer from "./mailInboxReducer";
import notificationReducer from "./notificationReducer";
import UIElementsReducer from "./UIElementsReducer";

export default combineReducers({
  navigationReducer: navigationReducer,
  analyticalReducer: analyticalReducer,
  demographicReducer: demographicReducer,
  ioTReducer: ioTReducer,
  mailInboxReducer: mailInboxReducer,
  notificationReducer: notificationReducer,
  UIElementsReducer: UIElementsReducer,
});
