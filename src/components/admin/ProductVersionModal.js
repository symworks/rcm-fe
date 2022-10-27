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

const ProductVersionModal = React.forwardRef(({handleAddFinal, handleUpdateFinal, handleDeleteFinal, ...rest}, ref) => {
  const [show, setShow] = React.useState(false);
  const [apiType, setApiType] = React.useState("insert");
  const [deleteData, setDeleteData] = React.useState(undefined);
  const [productTypeOptions, setProductTypeOptions] = React.useState([]);
  const [productOptions, setProductOptions] = React.useState([]);

  const { setNotificationState } = React.useContext(NotificationContextTemp);

  const confirmationRef = React.useRef(null);

  React.useEffect(() => {
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`/api/product_type?use_paginate=false&fields[]=id as value&fields[]=name as label`, {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {
        setProductTypeOptions(response.data.payload);
      }
    })
    .catch(error => {
      console.error(error);
    });
  }, []);

  const validationScheme = yup.object().shape({
    product_type: yup
    .object()
    .shape({
      value: yup.number().required('Loại sản phẩm bắt buộc chọn'),
      label: yup.string().required('Loại sản phẩm bắt buộc chọn')
    })
    .nullable()
    .required('Loại sản phẩm bắt buộc chọn'),
    product: yup
    .object()
    .shape({
      value: yup.number().required('Sản phẩm bắt buộc chọn'),
      label: yup.string().required('Sản phẩm bắt buộc chọn'),
    })
    .nullable()
    .required('Sản phẩm bắt buộc chọn'),
    name: yup
    .string()
    .min(1, 'Tên dòng sản phẩm bắt buộc nhập')
    .max(255, 'Tên dòng sản phẩm có tối đa 255 ký tự'),
    origin_price: yup
    .number()
    .required('Giá gốc bắt buộc nhập')
    .min(0, 'Giá gốc phải là số dương'),
    official_price: yup
    .number()
    .required('Giá chính thức bắt buộc nhập')
    .max(yup.ref('origin_price'), 'Giá chính thức tối đa là giá gốc'),
    instock_qty: yup
    .number()
    .required('Số lượng hàng trong kho bắt buộc nhập')
    .min(0, 'Số lượng hàng trong kho phải là số dương'),
    sold_qty: yup
    .number()
    .required('Số lượng hàng đã bán bắt buộc nhập')
    .min(0, 'Số lượng hàng đã bán phải là số dương'),
    busy_qty: yup
    .number()
    .required('Số lượng hàng đang giao bắt buộc nhập')
    .min(0, 'Số lượng hàng đang giao phải là số dương'),
  });

  const defaultValue = {
    product_type: undefined,
    product: undefined,
    name: '',
    origin_price: 0,
    official_price: 0,
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
        product_type: {
          value: data.product_type_id,
          label: data.product_type_name,
        },
        product: {
          value: data.product_id,
          label: data.product_name,
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
      .post(`/api/product_version`, data, {withCredentials: true});
    } else if (apiType === "update") {
      handleFinal = handleUpdateFinal;
      axiosInstance = axiosInstance
      .patch(`/api/product_version`, data, {withCredentials: true});
    } else if (apiType === "delete") {
      handleFinal = handleDeleteFinal;
      axiosInstance = axiosInstance
      .delete(`/api/product_version/${data.id}`, {withCredentials: true});
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

  const handleProductTypeChange = (value) => {
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`/api/product?use_paginate=false&match_col=product_type_id&match_key=${value}&fields[]=id as value&fields[]=name as label`, {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {
        setProductOptions(response.data.payload);
      }
    })
    .catch(error => {
      console.error(error);
    })
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
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Loại sản phẩm</label>
                  <ControlledSelect
                    name="product_type"
                    placeholder="Chọn loại sản phẩm"
                    options={productTypeOptions}
                    control={control}
                    onChangeInteract={handleProductTypeChange}
                  />
                  <div className="text-danger"><small>{errors.product_type?.message || errors.product_type?.label.message}</small></div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Sản phẩm</label>
                  <ControlledSelect
                    name="product"
                    placeholder="Chọn sản phẩm"
                    options={productOptions}
                    control={control}
                  />
                  <div className="text-danger"><small>{errors.product?.message || errors.product?.label.message}</small></div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Tên dòng sản phẩm</label>
                  <input
                    {...register("name")}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Nhập tên dòng sản phẩm"
                    autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Giá gốc</label>
                  <input
                    {...register("origin_price")}
                    className={`form-control ${errors.origin_price ? 'is-invalid' : ''}`}
                    placeholder="Nhập giá gốc"
                    autoComplete="off"
                    type="number"
                    step=".001"
                  />
                  <div className="invalid-feedback">{errors.origin_price?.message}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Giá chính thức</label>
                  <input
                    {...register("official_price")}
                    className={`form-control ${errors.official_price ? 'is-invalid' : ''}`}
                    placeholder="Nhập giá chính thức"
                    autoComplete="off"
                    type="number"
                    step=".001"
                  />
                  <div className="invalid-feedback">{errors.official_price?.message}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Số lượng trong kho</label>
                  <input
                    {...register("instock_qty")}
                    className={`form-control ${errors.instock_qty ? 'is-invalid' : ''}`}
                    placeholder="Nhập số lượng trong kho"
                    autoComplete="off"
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
                    className={`form-control ${errors.sold_qty ? 'is-invalid' : ''}`}
                    placeholder="Nhập số lượng đã bán"
                    autoComplete="off"
                    type="number"
                  />
                  <div className="invalid-feedback">{errors.sold_qty?.message}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Số lượng đang giao</label>
                  <input
                    {...register("busy_qty")}
                    className={`form-control ${errors.busy_qty ? 'is-invalid' : ''}`}
                    placeholder="Nhập số lượng đang giao"
                    autoComplete="off"
                    type="number"
                  />
                  <div className="invalid-feedback">{errors.busy_qty?.message}</div>
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

export default ProductVersionModal;
