import React from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../../assets/images/logo-white.svg";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { REACT_APP_PUBLIC_BACKEND_URL, REGEX_EMAIL } from "../../constant/constant";
import createAxios from "../../util/createAxios";
import { useHistory } from "react-router-dom";
import { AuthContextTemp } from "../../providers/AuthContextProvider";

const Registration = () => {
  const history = useHistory();
  const { authState } = React.useContext(AuthContextTemp);

  React.useLayoutEffect(() => {
    if (authState.isLoggedin) {
      history.push('/rcm');
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
  }, [authState]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validationScheme = yup.object().shape({
    name: yup.string()
    .min(1, 'Tên bắt buộc nhập'),
    email: yup.string()
    .min(1, 'Email bắt buộc nhập')
    .matches(REGEX_EMAIL, 'Email không hợp lệ'),
    password: yup.string()
    .min(1, 'Mật khẩu bắt buộc nhập'),
    password_confirmation: yup.string()
    .min(1, 'Mật khẩu xác thực bắt buộc nhập')
  });

  const defaultValue = {
    email: '',
    password: '',
  }

  const { register, handleSubmit, reset, formState: {errors} } = useForm({
    resolver: yupResolver(validationScheme),
    defaultValue: defaultValue,
  });

  const onSubmit = data => {
    setIsSubmitting(true);
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .post('/api/register', data, {withCredentials: true})
    .then(response => {
      setIsSubmitting(false);
      history.push('/login');
    })
    .catch(error => {
      console.error(error);
      setIsSubmitting(false);
    });
  }

  return (
    <div className="theme-cyan">
      <div >
        <div className="vertical-align-wrap">
          <div className="vertical-align-middle auth-main">
            <div className="auth-box">
              <div className="top">
                <img src={Logo} alt="Lucid" style={{ height: "40px", margin: "10px" }} />
              </div>
              <div className="card">
                <div className="header">
                  <p className="lead">Tạo tài khoản</p>
                </div>
                <div className="body">
                  <form
                    className="form-auth-small ng-untouched ng-pristine ng-valid"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="form-group">
                      <label className="control-label sr-only">
                        Tên
                      </label>
                      <input
                        {...register("name")}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Tên của bạn"
                        autoComplete="off"
                      />
                    </div>
                    <div className="form-group">
                      <label className="control-label sr-only" >
                        Email
                          </label>
                      <input
                        {...register("email")}
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="signup-email"
                        placeholder="Email của bạn"
                      />
                      <div className="invalid-feedback">{errors.email?.message}</div>
                    </div>
                    <div className="form-group">
                      <label className="control-label sr-only" >
                        Mật khẩu
                          </label>
                      <input
                        {...register("password")}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Mật khẩu"
                        type="password"
                      />
                      <div className="invalid-feedback">{errors.password?.message}</div>
                    </div>
                    <div className="form-group">
                      <label className="control-label sr-only" >
                        Mật khẩu xác thực
                          </label>
                      <input
                        {...register("password_confirmation")}
                        className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                        placeholder="Mật khẩu xác thực"
                        type="password"
                      />
                      <div className="invalid-feedback">{errors.password_confirmation?.message}</div>
                    </div>
                    <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={isSubmitting}>
                      ĐĂNG KÝ
                      </button>
                    <div className="bottom">
                      <span className="helper-text">
                        Đã có tài khoản?{" "}
                        <a href="login">Đăng nhập</a>
                      </span>
                    </div>
                  </form>
                  <div className="separator-linethrough">
                    <span>HOẶC</span>
                  </div>
                  <button className="btn btn-signin-social">
                    <i className="fa fa-facebook-official facebook-color"></i>
                    Đăng nhập với Facebook
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Registration.propTypes = {
};

const mapStateToProps = ({ loginReducer }) => ({
});

export default connect(mapStateToProps, {
})(Registration);
