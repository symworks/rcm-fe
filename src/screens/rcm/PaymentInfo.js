import React from 'react';
import { Card, Image } from 'react-bootstrap';
import {
  REACT_APP_PUBLIC_BACKEND_URL,
} from "../../constant/constant";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import createAxios from '../../util/createAxios';
import { NotificationContextTemp } from '../../providers/NotificationProvider';

const qs = require('query-string');

const PaymentInfo = (props) => {
  const [productOrderDetailState, setProductOrderDetailState] = React.useState(undefined);
  const [paymentMethods, setPaymentMethods] = React.useState([]);

  const [acceptTermsState, setAccepTermsState] = React.useState(false);

  const [loadingProductOrderDetailCountState, setLoadingProductOrderDetailCountState] = React.useState(0);
  const [loadingSubmitCountState, setLoadingSubmitCountState] = React.useState(0);
  const [selectedPaymentMethodIndexState, setSelectedPaymentMethodIndexState] = React.useState(0);

  const { setNotificationState } = React.useContext(NotificationContextTemp);

  const history = useHistory();
  const parsed = qs.parse(window.location.search);

  React.useEffect(() => {
    setLoadingProductOrderDetailCountState(prev => ++prev);
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`/api/product_order?use_paginate=false&id=${parsed.product_order_id}`, {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200 && response.data.payload[0]) {
        setProductOrderDetailState(response.data.payload[0]);
      }

      setLoadingProductOrderDetailCountState(prev => --prev);
    })
    .catch(error => {
      console.error(error);
      setLoadingProductOrderDetailCountState(prev => --prev);
    });

    setLoadingProductOrderDetailCountState(prev => ++prev);
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`/api/payment_method?use_paginate=false`, {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {
        setPaymentMethods(response.data.payload);
      }

      setLoadingProductOrderDetailCountState(prev => --prev);
    })
    .catch(error => {
      console.error(error);
      setLoadingProductOrderDetailCountState(prev => --prev);
    })
  }, []);

  const {handleSubmit} = useForm();

  const onSubmit = submitData => {
    submitData = {
      ...submitData,
      payment_method_id: paymentMethods[selectedPaymentMethodIndexState].id,
      id: parseInt(parsed.product_order_id),
    };
    setLoadingSubmitCountState(prev => ++prev);
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .patch(`/api/product_order/select_method`, submitData, {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {
        if (submitData.payment_method_id == 1) { // Nhận hàng trực tiếp
          history.push('/rcm');
          setNotificationState({
            notificationType: "success",
            dialogText: "Đơn hàng đã được đặt thành công, chúng tôi sẽ gửi email chi tiết về đơn đặt hàng cho bạn.",
            isShow: true,
          });
          localStorage.removeItem('products');
          localStorage.removeItem('price');

          // TODO: add invoice number to localStorage.
        } else {
          // TODO:
          // Đến trang thanh toán
        }
      } else {
        setNotificationState({
          notificationType: "error",
          dialogText: response.data.msg,
          isShow: true,
        });
      }

      setLoadingSubmitCountState(prev => --prev);
    })
    .catch(error => {
      console.error(error);
      setLoadingSubmitCountState(prev => --prev);
    })
  }

  return (
    <div className="container-sm pt-4 d-flex justify-content-center">
      <div className="w-75">
        <div className="d-flex justify-content-center mb-2">
          <span className="text-danger h5 font-weight-bold">Thanh toán</span>
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
              <Card>
                <Card.Body>
                  <div className="text-center font-weight-bold h4">
                    Thông tin đặt hàng
                  </div>
                  {
                    loadingProductOrderDetailCountState ? (
                      <Skeleton count={10}/>
                    ) : (
                      <>
                        <div className="d-flex justify-content-start">
                          <span className="mr-2 h5">Mã Đơn Hàng:</span>
                          <span className="font-weight-bold h5">{productOrderDetailState?.id}</span>
                        </div>
                        <div className="d-flex justify-content-start">
                          <span className="mr-2 h5">Người Đặt:</span>
                          <span className="font-weight-bold h5">{productOrderDetailState?.name}</span>
                        </div>
                        <div className="d-flex justify-content-start">
                          <span className="mr-2 h5">Số Điện Thoại:</span>
                          <span className="font-weight-bold h5">{productOrderDetailState?.phone_number}</span>
                        </div>
                        <div className="d-flex justify-content-start">
                          <span className="mr-2 h5">Email:</span>
                          <span className="font-weight-bold h5">{productOrderDetailState?.email}</span>
                        </div>
                        {
                          productOrderDetailState?.delivery_method === 0 ? (
                            <div className="d-flex justify-content-start">
                              <span className="mr-2 h5">Giao Đến:</span>
                              <span className="font-weight-bold h5">{`${productOrderDetailState?.customer_address}, ${productOrderDetailState?.customer_province_name}, ${productOrderDetailState?.customer_district_name}`}</span>
                            </div>
                          ) : (
                            <div></div>
                          )
                        }
                        <div className="d-flex justify-content-start">
                          <span className="mr-2 h5">Tổng Tiền:</span>
                          <span className="font-weight-bold h5">{`${productOrderDetailState?.total_price} đ`}</span>
                        </div>

                        <div className="form-group form-check">
                          <input type="checkbox" className="form-check-input" id="agree_terms" checked={acceptTermsState} onChange={() => {setAccepTermsState(prev => !prev)}}/>
                          <label className="form-check-label text-danger font-weight-normal h6" htmlFor="agree_terms"><em>Bằng cách đặt hàng, bạn đồng ý với Điều khoản sử dụng của Rcm</em></label>
                        </div>
                      </>
                    )
                  }
                </Card.Body>
              </Card>

              <div className="font-weight-bold h5">Chọn hình thức thanh toán</div>
              <div className="row">
                {
                  paymentMethods.map((paymentMethod, index) => {
                    return (
                      <div className="col-sm-6" key={index}>
                        <Card className={`${selectedPaymentMethodIndexState === index && 'border border-danger rounded'}`} style={{cursor: "pointer"}} onClick={() => setSelectedPaymentMethodIndexState(index)}>
                          <Card.Body className="p-1">
                            <div className="d-flex justify-content-center align-items-center flex-column pb-2">
                              <span className="font-weight-bold mb-2">{paymentMethod?.name}</span>
                              <Image src={paymentMethod?.logo}/>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    )
                  })
                }
              </div>
            </Card.Body>
          </Card>
          <Card className="mt-2">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <span className="font-weight-bold h6">Tổng tiền tạm tính</span>
                <span className="text-danger font-weight-bold h6">{`${productOrderDetailState?.total_price} đ`}</span>
              </div>
              <button className="btn btn-danger w-100 mt-2 py-3 font-weight-bold h6" type="submit" disabled={!acceptTermsState || loadingSubmitCountState !== 0}>{loadingSubmitCountState === 0 ? "Tiếp tục" : "Đang tải"}</button>
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
