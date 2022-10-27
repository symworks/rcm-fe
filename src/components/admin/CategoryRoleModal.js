import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../../constant/constant";
import { NotificationContextTemp } from "../../providers/NotificationProvider";
import * as yup from "yup";
import createAxios from "../../util/createAxios";
import Confirmation from "../Confirmation";

const CategoryRoleModal = React.forwardRef(({handleAddFinal, handleUpdateFinal, handleDeleteFinal, ...rest}, ref) => {
  const [show, setShow] = React.useState(false);
  const [apiType, setApiType] = React.useState("insert");
  const [deleteData, setDeleteData] = React.useState(undefined);

  const { setNotificationState } = React.useContext(NotificationContextTemp);

  const confirmationRef = React.useRef(null);

  const validationScheme = yup.object().shape({
    code: yup
    .string()
    .min(1, 'Mã vai trò bắt buộc nhập')
    .max(255, 'Mã vai trò có tối đa 255 ký tự'),
    name: yup
    .string()
    .min(1, 'Tên vai trò bắt buộc nhập')
    .max(255, 'Tên vai trò có tối đa 255 ký tự'),
  });

  const defaultValue = {
    code: '',
    name: '',
  };

  const { register, handleSubmit, reset, formState: {errors} } = useForm({
    resolver: yupResolver(validationScheme),
    defaultValue: defaultValue,
  });

  React.useImperativeHandle(ref, () => ({
    handleAdd: () => {
      reset(defaultValue);
      setApiType("insert");
      setShow(true);
    },
    handleEdit: (data) => {
      reset({
        ...defaultValue,
        ...data,
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
    if (apiType == "insert") {
      handleFinal = handleAddFinal;
      axiosInstance = axiosInstance
      .post(`/api/category_role`, data, {withCredentials: true});
    } else if (apiType == "update") {
      if (data.is_system_role == true) {
        setNotificationState({
          notificationType: "error",
          dialogText: "Không thể chỉnh sửa dữ vai trò hệ thống",
          isShow: true,
        });

        return;
      }

      handleFinal = handleUpdateFinal;
      axiosInstance = axiosInstance
      .patch(`/api/category_role`, data, {withCredentials: true});
    } else if (apiType == "delete") {
      if (data.is_system_role == true) {
        setNotificationState({
          notificationType: "error",
          dialogText: "Không thể xóa dữ vai trò hệ thống",
          isShow: true,
        });

        return;
      }

      handleFinal = handleDeleteFinal;
      axiosInstance = axiosInstance
      .delete(`/api/category_role/${data.id}`, {withCredentials: true}); 
    } else {
      console.error("something went wrong");
      return;
    }

    axiosInstance
    .then(response => {
      if (response.data.error_code == 200) {
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
    <div>
      <Confirmation
        ref={confirmationRef}
        title="Xóa Vai trò"
        detail={
          <span>
            Bạn có muốn chắc xóa Vai trò <span className="font-weight-bold">{deleteData?.name}</span> không?
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
            Vai trò
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <input
                    {...register("code")}
                    className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                    placeholder="Mã vai trò"
                    autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.code?.message}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <input
                    {...register("name")}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Tên vai trò"
                    autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </div>
              </div>
            </div>
            <div className="mt-2 d-flex justify-content-end">
              <button type="submit" className="btn btn-outline-info">Cập nhật</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
});

export default CategoryRoleModal;
