import React from "react";
import { connect } from "react-redux";
import {
  Modal,
  Button,
} from "react-bootstrap";
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";
import {
  REACT_APP_PUBLIC_BACKEND_URL,
} from "../../constant/constant";
import createAxios from "../../util/createAxios";

const CategoryPopover = ({productTypes, adsCampaigns, isLoading}) => {
  const [loadingModalData, setLoadingModalData] = React.useState(true);
  const [modalData, setModalData] = React.useState(undefined);
  const [show, setShow] = React.useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = (productId) => {
    setShow(true);
    setLoadingModalData(true);
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`/api/ui/rcm/category_menu/${productId}`, {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {
        setModalData(response.data.payload);
      }
      setLoadingModalData(false);
    })
    .catch(error => {
      console.error(error);
      setLoadingModalData(false);
    });
  }

  return (
    <div className="mx-4" style={{ flex: 1}}>
      <div className="row clearfix pt-3">
        <div className="col-lg-12">
          <div className="card">
            <div className="mail-inbox">
              <div className="mail-left collapse">
                <div className="mail-side">
                  <ul className="nav">
                    <Modal
                      show={show}
                      onHide={handleClose}
                      backdrop="static"
                      keyboard={false}
                      size="xl"
                      centered
                    >
                      <Modal.Body>
                        <div className="row">
                          <div className="col-lg-3">
                            <p><strong>Chọn theo hãng</strong></p>
                            {
                              loadingModalData ? (
                                <Skeleton count={10}/>
                              ) : (
                                modalData?.product_brands?.data.map((product_brand, index) => {
                                  return (
                                    <p key={index}>{product_brand.name}</p>
                                  )
                                })
                              )
                            }
                          </div>
                          <div className="col-lg-3">
                            <p><strong>Chọn theo mức giá</strong></p>
                            {
                              loadingModalData ? (
                                <Skeleton count={10}/>
                              ) : (
                                modalData?.price_ranges?.data.map((price_range, index) => {
                                  return (
                                    <p key={index}>Từ {price_range.min_price} - {price_range.max_price} đồng</p>
                                  )
                                })
                              )
                            }
                          </div>
                          <div className="col-lg-3">
                            <p><strong>Chọn theo nhu cầu</strong></p>
                            {
                              loadingModalData ? (
                                <Skeleton count={10}/>
                              ) : (
                                modalData?.product_demands?.data.map((product_demand, index) => {
                                  return (
                                    <p key={index}>{product_demand.name}</p>
                                  )
                                })
                              )
                            }
                          </div><div className="col-lg-3">
                            <p><strong>Sản phẩm hot</strong></p>
                            {
                              loadingModalData ? (
                                <Skeleton count={10}/>
                              ) : (
                                modalData?.trendings?.data.map((trending, index) => {
                                  return (
                                    <p key={index}>{trending.name}</p>
                                  )
                                })
                              )
                            }
                          </div>
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Đóng
                        </Button>
                        <Button variant="primary">Tìm kiếm</Button>
                      </Modal.Footer>
                    </Modal>
                    {
                      isLoading ? (
                        <Skeleton count={15}/>
                      ) : (
                        productTypes?.data?.map((product_type, index) => {
                          return (
                            <li key={`${index}`}>
                              <a href="#!" onClick={() => { handleShow(product_type.id); }}>
                                <i className={product_type.ui_icon}></i>{product_type.name}
                                <span className="badge badge-primary float-right">
                                  6
                                </span>
                              </a>
                            </li>
                          );
                        })
                      )
                    }
                  </ul>
                </div>
              </div>
              <div className="mail-right px-4 py-3">
                {
                  isLoading ? (
                    <Skeleton height={"310px"}/>
                  ) : (
                    <ImageGallery showFullscreenButton={false} autoPlay={true} items={adsCampaigns?.data || []}/>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {})(CategoryPopover);
