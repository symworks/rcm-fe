import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../../constant/constant";
import { NotificationContextTemp } from "../../providers/NotificationProvider";
import createAxios from "../../util/createAxios";
import ControlledSelect from "../RcmSelect/ControlledSelect";

const UserModalInsert = React.forwardRef((props, ref) => {
  const [show, setShow] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const {setNotificationState} = React.useContext(NotificationContextTemp);

  const validationScheme = yup.object().shape({
    name: yup
    .string()
    .min(1, "Tên người dùng bắt buộc nhập")
    .max(255, "Tên người dùng có tối đa 255 ký từ"),
    email: yup
    .string()
    .min(1, "Email bắt buộc nhập")
    .max(255, "Email có tối đa 255 ký từ"),
    status: yup
    .object()
    .shape({
      value: yup.number().required("Trạng thái bắt buộc nhập"),
      label: yup.string().required("Trạng thái bắt buộc nhập"),
    })
    .nullable()
    .required("Trạng thái bắt buộc nhập"),
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
  const statusOpts = [
    {
      value: 0,
      label: "Đang hoạt động"
    },
    {
      value: 1,
      label: "Tắt hoạt động"
    },
    {
      value: 2,
      label: "Chưa xác thực"
    }
  ];

  const defaultValue = {
    name: "",
    email: "",
    status: statusOpts[0],
    password: "",
    confirmation_password: "",
  }

  const {register, handleSubmit, reset, formState: {errors}, control} = useForm({
    resolver: yupResolver(validationScheme),
    defaultValues: defaultValue,
  });

  React.useImperativeHandle(ref, () => ({
    handleAdd: () => {
      reset(defaultValue);
      setShow(true);
    }
  }));

  const onSubmit = data => {
    setIsSubmitting(true);
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .post('/api/user', data, {withCredentials: true})
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
            Người dùng
          </div>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <input
                    {...register("name")}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Tên tài khoản"
                    autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <input
                    {...register("email")}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Email"
                    autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <ControlledSelect
                    name="status"
                    placeholder="Chọn trạng thái"
                    onChangeInteract={() => {}}
                    options={statusOpts}
                    control={control}
                  />
                  <div className="text-danger"><small>{errors.status?.message || errors.status?.label.message}</small></div>
                </div>
              </div>
            </div>
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

export default UserModalInsert;
