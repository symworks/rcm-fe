import React from 'react';
import { connect } from 'react-redux';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";
import {
  REACT_APP_PUBLIC_BACKEND_URL,
} from "../../constant/constant";
import StarRatings from "react-star-ratings";
import { Card, Image, OverlayTrigger, ProgressBar, Tooltip } from 'react-bootstrap';
import moment from "moment";
import EvaluateModal from './EvaluateModal';
import {useHistory} from 'react-router-dom';
import _ from 'lodash';

const qs = require('query-string');

const ProductDetail = () => {
  const parsed = qs.parse(window.location.search);

  const [product, setProduct] = React.useState(undefined);
  const [images, setImages] = React.useState([]);
  const [productVersions, setProductVersions] = React.useState([]);
  const [productColorQties, setProductColorQties] = React.useState(undefined);
  const [productEvaluates, setProductEvaluates] = React.useState([]);

  const [productEvaluatesPaginate, setProductEvaluatesPaginate] = React.useState(undefined);
  const [activeProductVersion, setActiveProductVersion] = React.useState(0);
  const [activeProductColorQty, setActiveProductColorQty] = React.useState(0);

  const [loadingProductCount, setLoadingProductCount] = React.useState(0);
  const [loadingProductVersionsCount, setLoadingProductVersionsCount] = React.useState(0);
  const [loadingProductColorQtiesCount, setLoadingProductColorQtiesCount] = React.useState(0);
  const [loadingEvaluationCount, setLoadingEvaluationCount] = React.useState(0);
  const [loadMoreCount, setLoadMoreCount] = React.useState(0);

  React.useEffect(() => {
    setLoadingProductCount(prev => ++prev);
    fetch(`${REACT_APP_PUBLIC_BACKEND_URL}/api/product/product_id/${parsed.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error_code === 200 && data?.payload.length === 1) {
        setProduct(data.payload[0]);
        for (let i = 1; i < 6; ++i) {
          if (data?.payload[0][`image_${i}`] !== undefined) {
            setImages((prev) => ([
              ...prev,
              {
                original: data.payload[0][`image_${i}`],
                thumbnail: data.payload[0][`image_${i}`],
              }
            ]));
          }
        }
      }

      setLoadingProductCount(prev => --prev);
    })
    .catch(error => {
      console.error(error);
      setLoadingProductCount(prev => --prev);
    })

    setLoadingProductVersionsCount(prev => ++prev);
    fetch(`${REACT_APP_PUBLIC_BACKEND_URL}/api/product_version?per_page=5&product_id=${parsed.id}&qty_critical=instock`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error_code === 200) {
        setProductVersions(data?.payload);

        for (let i = 0; i < data?.payload?.data.length; ++i) {
          if (data.payload.data[i].is_default === true) {
            setActiveProductVersion(i);
            break;
          }
        }

      }

      setLoadingProductVersionsCount(prev => --prev);
    })
    .catch(error => {
      console.error(error);
      setLoadingProductVersionsCount(prev => --prev);
    });

    setLoadMoreCount(prev => ++prev);
    fetch(`${REACT_APP_PUBLIC_BACKEND_URL}/api/product_evaluate/with_created_user?per_page=15&product_id=${parsed.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error_code === 200) {
        setProductEvaluates(data?.payload?.data);
        setProductEvaluatesPaginate({
          ...data?.payload,
          data: undefined,
        })
      }

      setLoadMoreCount(prev => --prev);
    })
    .catch(error => {
      console.error(error);

      setLoadMoreCount(prev => --prev);
    });
  }, []);

  React.useEffect(() => {
    if (!productVersions || !productVersions.data || productVersions.data.length < activeProductVersion) {
      return;
    }

    setLoadingProductColorQtiesCount(prev => ++prev);

    fetch(`${REACT_APP_PUBLIC_BACKEND_URL}/api/product_color_qty/with_name?per_page=15&product_version_id=${productVersions.data?.[activeProductVersion]?.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error_code === 200) {
        setProductColorQties(data?.payload);
      }

      setLoadingProductColorQtiesCount(prev => --prev);
    })
    .catch(error => {
      console.error(error);

      setLoadingProductColorQtiesCount(prev => --prev);
    })
  }, [productVersions, activeProductVersion]);

  const handleSelectProductVersion = (index) => {
    setActiveProductVersion(index);
  }

  const handleLoadMore = () => {
    setLoadMoreCount(prev => ++prev);
    fetch(`${productEvaluatesPaginate?.next_page_url}&per_page=15&product_id=${parsed.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error_code === 200) {
        setProductEvaluates(prev => [
          ...prev,
          ...data?.payload?.data,
        ]);
        setProductEvaluatesPaginate({
          ...data?.payload,
          data: undefined,
        })
      }

      setLoadMoreCount(prev => --prev);
    })
    .catch(error => {
      console.error(error);

      setLoadMoreCount(prev => --prev);
    });
  }

  const handleAfterSubmitEvaluateModal = () => {
    setLoadingProductCount(prev => ++prev);
    fetch(`${REACT_APP_PUBLIC_BACKEND_URL}/api/product/product_id/${parsed.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error_code === 200 && data?.payload.length === 1) {
        setProduct(data.payload[0]);
        for (let i = 1; i < 6; ++i) {
          if (data?.payload[0][`image_${i}`] !== undefined) {
            setImages((prev) => ([
              ...prev,
              {
                original: data.payload[0][`image_${i}`],
                thumbnail: data.payload[0][`image_${i}`],
              }
            ]));
          }
        }
      }

      setLoadingProductCount(prev => --prev);

      setLoadMoreCount(prev => ++prev);
      fetch(`${REACT_APP_PUBLIC_BACKEND_URL}/api/product_evaluate/with_created_user?per_page=15&product_id=${parsed.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.error_code === 200) {
          setProductEvaluates(data?.payload?.data);
          setProductEvaluatesPaginate({
            ...data?.payload,
            data: undefined,
          })
        }

        setLoadMoreCount(prev => --prev);
      })
      .catch(error => {
        console.error(error);

        setLoadMoreCount(prev => --prev);
      });
    })
    .catch(error => {
      console.error(error);
      setLoadingProductCount(prev => --prev);
    })
  };

  const history = useHistory();

  const handleByNowClick = () => {
    var storageProducts = JSON.parse(localStorage.getItem('products'));
    if (!storageProducts) {
      storageProducts = [];
    }

    var doNotUpdateStorage = false;
    for (let i = 0; i < storageProducts.length; i++) {
      if (storageProducts[i].productId == parsed.id && 
            productVersions?.data.length > 0 &&
            storageProducts[i].productVersion &&
            storageProducts[i].productVersion.id == productVersions.data[activeProductVersion].id && 
            productColorQties?.data.length > 0 &&
            storageProducts[i].productColorQty &&
            storageProducts[i].productColorQty.id == productColorQties.data[activeProductColorQty].id) {
        doNotUpdateStorage = true;
        break;
      }
    }

    if (!doNotUpdateStorage) {
      var needUpdate = {
        productId: parseInt(parsed.id),
        qty: 1,
      }
  
      if (productVersions?.data.length > 0) {
        needUpdate.productVersion = {
          id: productVersions.data[activeProductVersion].id,
          name: productVersions.data[activeProductVersion].name,
        }
      }
  
      if (productColorQties?.data.length > 0) {
        needUpdate.productColorQty = {
          id: productColorQties.data[activeProductColorQty].id,
          name: productColorQties.data[activeProductColorQty].name,
        }
      }
  
      localStorage.setItem('products', JSON.stringify(_.union(storageProducts, [needUpdate])));
    }

    history.push('/rcm/cart');
  };

  const handleAddToCartClick = () => {

  };

  return (
    <div className="container-xl pt-3" style={{flex: 1}}>
      {
        loadingProductCount !== 0 ? (
          <Skeleton/>
        ) : (
          <div className="d-flex align-items-end">
            <div>
              <span className="h5 font-weight-bold text-dark mr-2 align-bottom">{product?.name}</span>
            </div>
            <div className="mb-1 mr-2">
              <StarRatings
                starRatedColor="orange"
                rating={product?.average_evaluation}
                numberOfStars={5}
                starDimension="18px"
                starSpacing="2px"
              />
            </div>
            <div>
              <span className="align-bottom">{product?.total_evaluation} đánh giá</span>
            </div>
          </div>
        )
      }

      <div className="row mt-3">
        <div className="col-4">
          <ImageGallery showFullscreenButton={false} autoPlay={true} items={images || []}/>
        </div>
        <div className="col-4">
          {
            loadingProductVersionsCount !== 0 ? (
              <></>
            ) : (
              <div>
                {
                  productVersions?.data?.length > 0 && (
                    <div>
                      <span className="mr-4 text-danger h4"><strong>{productVersions?.data[activeProductVersion].official_price.toLocaleString('it-IT', {style: 'currency', currency: 'VND'}).replace('VND', 'đ')}</strong></span>
                      {
                        product?.origin_price !== "" && (
                          <span className="text-secondary h5"><del><strong>{productVersions?.data[activeProductVersion].origin_price.toLocaleString('it-IT', {style: 'currency', currency: 'VND'}).replace('VND', 'đ')}</strong></del></span>
                        )
                      }
                    </div>
                  )
                }
              </div>
            )
          }

          <div className="row">
            {
              productVersions?.data?.map((productVersion, index) => {
                return (
                  <div key={index} className="col-sm-12 col-lg-4 px-1 mt-2">
                    <button
                      onClick={() => {handleSelectProductVersion(index)}}
                      className={`w-100 h-100 ${activeProductVersion === index ? "btn btn-info" : "btn btn-outline-info"}`}
                      disabled={activeProductVersion.instock_qty <= 0}
                    >
                      <span className="font-weight-bold h6">{productVersion.name}</span>
                      <p className="h6 mt-2">{productVersion.official_price.toLocaleString('it-IT', {style: 'currency', currency: 'VND'}).replace('VND', 'đ')}</p>
                    </button>
                  </div>
                )
              })
            }
          </div>

          {
            productColorQties?.data?.length > 0 && (
              <div className="mt-3 h6 font-weight-bold">
                <span>Chọn màu sản phẩm</span>
              </div>
            )
          }

          {
            loadingProductColorQtiesCount !== 0 ? (
              <div className="row mt-1">
                <div className="col-sm-6 col-lg-4 px-1 mt-2">
                  <Skeleton height={"80px"}/>
                </div>
                <div className="col-sm-6 col-lg-4 px-1 mt-2">
                  <Skeleton height={"80px"}/>
                </div>
                <div className="col-sm-6 col-lg-4 px-1 mt-2">
                  <Skeleton height={"80px"}/>
                </div>
                <div className="col-sm-6 col-lg-4 px-1 mt-2">
                  <Skeleton height={"80px"}/>
                </div>
                <div className="col-sm-6 col-lg-4 px-1 mt-2">
                  <Skeleton height={"80px"}/>
                </div>
                <div className="col-sm-6 col-lg-4 px-1 mt-2">
                  <Skeleton height={"80px"}/>
                </div>
              </div>
            ) : (
              <div className="row mt-1">
                {
                  productColorQties?.data?.map((productColorQty, index) => {
                    return (
                      <div key={index} className="col-sm-6 col-lg-4 px-1 mt-2">
                        <button
                          onClick={() => {setActiveProductColorQty(index)}}
                          className={activeProductColorQty === index ? "w-100 h-100 btn btn-info" : "w-100 h-100 btn btn-outline-info"}
                        >
                          <span className="font-weight-bold h6">{productColorQty?.name}</span>
                        </button>
                      </div>
                    )
                  })
                }
              </div>
            )
          }

          <div className="row">
            <div className="col-10 mt-3 px-1">
              <button className="btn btn-danger w-100" onClick={handleByNowClick}>
                <div className="d-flex align-item-center flex-column py-1">
                  <span>Mua ngay</span>
                  <span>(Giao hàng tận nơi)</span>
                </div>
              </button>
            </div>
            <div className="col-2 mt-3 px-1">
              <OverlayTrigger
                overlay={
                  <Tooltip>
                    Thêm vào giỏ hàng
                  </Tooltip>
                }
              >
                <button className="btn btn-outline-info h-100 w-100" onClick={handleAddToCartClick}>
                  <span className="fa fa-shopping-cart"></span>
                </button>
              </OverlayTrigger>
            </div>
          </div>
        </div>
        <div className="col-4">
          <Card>
            <Card.Body>
              <p className="font-weight-bold h6">Thông tin sản phẩm</p>
              <p>{product?.product_info}</p>
            </Card.Body>
          </Card>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-sm-12 col-lg-8">
          <Card>
            <Card.Body>
              <p className="h5 text-danger text-center font-weight-bold">Đặc điểm nổi bật</p>
              <p className="bg-light p-3 rounded-xxl">
                {product?.top_features}
              </p>

              <p>
                {product?.description}
              </p>
            </Card.Body>
          </Card>
        </div>
        <div className="col-sm-12 col-sm-4">

        </div>
      </div>

      <div className="row mt-1">
        <div className="col-sm-12 col-lg-8">
          <Card>
            <Card.Body>
              <p className="font-weight-bold h6">
                Đánh giá và nhận xét sản phẩm
              </p>

              {
                loadingEvaluationCount !== 0 ? (
                  <Skeleton height="80px"/>
                ) : (
                  <>
                    <div className="border row mx-2 mt-3">
                      <div className="border-right col-sm-12 col-lg-3 d-flex justify-content-center align-items-center flex-column pt-2">
                        <p className="h4 font-weight-bold">{product?.average_evaluation?.toFixed(1)} / 5.0</p>
                        <StarRatings
                          starRatedColor="orange"
                          rating={product?.average_evaluation}
                          numberOfStars={5}
                          starDimension="20px"
                          starSpacing="2px"
                        />
                        <p className="text-center mt-2"><span className="font-weight-bold h6">{product?.total_evaluation}</span> đánh giá và nhận xét</p>
                      </div>
                      <div className="col-sm-12 col-lg-9 d-flex justify-content-center align-items-left flex-column pb-2">
                        {
                          [5, 4, 3, 2, 1].map((numStar, index) => {
                            return (
                              <div key={index} className="mt-2 d-flex justify-content-start">
                                <div className="mr-2 mt-1">
                                  <span className="font-weight-bold h6">{numStar}</span>
                                </div>
                                <div className="mr-3">
                                  <StarRatings
                                    starRatedColor="orange"
                                    rating={1}
                                    numberOfStars={1}
                                    starDimension="18px"
                                  />
                                </div>
                                <div className="flex-fill align-self-end mb-1">
                                  <ProgressBar
                                    className="progress"
                                    variant="danger"
                                    now={80}
                                    style={{height: "13px"}}
                                  />
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  </>
                )
              }

              <div className="d-flex align-items-center flex-column mt-3">
                <span>Bạn đánh giá sao sản phẩm này?</span>
                <EvaluateModal className="mt-2" productId={parsed.id} handleAfterSubmitEvaluateModal={handleAfterSubmitEvaluateModal}/>
              </div>

              <div className="mt-4">
                <div>
                  {
                    productEvaluates?.map((productEvaluate, index) => {
                      return (
                        <div className="mb-3" key={index}>
                          <div className="d-flex justify-content-between">
                            <div>
                              <Image className="mr-3 rounded" src={productEvaluate.avatar} height={30}/>
                              <span className="font-weight-bold h6">{productEvaluate.name}</span>
                            </div>
                            <span>{moment(productEvaluate.created_at).format('DD:MM:YYYY hh:mm')}</span>
                          </div>

                          <div className="bg-light px-5 mt-2 rounded py-2">
                            <div className="d-flex justify-content-left">
                              <div className="mr-1 mt-1">
                                <span className="font-weight-bold">Đánh giá:</span>
                              </div>
                              <div>
                                <StarRatings
                                  starRatedColor="orange"
                                  rating={productEvaluate.rate_value}
                                  numberOfStars={5}
                                  starDimension="14px"
                                  starSpacing="2px"
                                />
                              </div>
                            </div>
                            <div>
                              <span className="font-weight-bold mr-1">Nhận xét:</span>
                              <span>{productEvaluate.content}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }

                  <div className="d-flex justify-content-center my-2">
                    <button
                      className="btn btn-info"
                      onClick={handleLoadMore}
                      disabled={productEvaluatesPaginate?.next_page_url === null || loadMoreCount !== 0}
                    >
                      {
                        loadMoreCount !== 0 ? 'Đang tải ...' : 'Xem thêm'
                      }
                    </button>
                  </div>
                </div>

                {
                  loadMoreCount !== 0 && (
                    <Skeleton height="40px"/>
                  )
                }
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-sm-12 col-lg-4">

        </div>
      </div>

      <div className="row mt-3">
        <div className="col-sm-12 col-lg-4">
          <form>
            <div className="form-group">

            </div>
          </form>
        </div>
        <div className="col-sm-12 col-lg-8">

        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({
  analyticalReducer,
}) => ({
  loadingPage: analyticalReducer.loadingPage,
});

export default connect(mapStateToProps, {})(ProductDetail);
