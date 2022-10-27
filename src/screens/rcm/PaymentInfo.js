import React from 'react';
import { Card } from 'react-bootstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { REACT_APP_PUBLIC_BACKEND_URL } from '../../constant/constant';
import { useForm } from 'react-hook-form';
import SingleSelect from '../../components/RcmSelect/SingleSelect';
import { useHistory } from 'react-router-dom';

const PaymentInfo = () => {
  const [loadingPageCount, setLoadingPageCount] = React.useState(0);
  const [categoryRegionOptions, setCategoryRegionOptions] = React.useState([]);
  const [categoryProvinceOptions, setCategoryProvinceOptions] = React.useState([]);
  const [categoryDistrictOptions, setCategoryDistrictOptions] = React.useState([]);
  const [storesOptions, setStoresOptions] = React.useState([]);

  const [activeDeliveryMethod, setActiveDeliveryMethod] = React.useState(true);

  const history = useHistory();

  const validationScheme = yup.object().shape({
    name: yup.string()
    .min(1, 'Họ và tên bắt buộc nhập'),
    phone_number: yup.string()
    .min(1, 'Số điện thoại bắt buộc nhập'),
  });

  const {register, handleSubmit, reset, formState: {errors}, control} = useForm({
    resolver: yupResolver(validationScheme),
  });

  React.useEffect(() => {
    setLoadingPageCount(prev => ++prev);
    fetch(`${REACT_APP_PUBLIC_BACKEND_URL}/api/category_vn_province/select`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error_code === 200) {
        setCategoryProvinceOptions(prev => [...prev, ...data.payload]);
      }

      setLoadingPageCount(prev => --prev);
    })
    .catch(error => {
      console.error(error);
      setLoadingPageCount(prev => --prev);
    })
  }, []);

  const handleProvinceChange = (...args) => {
    fetch(`${REACT_APP_PUBLIC_BACKEND_URL}/api/category_vn_district/select?${args.length !== 0 ? 'province_id=' + args[0] : ''}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error_code === 200) {
        setCategoryDistrictOptions(data.payload);
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
    fetch(`${REACT_APP_PUBLIC_BACKEND_URL}/api/store/select?${args.length > 0 ? 'district_id=' + args[0] : ''}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error_code === 200) {
        setStoresOptions(data.payload);
      }
    })
    .catch(error => {
      console.error(error);
    })
  };

  const onSubmit = data => {

  };

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
                    checked={activeDeliveryMethod}
                    id="delivery_method_1"
                    onClick={() => {setActiveDeliveryMethod(true);}}
                  />
                  <label className="form-check-label font-weight-normal" htmlFor="delivery_method_1">Nhận tại cửa hàng</label>
                </div>
                <div className="form-check">
                  <input
                    {...register("delivery_method")}
                    className="form-check-input"
                    type="radio"
                    id="delivery_method_2"
                    onClick={() => {setActiveDeliveryMethod(false);}}
                  />
                  <label className="form-check-label font-weight-normal" htmlFor="delivery_method_2">Giao hàng tận nơi</label>
                </div>
              </div>

              <Card className="mt-3">
                <Card.Body style={{backgroundColor: "#f7f8fa"}}>
                  <div className="row">
                    <div className="col-sm-12 col-lg-6">
                      <SingleSelect
                        name="category_vn_province_id"
                        placeholder="Chọn tỉnh"
                        onChangeInteract={handleProvinceChange}
                        options={categoryProvinceOptions}
                        control={control}
                      />
                    </div>
                    <div className="col-sm-12 col-lg-6">
                      <SingleSelect
                        name="category_vn_district_id"
                        placeholder="Chọn huyện"
                        onChangeInteract={handleDistrictChange}
                        options={categoryDistrictOptions}
                        control={control}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12">
                      <SingleSelect
                        name="store_address_id"
                        placeholder="Chọn cửa hàng"
                        options={storesOptions}
                        control={control}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
              <div className="form-group">
                <input
                  {...register("request")}
                  className={`form-control ${errors.request ? 'is-invalid' : ''}`}
                  placeholder="Yêu cầu khác"
                  autoComplete="off"
                />
                <div className="invalid-feedback">{errors.request?.message}</div>
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
                  {...register("call_other")}
                  id="call_other"
                  className="form-check-input"
                  type="checkbox"
                />
                <label className="form-check-label font-weight-normal" htmlFor="call_other">Gọi người khác nhận hàng (Nếu có)</label>
              </div>
            </Card.Body>
          </Card>
          <Card className="mt-2">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <span className="font-weight-bold h6">Tổng tiền tạm tính</span>
                <span className="text-danger font-weight-bold h6">{localStorage.getItem('price')}</span>
              </div>
              <button className="btn btn-danger w-100 mt-2 py-3 font-weight-bold h6" type="submit">Tiến hành đặt hàng</button>
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

export default PaymentInfo;
