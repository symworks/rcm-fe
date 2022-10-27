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
    name: yup
    .string()
    .min(1, 'Tên loại sản phẩm bắt buộc nhập')
    .max(255, 'Tên loại sản phẩm có tối đa 255 ký tự'),
    ui_icon: yup
    .string()
    .min(1, 'Icon bắt buộc nhập')
    .max(255, 'Icon có tối đa 255 ký tự'),
    is_active: yup
    .string(),
  });

  const defaultValue = {
    name: '',
    ui_icon: '',
    is_active: "0",
  };

  const { register, handleSubmit, reset, formState: {errors} } = useForm({
    resolver: yupResolver(validationScheme),
    defaultValue: defaultValue,
    mode: "onChange",
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
        is_active: data.is_active.toString(),
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
      .post(`/api/product_type`, data, {withCredentials: true});
    } else if (apiType == "update") {
      handleFinal = handleUpdateFinal;
      axiosInstance = axiosInstance
      .patch(`/api/product_type`, data, {withCredentials: true});
    } else if (apiType == "delete") {
      handleFinal = handleDeleteFinal;
      axiosInstance = axiosInstance
      .delete(`/api/product_type/${data.id}`, {withCredentials: true}); 
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
        title="Xóa Loại sản phẩm"
        detail={
          <span>
            Bạn có muốn chắc xóa Loại sản phẩm <span className="font-weight-bold">{deleteData?.name}</span> không?
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
            Loại sản phẩm
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
                    placeholder="Tên loại sản phẩm"
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
                    {...register("ui_icon")}
                    className={`form-control ${errors.ui_icon ? 'is-invalid' : ''}`}
                    placeholder="Icon"
                    autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.ui_icon?.message}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    value={1}
                    id="is_active_1"
                    {...register("is_active")}
                  />
                  <label className="form-check-label font-weight-normal" htmlFor="is_active_1">Đang hoạt động</label>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    value={0}
                    id="is_active_2"
                    {...register("is_active")}
                  />
                  <label className="form-check-label font-weight-normal" htmlFor="is_active_2">Tắt hoạt động</label>
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
