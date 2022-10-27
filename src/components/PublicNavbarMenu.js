import React from "react";
import Logo from "../assets/images/logo.svg";
import LogoWhite from "../assets/images/logo-white.svg";
import PropTypes from "prop-types";
import {
  onPressThemeColor,
  onPressNotification,
  onPressEqualizer,
} from "../actions";
import {
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";

import { connect } from "react-redux";

class PublicNavbarMenu extends React.Component {
  render() {    
    const {
      themeColor,
      toggleNotification,
      toggleEqualizer,
    } = this.props;
    // var path = window.location.pathname;
    document.body.classList.add(themeColor);

    return (
      <div>
        <nav className="navbar navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-btn">
              <button
                className="btn-toggle-offcanvas"
                onClick={() => {
                  this.props.onPressSideMenuToggle();
                }}
              >
                <i className="lnr lnr-menu fa fa-bars"></i>
              </button>
            </div>

            <div className="navbar-brand">
              <a href="dashboard">
                <img
                  src={
                    document.body.classList.contains("full-dark")
                      ? LogoWhite
                      : Logo
                  }
                  alt="Lucid Logo"
                  className="img-responsive logo"
                />
              </a>
            </div>

            <div className="navbar-right">
              <form id="navbar-search" className="navbar-form search-form">
                <input
                  className="form-control"
                  placeholder="Search here..."
                  type="text"
                />
                <button type="button" className="btn btn-default">
                  <i className="icon-magnifier"></i>
                </button>
              </form>

              <div id="navbar-menu">
                <ul className="nav navbar-nav">
                  <li>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip>
                          Gọi mua hàng
                        </Tooltip>
                      }
                    >
                        <a
                          href="#!"
                          className="icon-menu d-none d-sm-block d-md-none d-lg-block"
                        >
                          <i className="fa fa-phone"></i>
                        </a>
                    </OverlayTrigger>
                  </li>

                  <li>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip>
                          Cửa hàng gần bạn
                        </Tooltip>
                      }
                    >
                      <a
                        href="#!"
                        className="icon-menu d-none d-sm-block d-md-none d-lg-block"
                      >
                        <i className="fa fa-map-marker"></i>
                      </a>
                    </OverlayTrigger>
                  </li>

                  <li>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip>
                          Đăng nhập
                        </Tooltip>
                      }
                    >
                      <a
                        href="#!"
                        className="icon-menu d-none d-sm-block d-md-none d-lg-block"
                      >
                        <i className="icon icon-user"></i>
                      </a>
                    </OverlayTrigger>
                  </li>

                  <li>
                    <a
                      href="filedocuments"
                      className="icon-menu d-none d-sm-block d-md-none d-lg-block"
                    >
                      <i className="fa fa-folder-open-o"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="appcalendar"
                      className="icon-menu d-none d-sm-block d-md-none d-lg-block"
                    >
                      <i className="icon-calendar"></i>
                    </a>
                  </li>
                  <li>
                    <a href="appchat" className="icon-menu d-none d-sm-block">
                      <i className="icon-bubbles"></i>
                    </a>
                  </li>
                  <li>
                    <a href="appinbox" className="icon-menu d-none d-sm-block">
                      <i className="icon-envelope"></i>
                      <span className="notification-dot"></span>
                    </a>
                  </li>
                  <li
                    className={
                      toggleNotification ? "show dropdown" : "dropdown"
                    }
                  >
                    <a
                      href="#!"
                      className="dropdown-toggle icon-menu"
                      data-toggle="dropdown"
                      onClick={(e) => {
                        e.preventDefault();
                        this.props.onPressNotification();
                      }}
                    >
                      <i className="icon-bell"></i>
                      <span className="notification-dot"></span>
                    </a>
                    <ul
                      className={
                        toggleNotification
                          ? "dropdown-menu notifications show"
                          : "dropdown-menu notifications"
                      }
                    >
                      <li className="header">
                        <strong>You have 4 new Notifications</strong>
                      </li>
                      <li>
                        <a href="#!">
                          <div className="media">
                            <div className="media-left">
                              <i className="icon-info text-warning"></i>
                            </div>
                            <div className="media-body">
                              <p className="text">
                                Campaign <strong>Holiday Sale</strong> is nearly
                                reach budget limit.
                              </p>
                              <span className="timestamp">10:00 AM Today</span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="#!">
                          <div className="media">
                            <div className="media-left">
                              <i className="icon-like text-success"></i>
                            </div>
                            <div className="media-body">
                              <p className="text">
                                Your New Campaign <strong>Holiday Sale</strong>{" "}
                                is approved.
                              </p>
                              <span className="timestamp">11:30 AM Today</span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="#!">
                          <div className="media">
                            <div className="media-left">
                              <i className="icon-pie-chart text-info"></i>
                            </div>
                            <div className="media-body">
                              <p className="text">
                                Website visits from Twitter is 27% higher than
                                last week.
                              </p>
                              <span className="timestamp">04:00 PM Today</span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="#!">
                          <div className="media">
                            <div className="media-left">
                              <i className="icon-info text-danger"></i>
                            </div>
                            <div className="media-body">
                              <p className="text">
                                Error on website analytics configurations
                              </p>
                              <span className="timestamp">Yesterday</span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li className="footer">
                        <a className="more" href="#!">See all notifications</a>
                      </li>
                    </ul>
                  </li>
                  <li
                    className={toggleEqualizer ? "show dropdown" : "dropdown"}
                  >
                    <a
                      href="#!"
                      className="dropdown-toggle icon-menu"
                      data-toggle="dropdown"
                      onClick={(e) => {
                        e.preventDefault();
                        this.props.onPressEqualizer();
                      }}
                    >
                      <i className="icon-equalizer"></i>
                    </a>
                    <ul
                      className={
                        toggleEqualizer
                          ? "dropdown-menu user-menu menu-icon show"
                          : "dropdown-menu user-menu menu-icon"
                      }
                    >
                      <li className="menu-heading">ACCOUNT SETTINGS</li>
                      <li>
                        <a href="#!">
                          <i className="icon-note"></i> <span>Basic</span>
                        </a>
                      </li>
                      <li>
                        <a href="#!">
                          <i className="icon-equalizer"></i>{" "}
                          <span>Preferences</span>
                        </a>
                      </li>
                      <li>
                        <a href="#!">
                          <i className="icon-lock"></i> <span>Privacy</span>
                        </a>
                      </li>
                      <li>
                        <a href="#!">
                          <i className="icon-bell"></i>{" "}
                          <span>Notifications</span>
                        </a>
                      </li>
                      <li className="menu-heading">BILLING</li>
                      <li>
                        <a href="#!">
                          <i className="icon-credit-card"></i>{" "}
                          <span>Payments</span>
                        </a>
                      </li>
                      <li>
                        <a href="#!">
                          <i className="icon-printer"></i> <span>Invoices</span>
                        </a>
                      </li>
                      <li>
                        <a href="#!">
                          <i className="icon-refresh"></i> <span>Renewals</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="login" className="icon-menu">
                      <i className="icon-login"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}


PublicNavbarMenu.propTypes = {
  themeColor: PropTypes.string.isRequired,
  toggleNotification: PropTypes.bool.isRequired,
  toggleEqualizer: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ navigationReducer }) => {
  const {
    themeColor,
    toggleNotification,
    toggleEqualizer,
  } = navigationReducer;
  return {
    themeColor,
    toggleNotification,
    toggleEqualizer,
  };
};

export default connect(mapStateToProps, {
  onPressThemeColor,
  onPressNotification,
  onPressEqualizer,
})(PublicNavbarMenu);
