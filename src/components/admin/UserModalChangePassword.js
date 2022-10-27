import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../../constant/constant";
import { NotificationContextTemp } from "../../providers/NotificationProvider";
import createAxios from "../../util/createAxios";

const UserModalChangePassword = React.forwardRef((props, ref) => {
  const [show, setShow] = React.useState(false);
  const [userData, setUserData] = React.useState(undefined);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const {setNotificationState} = React.useContext(NotificationContextTemp);

  React.useImperativeHandle(ref, () => ({
    handleChangePassword: (data) => {
      setUserData(data);
      setShow(true);
    }
  }));

  const validationScheme = yup.object().shape({
    password: yup
    .string()
    .min(1, "Mật khẩu bắt buộc nhập")
    .max(255, "Tối đa 255 ký tự"),
    confirmation_password: yup
    .string()
    .min(1, "Mật khẩu xác thực bắt buộc nhập")
    .max(255, "Tối đa 255 ký tự")
    .oneOf([yup.ref('password'), null], "Mật khẩu xác thực không chính xác")
  });

  const defaultValue = {
    password: "",
    confirmation_password: "",
  }

  const {register, handleSubmit, reset, formState: {errors}} = useForm({
    resolver: yupResolver(validationScheme),
    defaultValues: defaultValue,
  });

  const onSubmit = data => {
    setIsSubmitting(true);
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .patch('/api/user/change_password', {
      ...data,
      id: userData.id,
    }, {withCredentials: true})
    .then(response => {
      setShow(false);
      if (response.data.error_code === 200) {
        setNotificationState({
          notificationType: "info",
          dialogText: "Thao tác thành công",
          isShow: true,
        })
      } else {
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
    <div>
      <Modal
        show={show}
        onHide={() => {setShow(false);}}
        centered
        size="lg"        
      >
        <Modal.Header closeButton>
          <div className="h5 font-weight-bold">
            Đổi mật khẩu
          </div>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <input
                    {...register("password")}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Nhập mật khẩu"
                    autoComplete="off"
                    type="password"
                  />
                  <div className="invalid-feedback">{errors.password?.message}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <input
                    {...register("confirmation_password")}
                    className={`form-control ${errors.confirmation_password ? 'is-invalid' : ''}`}
                    placeholder="Nhập mật khẩu xác thực"
                    autoComplete="off"
                    type="password"
                  />
                  <div className="invalid-feedback">{errors.confirmation_password?.message}</div>
                </div>
              </div>
            </div>    
          </Modal.Body>
          <Modal.Footer>
            <div>
              <button type="submit" className="btn btn-outline-info" disabled={isSubmitting}>Cập nhật</button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>

    </div>
  );
});

export default UserModalChangePassword;
