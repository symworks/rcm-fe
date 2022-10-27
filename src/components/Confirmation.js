import React from 'react';
import { Modal } from 'react-bootstrap';

const Confirmation = React.forwardRef(({title, detail, handleOnYes, handleOnNo, ...rest}, ref) => {
  const [showState, setShowState] = React.useState(false);
  const handleOnYesImpl = () => {
    if (handleOnYes) {
      handleOnYes();
    }

    setShowState(false);
  }

  const handleOnNoImpl = () => {
    if (handleOnNo) {
      handleOnNo();
    }

    setShowState(false);
  }

  React.useImperativeHandle(ref, () => ({
    handleOpen: () => {
      setShowState(true);
    },
  }));

  return (
    <div {...rest}>
      <Modal
        show={showState}
        onHide={() => {setShowState(false);}}
        backdrop="static"
        size="md" 
      >
        <Modal.Header closeButton>
          <div className="h6 font-weight-bold">{title}</div>
        </Modal.Header>
        <Modal.Body>
          <div>{detail}</div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-default" onClick={handleOnNoImpl}>Đóng</button>
          <button className="btn btn-outline-danger" onClick={handleOnYesImpl}>Xác nhận</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

export default Confirmation;
