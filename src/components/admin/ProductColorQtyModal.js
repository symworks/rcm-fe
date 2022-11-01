import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../../constant/constant";
import { NotificationContextTemp } from "../../providers/NotificationProvider";
import * as yup from "yup";
import createAxios from "../../util/createAxios";
import Confirmation from "../Confirmation";
import ControlledSelect from "../RcmSelect/ControlledSelect";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductColorQtyModal = React.forwardRef(({handleAddFinal, handleUpdateFinal, handleDeleteFinal, ...rest}, ref) => {
  const [show, setShow] = React.useState(false);
  const [apiType, setApiType] = React.useState("insert");
  const [deleteData, setDeleteData] = React.useState(undefined);
  const [productVersionOpts, setProductVersionOpts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const { setNotificationState } = React.useContext(NotificationContextTemp);

  const confirmationRef = React.useRef(null);

  React.useEffect(() => {
    setIsLoading(prev => ++prev);
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`/api/product_version?use_paginate=false&fields[]=product_versions.id as value&fields[]=product_versions.name as label`, {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {
        setProductVersionOpts(response.data.payload);
      }

      setIsLoading(prev => --prev);
    })
    .catch(error => {
      console.error(error);
      setIsLoading(prev => --prev);
    });
  }, []);

  const validationScheme = yup.object().shape({
    product_version: yup
    .object()
    .shape({
      value: yup.number().required('Dòng sản phẩm bắt buộc chọn'),
      label: yup.string().required('Dòng sản phẩm bắt buộc chọn')
    })
    .nullable()
    .required('Dòng sản phẩm bắt buộc chọn'),
    name: yup
    .string()
    .min(1, 'Tên màu bắt buộc nhập'),
    instock_qty: yup
    .number()
    .min(0, 'Số lượng trong kho phải là số dương'),
    sold_qty: yup
    .number()
    .min(0, 'Số lượng đã bán phải là số dương'),
    busy_qty: yup
    .number()
    .min(0, 'Số lượng đang vận chuyển phải là số dương'),
  });

  const defaultValue = {
    product_version: undefined,
    name: '',
    instock_qty: 0,
    sold_qty: 0,
    busy_qty: 0,
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
        product_version: {
          value: data.product_version_id,
          label: data.product_version_name,
        }
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
      .post(`/api/product_color_qty`, data, {withCredentials: true});
    } else if (apiType === "update") {
      handleFinal = handleUpdateFinal;
      axiosInstance = axiosInstance
      .patch(`/api/product_color_qty`, data, {withCredentials: true});
    } else if (apiType === "delete") {
      handleFinal = handleDeleteFinal;
      axiosInstance = axiosInstance
      .delete(`/api/product_color_qty/${data.id}`, {withCredentials: true}); 
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
        title="Xóa dòng sản phẩm"
        detail={
          <span>
            Bạn có muốn chắc xóa dòng sản phẩm <span className="font-weight-bold">{deleteData?.name}</span> không?
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
            Dòng sản phẩm
          </div>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            {
              isLoading ? (
                <Skeleton height={40}/>
              ) : (
                <div>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label>Dòng sản phẩm</label>
                        <ControlledSelect
                          name="product_version"
                          placeholder="Chọn dòng sản phẩm"
                          options={productVersionOpts}
                          control={control}
                        />
                        <div className="text-danger"><small>{errors.product_version?.message || errors.product_version?.label.message}</small></div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label>Tên màu</label>
                        <input
                          {...register("name")}
                          className="form-control"
                          placeholder="Nhập tên màu"
                        />
                        <div className="invalid-feedback">{errors.name?.message}</div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label>Số lượng trong kho</label>
                        <input
                          {...register("instock_qty")}
                          className="form-control"
                          placeholder="Nhập số lượng trong kho"
                          type="number"
                        />
                        <div className="invalid-feedback">{errors.instock_qty?.message}</div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label>Số lượng đã bán</label>
                        <input
                          {...register("sold_qty")}
                          className="form-control"
                          placeholder="Nhập số lượng đã bán"
                          type="number"
                        />
                        <div className="invalid-feedback">{errors.sold_qty?.message}</div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label>Số lượng đang vận chuyển</label>
                        <input
                          {...register("busy_qty")}
                          className="form-control"
                          placeholder="Nhập số lượng đang vận chuyển"
                          type="number"
                        />
                        <div className="invalid-feedback">{errors.busy_qty?.message}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          </Modal.Body>
          <Modal.Footer>
            <div className="mt-2 d-flex justify-content-end">
              <button type="submit" className="btn btn-outline-info">Cập nhật</button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
});

export default ProductColorQtyModal;
