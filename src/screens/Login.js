import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../assets/images/logo-white.svg";
import * as yup from 'yup';
import { REACT_APP_PUBLIC_BACKEND_URL, REGEX_EMAIL } from "../constant/constant";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import createAxios from "../util/createAxios";
import { AuthContextTemp } from "../providers/AuthContextProvider";
import { NotificationContextTemp } from "../providers/NotificationProvider";

const qs = require('query-string');

const Login = (props) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { setNotificationState } = React.useContext(NotificationContextTemp);

  const history = useHistory();
  const parsed = qs.parse(window.location.search);
  const { authState, setAuthState } = React.useContext(AuthContextTemp);

  React.useLayoutEffect(() => {
    if (authState.isLoggedin) {
      if (parsed.next) {
        history.push(parsed.next);
      } else {
        history.push('/rcm');
      }

      return;
    }

    if (!authState.isLoading) {
      document.body.classList.remove("theme-cyan");
      document.body.classList.remove("theme-purple");
      document.body.classList.remove("theme-blue");
      document.body.classList.remove("theme-green");
      document.body.classList.remove("theme-orange");
      document.body.classList.remove("theme-blush");
    }
  }, []);

  const validationScheme = yup.object().shape({
    email: yup
    .string()
    .min(1, 'Email bắt buộc nhập')
    .matches(REGEX_EMAIL, 'Email không hợp lệ'),
    password: yup
    .string()
    .min(1, 'Mật khẩu bắt buộc nhập'),
    remember_me: yup
    .boolean(),
  });

  const { register, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(validationScheme),
  });

  const onSubmit = submitData => {
    setIsSubmitting(true);
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .post('/api/login', submitData, {withCredentials: true})
    .then(response => {
      if (response.data.error_code == 200) {
        setAuthState({
          isLoggedin: true,
          myUserInfo: response.data.payload,
        });

        if (parsed.next) {
          history.push(parsed.next);
        } else {
          history.push('/rcm');
        }

      } else {
        setAuthState({
          isLoggedin: false,
          myUserInfo: undefined,
        });

        setNotificationState({
          notificationType: "error",
          dialogText: response.data.msg,
          isShow: true,
        })
      }

      setIsSubmitting(false);
    })
    .catch(error => {
      console.error(error);
      setIsSubmitting(false);
    })
  }

  return (
    <div className="theme-cyan">
      <div className="page-loader-wrapper" style={{ display: authState.isLoading ? 'block' : 'none' }}>
        <div className="loader">
          <div className="m-t-30"><img src={require('../assets/images/logo-icon.svg')} width="48" height="48" alt="Lucid" /></div>
          <p>Please wait...</p>
        </div>
      </div>
      <div className="hide-border">
        <div className="vertical-align-wrap">
          <div className="vertical-align-middle auth-main">
            <div className="auth-box">
              <div className="top">
                <img src={Logo} alt="Lucid" style={{ height: "40px", margin: "10px" }} />
              </div>
              <div className="card">
                <div className="header">
                  <p className="lead">Đăng nhập hệ thống</p>
                </div>
                <div className="body">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-auth-small" action="index.html">
                      <div className="form-group">
                        <input
                          {...register("email")}
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          placeholder="Email"
                        />
                        <div className="invalid-feedback">{errors.email?.message}</div>
                      </div>
                      <div className="form-group">
                        <input
                          {...register("password")}
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          placeholder="Mật khẩu"
                          type="password"
                        />
                        <div className="invalid-feedback">{errors.password?.message}</div>
                      </div>
                      <div className="form-group clearfix">
                        <label className="fancy-checkbox element-left">
                          <input
                            {...register("remember_me")}
                            type="checkbox"
                          />
                          <span>Ghi nhớ đăng nhập</span>
                        </label>
                      </div>
                      <button
                        className="btn btn-primary btn-lg btn-block"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Đăng nhập
                      </button>
                      <div className="bottom">
                        <span className="helper-text m-b-10">
                          <i className="fa fa-lock"></i>{" "}
                          <a href={`${process.env.PUBLIC_URL}/forgotpassword`} 
                          >
                            Quên mật khẩu?
                          </a>
                        </span>
                        <span>
                          Bạn không có tài khoản?{" "}
                          <a href="registration">Đăng ký</a>
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
}

export default Login;
