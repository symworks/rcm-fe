import React from 'react';
import { Card } from 'react-bootstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { REACT_APP_PUBLIC_BACKEND_URL, REGEX_EMAIL, REGEX_PHONE_NUMER } from '../../constant/constant';
import { useForm } from 'react-hook-form';
import SingleSelect from '../../components/RcmSelect/SingleSelect';
import { useHistory } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import createAxios from '../../util/createAxios';

const OrderInfo = () => {
  const [loadingPageCount, setLoadingPageCount] = React.useState(0);
  const [loadingSubmitCountState, setLoadingSubmitCountState] = React.useState(0);

  const [categoryProvinceOptions, setCategoryProvinceOptions] = React.useState([]);
  const [categoryDistrictOptions, setCategoryDistrictOptions] = React.useState([]);
  const [storesOptions, setStoresOptions] = React.useState([]);

  const [checkCaptcha, setCheckCaptcha] = React.useState(false);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = React.useState(true);

  const history = useHistory();

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
  });

  const defaultValue = {
    name: '',
    phone_number: '',
    email: '',
    delivery_method: true,
    other_request: '',
    is_invoice: false,
    is_call_other: false,
  }

  const {register, handleSubmit, formState: {errors}, control} = useForm({
    resolver: yupResolver(validationScheme),
    defaultValues: defaultValue,
  });

  React.useEffect(() => {
    setLoadingPageCount(prev => ++prev);
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get('/api/category_vn_province?use_paginate=false', {withCredentials: true})
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
    .get(`/api/category_vn_district?use_paginate=false&${args.length !== 0 ? 'province_id=' + args[0] : ''}`, {withCredentials: true})
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
    .get(`/api/store/select?${args.length > 0 ? 'district_id=' + args[0] : ''}`, {withCredentials: true})
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
    if (!checkCaptcha) {
      return;
    }

    const submitData = {
      ...data,
      store_province_id: data.store_province?.value,
      store_province_name: data.store_province?.label,
      store_district_id: data.store_district?.value,
      store_district_name: data.store_district?.label,
      store_address_id: data.store_address?.value,
      store_address_name: data.store_address?.label,
      customer_province_id: data.customer_province?.value,
      customer_province_name: data.customer_province?.label,
      customer_district_id: data.customer_district?.value,
      customer_district_name: data.customer_district?.label,
      total_price: parseFloat(localStorage.getItem('price').replace(' đ', '')),
    }

    setLoadingSubmitCountState(prev => ++prev);
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .post('/api/product_order', submitData, {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {        
        const productsStorage = JSON.parse(localStorage.getItem('products'));
        productsStorage.forEach(productItem => {
          setLoadingSubmitCountState(prev => ++prev);
          createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
          .post(`/api/product_order_detail`, {
            order_qty: productItem.qty,
            product_order_id: response.data.payload.insertedId,
            product_id: productItem.productVersion.id,
          }, {withCredentials: true})
          .then(response => {
            if (response.data.error_code === 200) {
              // Do nothing
            }

            setLoadingSubmitCountState(prev => --prev);
          })
          .catch(error => {
            console.error(error);
            setLoadingSubmitCountState(prev => --prev);
          });
        });

        history.push(`/rcm/payment_info?product_order_id=${response.data.payload.insertedId}`);
      }

      setLoadingSubmitCountState(prev => --prev);
    })
    .catch(error => {
      console.error(error);
      setLoadingSubmitCountState(prev => --prev);
    })    
  };

  const handleRecaptchaChange = (value) => {
    setCheckCaptcha(true);
  }

  return (
    <div className="container-sm pt-4 d-flex justify-content-center">
      <div className="w-75">
        <div className="w-75">
          <div className="d-flex justify-content-between mb-2">
            <a className="text-danger h6 font-weight-bold" href="/rcm"><span className="fa fa-angle-left"/> Trở về</a>
            <span className="text-danger h5 font-weight-bold">Giỏ hàng</span>
            <span></span>
          </div>
        </div>
        <div className="d-flex justify-content-center pt-2 rounded-top" style={{backgroundColor: '#fae6eb'}}>
          {
            steps.map((step, index) => {
              return (
                <div key={index} className="d-flex justify-content-center align-items-center">
                  <div className="border border-danger rounded-circle h5 p-1 mr-2">
                    <span className={`${step.icon} d-flex justify-content-center align-items-center`} style={{width: "35px", height: "35px"}}/>
                  </div>
                  {
                    index !== steps.length - 1 && <hr className="mr-2 bg-secondary" style={{width: "40px"}}/>
                  }
                </div>
              )
            })
          }
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <Card.Body>
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
                          <SingleSelect
                            name="store_province"
                            placeholder="Chọn tỉnh"
                            onChangeInteract={handleProvinceChange}
                            options={categoryProvinceOptions}
                            control={control}
                          />
                          <div className="text-danger"><small>{errors.store_province?.message || errors.store_province?.label.message}</small></div>
                        </div>
                        <div className="col-sm-12 col-lg-6">
                          <SingleSelect
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
                          <SingleSelect
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
                          <SingleSelect
                            name="customer_province"
                            placeholder="Chọn tỉnh"
                            onChangeInteract={handleProvinceChange}
                            options={categoryProvinceOptions}
                            control={control}
                          />
                          <div className="text-danger"><small>{errors.customer_province?.message || errors.customer_province?.label.message}</small></div>
                        </div>
                        <div className="col-sm-12 col-lg-6">
                          <SingleSelect
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

              <div className="mt-2 d-flex justify-content-center">
                <ReCAPTCHA
                  sitekey="6LeeTYgiAAAAACVqQg4SHptKFAHj8J1ZgRFf-lsW"
                  onChange={handleRecaptchaChange}
                />
              </div>
            </Card.Body>
          </Card>
          <Card className="mt-2">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <span className="font-weight-bold h6">Tổng tiền tạm tính</span>
                <span className="text-danger font-weight-bold h6">{localStorage.getItem('price')}</span>
              </div>
              <button className="btn btn-danger w-100 mt-2 py-3 font-weight-bold h6" disabled={!checkCaptcha || loadingSubmitCountState} type="submit">Tiến hành đặt hàng</button>
              <button className="btn btn-outline-danger w-100 mt-2 py-3 font-weight-bold h6" onClick={() => {history.push('/rcm')}}>Chọn thêm sản phẩm khác</button>
            </Card.Body>
          </Card>
        </form>
      </div>
    </div>
  )
}

const steps = [
  {
    icon: "fa fa-shopping-cart",
    label: "Chọn sản phẩm"
  },
  {
    icon: "fa fa-info",
    label: "Thông tin đặt hàng"
  },
  {
    icon: "fa fa-money",
    label: "Phiếu giảm giá"
  },
  {
    icon: "fa fa-credit-card",
    label: "Thanh toán"
  },
  {
    icon: "fa fa-dropbox",
    label: "Hoàn tất đặt hàng"
  }
]

export default OrderInfo;
