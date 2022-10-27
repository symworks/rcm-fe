import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../../constant/constant";
import { NotificationContextTemp } from "../../providers/NotificationProvider";
import * as yup from "yup";
import createAxios from "../../util/createAxios";
import Confirmation from "../Confirmation";
import ControlledEditor from "../RcmSelect/ControlledEditor";

const ProductModal = React.forwardRef(({handleAddFinal, handleUpdateFinal, handleDeleteFinal, ...rest}, ref) => {
  const [show, setShow] = React.useState(false);
  const [apiType, setApiType] = React.useState("insert");
  const [deleteData, setDeleteData] = React.useState(undefined);

  const { setNotificationState } = React.useContext(NotificationContextTemp);

  const confirmationRef = React.useRef(null);

  const validationScheme = yup.object().shape({
    name: yup
    .string()
    .min(1, 'Tên sản phẩm bắt buộc nhập')
    .max(255, 'Tên sản phẩm có tối đa 255 ký tự'),
    top_features: yup
    .string(),
    description: yup
    .string(),
    product_info: yup
    .string(),
  });

  const defaultValue = {
    name: '',
    top_features: '',
    description: '',
    product_info: '',
  };

  const { register, handleSubmit, reset, formState: {errors}, control } = useForm({
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
    if (apiType === "insert") {
      handleFinal = handleAddFinal;
      axiosInstance = axiosInstance
      .post(`/api/product`, data, {withCredentials: true});
    } else if (apiType === "update") {
      if (data.is_system_role === true) {
        setNotificationState({
          notificationType: "error",
          dialogText: "Không thể chỉnh sửa sản phẩm",
          isShow: true,
        });

        return;
      }

      handleFinal = handleUpdateFinal;
      axiosInstance = axiosInstance
      .patch(`/api/product`, data, {withCredentials: true});
    } else if (apiType === "delete") {
      if (data.is_system_role === true) {
        setNotificationState({
          notificationType: "error",
          dialogText: "Không thể xóa sản phẩm",
          isShow: true,
        });

        return;
      }

      handleFinal = handleDeleteFinal;
      axiosInstance = axiosInstance
      .delete(`/api/product/${data.id}`, {withCredentials: true});
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
    <div>
      <Confirmation
        ref={confirmationRef}
        title="Xóa sản phẩm"
        detail={
          <span>
            Bạn có muốn chắc xóa sản phẩm <span className="font-weight-bold">{deleteData?.name}</span> không?
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
        size="xl"
      >
        <Modal.Header closeButton>
          <div className="h5 font-weight-bold">
            Sản phẩm
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Tên sản phẩm</label>
                  <input
                    {...register("name")}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Tên sản phẩm"
                    autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Tính năng hàng đầu</label>
                  <ControlledEditor
                    name="top_features"
                    placeholder="Tính năng hàng đầu"
                    control={control}
                  />
                  <div className="text-danger"><small>{errors.top_features?.message}</small></div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Mô tả</label>
                  <ControlledEditor
                    name="description"
                    placeholder="Mô tả"
                    control={control}
                  />
                  <div className="text-danger"><small>{errors.description?.message}</small></div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Thông tin sản phẩm</label>
                  <ControlledEditor
                    name="product_info"
                    placeholder="Thông tin sản phẩm"
                    control={control}
                  />
                  <div className="text-danger"><small>{errors.product_info?.message}</small></div>
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

export default ProductModal;
