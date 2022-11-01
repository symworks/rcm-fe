import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Modal, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { REACT_APP_PUBLIC_BACKEND_URL, REGEX_EMAIL, REGEX_PHONE_NUMER } from "../../constant/constant";
import { NotificationContextTemp } from "../../providers/NotificationProvider";
import * as yup from "yup";
import createAxios from "../../util/createAxios";
import Confirmation from "../Confirmation";
import ControlledSelect from "../RcmSelect/ControlledSelect";

const ProductOrderModal = React.forwardRef(({handleAddFinal, handleUpdateFinal, handleDeleteFinal, ...rest}, ref) => {
  const [show, setShow] = React.useState(false);
  const [apiType, setApiType] = React.useState("insert");
  const [deleteData, setDeleteData] = React.useState(undefined);
  const [loadingPageCount, setLoadingPageCount] = React.useState(0);
  const [categoryProvinceOptions, setCategoryProvinceOptions] = React.useState([]);
  const [categoryDistrictOptions, setCategoryDistrictOptions] = React.useState([]);
  const [storesOptions, setStoresOptions] = React.useState([]);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = React.useState(true);

  const { setNotificationState } = React.useContext(NotificationContextTemp);

  const confirmationRef = React.useRef(null);

  const validationScheme = yup.object().shape({
    name: yup.string()
    .min(1, 'Họ và tên bắt buộc nhập'),
    phone_number: yup
    .string()
    .min(1, 'Số điện thoại bắt buộc nhập')
    .matches(REGEX_PHONE_NUMER, 'Số điện thoại không hợp lệ'),
    email: yup
    .string()
    .min(1, 'Email bắt buộc nhập')
    .matches(REGEX_EMAIL, 'Email không hợp lệ'),
    delivery_method: yup
    .boolean(),
    store_province: yup
    .object()
    .when('delivery_method', {
      is: true,
      then: yup
      .object()
      .shape({
        value: yup.number().required('Tỉnh bắt buộc chọn'),
        label: yup.string().required('Tỉnh bắt buộc chọn'),
      })
      .nullable()
      .required('Tỉnh bắt buộc chọn')
  }),
    store_district: yup
    .object()
    .when('delivery_method', {
      is: true,
      then: yup
      .object()
      .shape({
        value: yup.number().required('Huyện bắt buộc chọn'),
        label: yup.string().required('Huyện bắt buộc chọn'),
      })
      .nullable()
      .required('Huyện bắt buộc chọn')
    }),
    store_address: yup
    .object()
    .when('delivery_method', {
      is: true,
      then: yup
      .object()
      .shape({
        value: yup.number().required('Địa chỉ cửa hàng bắt buộc chọn'),
        label: yup.string().required('Địa chỉ cửa hàng bắt buộc chọn'),
      })
      .nullable()
      .required('Địa chỉ cửa hàng bắt buộc chọn')
    }),
    customer_province: yup
    .object()
    .when('delivery_method', {
      is: false,
      then: yup
      .object()
      .shape({
        value: yup.number().required('Tỉnh bắt buộc chọn'),
        label: yup.string().required('Tỉnh bắt buộc chọn'),
      })
      .nullable()
      .required('Tỉnh bắt buộc chọn')
    }),
    customer_district: yup
    .object()
    .when('delivery_method', {
      is: false,
      then: yup
      .object()
      .shape({
        value: yup.number().required('Huyện bắt buộc chọn'),
        label: yup.string().required('Huyện bắt buộc chọn'),
      })
      .nullable()
      .required('Huyện bắt buộc chọn')
    }),
    customer_address: yup
    .string()
    .when('delivery_method', {
      is: false,
      then: yup
      .string()
      .min(1, 'Địa chỉ chi tiết bắt buộc nhập')
    }),
    other_request: yup
    .string(),
    is_invoice: yup
    .boolean(),
    is_call_other: yup
    .boolean(),
    status: yup
    .object()
    .shape({
      value: yup.number().required('Trạng thái bắt buộc chọn'),
      label: yup.string().required('Trạng thái bắt buộc chọn'),
    })
    .nullable()
    .required('Trạng thái bắt buộc chọn'),
  });

  const defaultValue = {
    name: '',
    phone_number: '',
    email: '',
    delivery_method: true,
    other_request: '',
    is_invoice: false,
    is_call_other: false,
    status: statusOpts[0],
  }

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
        store_province: {
          value: data.store_province_id,
          label: data.store_province_name,
        },
        store_district: {
          value: data.store_district_id,
          label: data.store_district_name,
        },
        store_address: {
          value: data.store_address_id,
          label: data.store_address_name,
        },
        customer_province: {
          value: data.customer_province_id,
          label: data.customer_province_name,
        },
        customer_district: {
          value: data.customer_district_id,
          label: data.customer_district_name,
        },
        status: statusOpts.find(item => item.value == data.status),
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

  React.useEffect(() => {
    setLoadingPageCount(prev => ++prev);
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get('/api/category_vn_province?use_paginate=false&fields[]=id as value&fields[]=name as label', {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {
        setCategoryProvinceOptions(prev => [...prev, ...response.data.payload]);
      }

      setLoadingPageCount(prev => --prev);
    })
    .catch(error => {
      console.error(error);
      setLoadingPageCount(prev => --prev);
    })
  }, []);

  const handleProvinceChange = (...args) => {
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`/api/category_vn_district?use_paginate=false&fields[]=id as value&fields[]=name as label&${args.length !== 0 ? 'province_id=' + args[0] : ''}`, {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {
        setCategoryDistrictOptions(response.data.payload);
      } else {
        setCategoryDistrictOptions([]);
      }

      setStoresOptions([]);
    })
    .catch(error => {
      console.error(error);
    })
  }

  const handleDistrictChange = (...args) => {
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`/api/store?use_paginate=false&${args.length > 0 ? 'district_id=' + args[0] : ''}`, {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {
        setStoresOptions(response.data.payload);
      }
    })
    .catch(error => {
      console.error(error);
    })
  };

  const onSubmit = data => {
    const submitData = {
      ...data,
      status: data.status.value,
    };

    var axiosInstance = createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    var handleFinal = undefined;
    if (apiType === "insert") {
      handleFinal = handleAddFinal;
      axiosInstance = axiosInstance
      .post(`/api/product_order`, submitData, {withCredentials: true});
    } else if (apiType === "update") {
      handleFinal = handleUpdateFinal;
      axiosInstance = axiosInstance
      .patch(`/api/product_order`, submitData, {withCredentials: true});
    } else if (apiType === "delete") {
      handleFinal = handleDeleteFinal;
      axiosInstance = axiosInstance
      .delete(`/api/product_order/${submitData.id}`, {withCredentials: true});
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
        title="Xóa đơn hàng"
        detail={
          <span>
            Bạn có muốn chắc xóa đơn hàng <span className="font-weight-bold">{deleteData?.name}</span> không?
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
            Thông tin đặt hàng
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className="font-weight-bold h6">Thông tin khách hàng</p>
            <div className="form-group">
              <input
                {...register("name")}
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Họ và tên (bắt buộc)"
                autoComplete="off"
              />
              <div className="invalid-feedback">{errors.name?.message}</div>
            </div>
            <div className="form-group">
              <input
                {...register('phone_number')}
                className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                placeholder="Số điện thoại (bắt buộc)"
                autoComplete="off"
              />
              <div className="invalid-feedback">{errors.phone_number?.message}</div>
            </div>
            <div className="form-group">
              <input
                {...register("email")}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Email (Vui lòng nhập email để xác nhận hóa đơn VAT)"
                autoComplete="off"
              />
              <div className="invalid-feedback">{errors.email?.message}</div>
            </div>
            <p className="font-weight-bold h6">Chọn cách thức giao hàng</p>
            <div className="d-flex justify-content-start">
              <div className="form-check mr-4">
                <input
                  {...register("delivery_method")}
                  className="form-check-input"
                  type="radio"
                  value={true}
                  defaultChecked={true}
                  id="delivery_method_1"
                  onClick={() => {setSelectedDeliveryMethod(true);}}
                />
                <label className="form-check-label font-weight-normal" htmlFor="delivery_method_1">Nhận tại cửa hàng</label>
              </div>
              <div className="form-check">
                <input
                  {...register("delivery_method")}
                  className="form-check-input"
                  type="radio"
                  value={false}
                  id="delivery_method_2"
                  onClick={() => {setSelectedDeliveryMethod(false);}}
                />
                <label className="form-check-label font-weight-normal" htmlFor="delivery_method_2">Giao hàng tận nơi</label>
              </div>
            </div>

            {
              selectedDeliveryMethod ? (
                <Card className="mt-3">
                  <Card.Body style={{backgroundColor: "#f7f8fa"}}>
                    <div className="row">
                      <div className="col-sm-12 col-lg-6">
                        <ControlledSelect
                          name="store_province"
                          placeholder="Chọn tỉnh"
                          onChangeInteract={handleProvinceChange}
                          options={categoryProvinceOptions}
                          control={control}
                        />
                        <div className="text-danger"><small>{errors.store_province?.message || errors.store_province?.label.message}</small></div>
                      </div>
                      <div className="col-sm-12 col-lg-6">
                        <ControlledSelect
                          name="store_district"
                          placeholder="Chọn huyện"
                          onChangeInteract={handleDistrictChange}
                          options={categoryDistrictOptions}
                          control={control}
                        />
                        <div className="text-danger"><small>{errors.store_district?.message || errors.store_district?.label.message}</small></div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12">
                        <ControlledSelect
                          name="store_address"
                          placeholder="Chọn cửa hàng"
                          options={storesOptions}
                          control={control}
                        />
                        <div className="text-danger"><small>{errors.store_address?.message || errors.store_address?.label.message}</small></div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                <Card className="mt-3">
                  <Card.Body style={{backgroundColor: "#f7f8fa"}}>
                  <div className="row">
                      <div className="col-sm-12 col-lg-6">
                        <ControlledSelect
                          name="customer_province"
                          placeholder="Chọn tỉnh"
                          onChangeInteract={handleProvinceChange}
                          options={categoryProvinceOptions}
                          control={control}
                        />
                        <div className="text-danger"><small>{errors.customer_province?.message || errors.customer_province?.label.message}</small></div>
                      </div>
                      <div className="col-sm-12 col-lg-6">
                        <ControlledSelect
                          name="customer_district"
                          placeholder="Chọn huyện"
                          onChangeInteract={handleDistrictChange}
                          options={categoryDistrictOptions}
                          control={control}
                        />
                        <div className="text-danger"><small>{errors.customer_district?.message || errors.customer_district?.label.message}</small></div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12">
                        <input
                          {...register("customer_address")}
                          className={`form-control ${errors.customer_address ? 'is-invalid' : ''}`}
                          placeholder="Số nhà, tên đường"
                          autoComplete="off"
                        />
                        <div className="invalid-feedback">{errors.customer_address?.message}</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )
            }
            <div className="form-group">
              <input
                {...register("other_request")}
                className={`form-control ${errors.other_request ? 'is-invalid' : ''}`}
                placeholder="Yêu cầu khác"
                autoComplete="off"
              />
              <div className="invalid-feedback">{errors.other_request?.message}</div>
            </div>
            <div className="form-check form-check-inline">
              <input
                {...register("is_invoice")}
                id="is_invoice"
                className="form-check-input"
                type="checkbox"
              />
              <label className="form-check-label font-weight-normal" htmlFor="is_invoice">Yêu cầu xuất hóa đơn công ty (Vui lòng điền email để nhận hóa đơn VAT)</label>
            </div>
            <div className="text-danger"><u><em>(Với hóa đơn trên 20 triệu vui lòng thanh toán chuyển khoản từ tài khoản công ty khi cần xuất VAT cho công ty)</em></u></div>
            <div className="form-check form-check-inline mt-2">
              <input
                {...register("is_call_other")}
                id="is_call_other"
                className="form-check-input"
                type="checkbox"
              />
              <label className="form-check-label font-weight-normal" htmlFor="is_call_other">Gọi người khác nhận hàng (Nếu có)</label>
            </div>
            <div className="row mt-3">
              <div className="col-sm-12 col-lg-6">
                <label>Trạng thái</label>
                <ControlledSelect
                  name="status"
                  placeholder="Chọn trạng thái"
                  options={statusOpts}
                  control={control}
                />
                <div className="text-danger"><small>{errors.status?.message || errors.status?.label.message}</small></div>
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

const statusOpts = [
  {
    value: 0,
    label: 'Chưa hoàn thành đặt hàng',
  },
  {
    value: 1,
    label: 'Chờ khách hàng thanh toán',
  },
  {
    value: 2,
    label: 'Khách hàng đã thanh toán',
  },
  {
    value: 3,
    label: 'Chờ nhân viên xác nhận đơn hàng',
  },
  {
    value: 4,
    label: 'Nhân viên đã xác nhận đặt hàng'
  },
  {
    value: 5,
    label: 'Đơn hàng chờ vận chuyển'
  },
  {
    value: 6,
    label: 'Đã vận chuyển',
  },
]

export default ProductOrderModal;
