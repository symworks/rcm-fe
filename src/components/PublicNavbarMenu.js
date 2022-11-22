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
import { AuthContextTemp } from "../providers/AuthContextProvider";
import createAxios from "../util/createAxios";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../constant/constant";
import { useHistory } from "react-router-dom";

const PublicNavbarMenu = (props) => {
  const history = useHistory();
  const { authState, setAuthState } = React.useContext(AuthContextTemp);
  const {
    themeColor,
  } = props;
  // var path = window.location.pathname;
  document.body.classList.add(themeColor);
  
  const handleLogout = () => {
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .post('/api/logout', {}, {withCredentials: true})
    .then(response => {
      if (response.data.error_code == 200) {
        setAuthState({
          isLoggedin: false,
          myUserInfo: undefined,
        });

        history.push('/login');
      }
    })
    .catch(error => {
      console.log(error);
    })
  }

  return (
    <div>
      <nav className="navbar navbar-fixed-top">
        <div className="container">
          <div className="navbar-btn">
            <button
              className="btn-toggle-offcanvas"
              onClick={() => {
                props.onPressSideMenuToggle();
              }}
            >
              <i className="lnr lnr-menu fa fa-bars"></i>
            </button>
          </div>
  
          <div className="navbar-brand">
            <a href="/rcm">
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
                placeholder="Bạn cần tìm gì?"
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
  
                {
                  !authState.isLoggedin ? (
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
                          href="/login?next=/rcm"
                          className="icon-menu d-none d-sm-block d-md-none d-lg-block"
                        >
                          <i className="icon icon-user"></i>
                        </a>
                      </OverlayTrigger>
                    </li>
                  ) : (
                    <li>
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip>
                            Đăng xuất
                          </Tooltip>
                        }
                      >
                        <a className="icon-menu" href="#!" onClick={handleLogout}>
                          <i className="icon-login"></i>
                        </a>
                      </OverlayTrigger>
                    </li>
                  )
                }
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
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
