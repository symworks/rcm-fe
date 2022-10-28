import React from "react";
import { Image, Modal } from "react-bootstrap";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../../constant/constant";
import createAxios from "../../util/createAxios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import _ from 'lodash';
import { NotificationContextTemp } from "../../providers/NotificationProvider";

const ProductVersionModalImage = React.forwardRef(({handleAddFinal = undefined, handleUpdateFinal = undefined, handleDeleteFinal = undefined, ...rest}, ref) => {
  const [show, setShow] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { setNotificationState } = React.useContext(NotificationContextTemp);

  const [initialImages, setInitialImages] = React.useState([]);
  const [images, setImages] = React.useState([]);
  const [submitState, setSubmitState] = React.useState({
    showFailed: false,
    totalRequested: 0,
    totalResponsed: 0,
  });
  React.useImperativeHandle(ref, () => ({
    handleAdd: () => {
      setShow(true);
    },
    handleEdit: (data) => {
      setIsLoading(true);
      createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
      .get(`/api/product_image?use_paginate=false&match_col=product_id&match_key=${data.product_id}`, {withCredentials: true})
      .then(response => {
        if (response.data.error_code === 200) {
          setImages([...response.data.payload]);
          setInitialImages([...response.data.payload]);
        }

        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      })

      setShow(true);
    },
  }));

  const onSubmit = (event) => {
    event.preventDefault();
    const insertImages = _.difference(images, initialImages);
    const deleteImages = _.difference(initialImages, images);

    setSubmitState(prev => {
      return {
        ...prev,
        totalRequested: insertImages.length + deleteImages.length,
      };
    });

    insertImages.forEach(item => {
      createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
      .post(`/api/product_image`, {
        ...item
      }, {withCredentials: true})
      .then(response => {
        if (response.data.error_code === 200) {
          setSubmitState(prev => {
            return {
              ...prev,
              totalResponsed: prev.totalResponsed + 1,
            }
          })
        } else {
          setSubmitState(prev => {
            return {
              ...prev,
              totalResponsed: prev.totalResponsed + 1,
              showFailed: true,
            }
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
    });

    deleteImages.forEach(item => {
      createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
      .delete(`/api/product_image/${item.id}`, {withCredentials: true})
      .then(response => {
        if (response.data.error_code === 200) {
          setSubmitState(prev => {
            return {
              ...prev,
              totalResponsed: prev.totalResponsed + 1,
            }
          });
        } else {
          setSubmitState(prev => {
            return {
              ...prev,
              totalResponsed: prev.totalResponsed + 1,
              showFailed: true,
            }
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
    });
  };

  const handleRemoveItem = (item) => {
    setImages(prev => {
      const idx = prev.indexOf(item);
      if (idx > -1) {
        prev.splice(idx, 1);
      }

      return [...prev];
    })
  }

  React.useState(() => {
    if (submitState.totalRequested === 0 || submitState.totalRequested !== submitState.totalResponsed) {
      return;
    }

    if (submitState.showFailed) {
      setNotificationState({
        notificationType: "error",
        dialogText: "Thao tác thất bại",
        isShow: true,
      });
    } else {
      setNotificationState({
        notificationType: "info",
        dialogText: "Thao tác thành công",
        isShow: true,
      });
    }

  }, [submitState]);

  return (
    <div {...rest}>
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
        <form onSubmit={(event) => {onSubmit(event);}}>
          <Modal.Body>
              {
                isLoading ? (
                  <Skeleton height="30px"/>
                ) : (
                  <div className="row">
                    {
                      images.map((item, index) => {
                        return (
                          <div key={index} className="col-3 my-2">
                            <div className="d-flex align-items-end justify-content-end" span='XL1 L1 M1 S1'>
                              <div
                                onClick={() => {handleRemoveItem(item);}}
                                style={{cursor: "pointer"}}
                              >
                                <i className="icon-close"></i>
                              </div>
                            </div>
                            <Image
                              className="w-100"
                              src={`${item.image_url}`}
                            />
                          </div> 
                        )
                      })
                    }

                    <div className="col-3 my-2">
                      <span
                        className="w-100 h-100 border d-flex justify-content-center align-items-center"
                        style={{fontSize: "50px", cursor: "pointer"}}
                      >+</span>
                    </div>
                  </div>
                )
              }
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn btn-outline-info">Cập nhật</button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
});

export default ProductVersionModalImage;
