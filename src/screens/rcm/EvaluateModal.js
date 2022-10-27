import React from 'react';
import { Image, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { REGEX_EMAIL } from '../../constant/constant';
import { yupResolver } from '@hookform/resolvers/yup';
import StarRatings from 'react-star-ratings';
import { REACT_APP_PUBLIC_BACKEND_URL } from '../../constant/constant';
import createAxios from '../../util/createAxios';

const EvaluateModal = ({loadingPage, productId, handleAfterSubmitEvaluateModal, ...rest}) => {
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [rateValue, setRateValue] = React.useState(0);

  const validationScheme = yup.object().shape({
    name: yup.string()
    .min(1, 'Họ và tên bắt buộc nhập'),
    email: yup.string()
    .min(1, 'Email bắt buộc nhập')
    .matches(REGEX_EMAIL, 'Email không hợp lệ'),
    content: yup.string(),
  });

  const { register, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(validationScheme),
  });

  const onSubmit = data => {
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .post('/api/product_evaluate', {
      ...data,
      "product_id": Number(productId),
      "rate_value": rateValue,
    }, {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {
        if (handleAfterSubmitEvaluateModal) {
          handleAfterSubmitEvaluateModal();
        }

        setShow(false);
      }
    })
    .catch(error => {
      console.error(error);
    })
  }

  const handleSelectStar = (starValue) => {
    setRateValue(starValue);
  }

  return (
    <div {...rest}>
      <div className="d-flex align-items-center flex-column">
        <button className="btn btn-info" onClick={handleShow}>Đánh giá ngay</button>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <div className="w-100 d-flex align-items-center flex-column">
            <Image src="/shipper.png" width="150px"/>
            <button className="btn btn-danger w-100 rounded-pill">Đăng nhập để đánh giá</button>
            <span className="mt-2">Hoặc</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input
                {...register("name")}
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Họ và tên"
                autoComplete="off"
              />
              <div className="invalid-feedback">{errors.name?.message}</div>
            </div>

            <div className="form-group mt-3">
              <input
                {...register("email")}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Email"
                autoComplete="off"
              />
              <div className="invalid-feedback">{errors.email?.message}</div>
            </div>
            
            <div className="from-group mt-3">
              <textarea
                {...register("content")}
                className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm"
                autoComplete="off"
                style={{
                  minHeight: "100px"
                }}
              />
              <div className="invalid-feedback">{errors.content?.message}</div>
            </div>

            <div className="d-flex align-items-center flex-column mt-2">
              <span className="font-weight-bold h6">Bạn cảm thấy sản phẩm thế nào</span>
              <div className="d-flex justify-content-center mt-1">
                <div className="d-flex align-items-center flex-column mr-4" style={{cursor: "pointer"}} onClick={() => {handleSelectStar(1)}}>
                  <StarRatings
                    starRatedColor={rateValue >=1 ? "orange" : "black"}
                    rating={rateValue >= 1 ? 1 : 0}
                    numberOfStars={1}
                    starDimension="18px"
                  />
                  <span>Rất tệ</span>
                </div>
                <div className="d-flex align-items-center flex-column mr-4" style={{cursor: "pointer"}} onClick={() => {handleSelectStar(2)}}>
                  <StarRatings
                    starRatedColor={rateValue >= 2 ? "orange" : "black"}
                    rating={rateValue >= 2 ? 1 : 0}
                    numberOfStars={1}
                    starDimension="18px"
                  />
                  <span>Tệ</span>
                </div>
                <div className="d-flex align-items-center flex-column mr-4" style={{cursor: "pointer"}} onClick={() => {handleSelectStar(3)}}>
                  <StarRatings
                    starRatedColor={rateValue >= 3 ? "orange" : "black"}
                    rating={rateValue >= 3 ? 1 : 0}
                    numberOfStars={1}
                    starDimension="18px"
                  />
                  <span>Bình thường</span>
                </div>
                <div className="d-flex align-items-center flex-column mr-4" style={{cursor: "pointer"}} onClick={() => {handleSelectStar(4)}}>
                  <StarRatings
                    starRatedColor={rateValue >= 4 ? "orange" : "black"}
                    rating={rateValue >= 4 ? 1 : 0}
                    numberOfStars={1}
                    starDimension="18px"
                  />
                  <span>Tốt</span>
                </div>
                <div className="d-flex align-items-center flex-column mr-4" style={{cursor: "pointer"}} onClick={() => {handleSelectStar(5)}}>
                  <StarRatings
                    starRatedColor={rateValue >= 5 ? "orange" : "black"}
                    rating={rateValue >= 5 ? 1 : 0}
                    numberOfStars={1}
                    starDimension="18px"
                  />
                  <span>Rất tốt</span>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-danger w-100 rounded-pill mt-3">
              Gửi đánh giá
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

const mapStateToProps = ({
  analyticalReducer,
}) => ({
  loadingPage: analyticalReducer.loadingPage,
});

export default connect(mapStateToProps, {})(EvaluateModal);
