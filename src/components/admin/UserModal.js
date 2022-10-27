import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { REACT_APP_PUBLIC_BACKEND_URL, REGEX_EMAIL } from "../../constant/constant";
import { NotificationContextTemp } from "../../providers/NotificationProvider";
import * as yup from "yup";
import createAxios from "../../util/createAxios";
import Confirmation from "../Confirmation";
import ControlledSelect from "../RcmSelect/ControlledSelect";

const UserModal = React.forwardRef(({handleUpdateFinal, handleDeleteFinal, ...rest}, ref) => {
  const [show, setShow] = React.useState(false);
  const [apiType, setApiType] = React.useState("update");
  const [deleteData, setDeleteData] = React.useState(undefined);

  const { setNotificationState } = React.useContext(NotificationContextTemp);

  const confirmationRef = React.useRef(null);

  const validationScheme = yup.object().shape({
    name: yup
    .string()
    .min(1, "Tên người dùng bắt buộc nhập")
    .max(255, "Tên người dùng có tối đa 255 ký tự"),
    email: yup
    .string()
    .min(1, "Email bắt buộc nhập")
    .max(255, "Email có tối đa 255 ký tự")
    .matches(REGEX_EMAIL, "Email không hợp lệ"),
    status: yup
    .object()
    .shape({
      value: yup.number().required("Trạng thái bắt buộc chọn"),
      label: yup.string().required("Trạng thái bắt buộc chọn")
    })
    .nullable()
    .required("Trạng thái bắt buộc chọn"),
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
  };

  const { register, handleSubmit, reset, formState: {errors}, control } = useForm({
    resolver: yupResolver(validationScheme),
    defaultValue: defaultValue,
  });

  React.useImperativeHandle(ref, () => ({
    handleEdit: (data) => {
      reset({
        ...defaultValue,
        ...data,
        status: statusOpts.find(item => data.status === item.value)
      })
      setApiType("update");
      setShow(true);
    },
    handleDelete: (data) => {
      setDeleteData(data);
      setApiType("delete");
      confirmationRef.current && confirmationRef.current.handleOpen();
    }
  }));

  const onSubmit = data => {
    var axiosInstance = createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    var handleFinal = undefined;
    if (apiType === "update") {
      handleFinal = handleUpdateFinal;
      axiosInstance = axiosInstance
      .patch(`/api/user`, data, {withCredentials: true});
    } else if (apiType === "delete") {
      handleFinal = handleDeleteFinal;
      axiosInstance = axiosInstance
      .delete(`/api/user/${data.id}`, {withCredentials: true}); 
    } else {
      console.error("something went wrong");
      return;
    }

    axiosInstance
    .then(response => {
      if (response.data.error_code === 200) {
        setShow(false);
        setNotificationState({
          notificationType: "info",
          dialogText: "Thao tác thành công",
          isShow: true,
        });

        if (handleFinal) {
          handleFinal();
        }

        return;
      }

      //
      setNotificationState({
        notificationType: "error",
        dialogText: response.data.msg,
        isShow: true,
      });
    })
    .catch(error => {
      console.error(error);
    });
  }

  const handleOnYesDelete = () => {
    onSubmit(deleteData);
  }

  return (
    <div {...rest}>
      <Confirmation
        ref={confirmationRef}
        title="Xóa người dùng"
        detail={
          <span>
            Bạn có muốn chắc người dùng <span className="font-weight-bold">{deleteData?.name}</span> không?
          </span>
        }
        handleOnYes={handleOnYesDelete}
        handleOnNo={() => {}}
      />
      <Modal
        show={show}
        onHide={() => {setShow(false);}}
        backdrop="static"
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <div className="h5 font-weight-bold">
            Người dùng
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                <ControlledSelect
                  name="status"
                  placeholder="Chọn trạng thái"
                  onChangeInteract={() => {}}
                  options={statusOpts}
                  control={control}
                />
              </div>
            </div>
            <div className="mt-3 d-flex justify-content-end">
              <button type="submit" className="btn btn-outline-info">Cập nhật</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
});

export default UserModal;
