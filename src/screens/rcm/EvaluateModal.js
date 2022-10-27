import React from 'react';
import { Image, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';

const EvaluateModal = ({loadingPage, ...rest}) => {
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { register, handleSubmit, setValue } = useForm();
  const onSubmit = data => {
    console.log(data);
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
                defaultValue=""
                className="form-control"
                placeholder="Họ và tên"
                autoComplete="off"
              />
              <input
                {...register("phone_numeber")}
                defaultValue=""
                className="form-control mt-3"
                placeholder="Số điện thoại"
                autoComplete="off"
              />
              <textarea
                {...register("content")}
                className="form-control mt-3"
                defaultValue=""
                placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm"
                autoComplete="off"
                style={{
                  minHeight: "100px"
                }}
              />
            </div>
            
            <button type="submit" className="btn btn-danger w-100 rounded-pill">
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
