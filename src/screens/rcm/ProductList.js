import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import ProductCard from '../../components/rcm/ProductCard';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  REACT_APP_PUBLIC_BACKEND_URL,
} from "../../constant/constant";

const qs = require('query-string');

const ProductList = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadMore, setIsLoadMore] = React.useState(false);
  const [products, setProducts] = React.useState(undefined);
  const [paginateData, setPaginateData] = React.useState(undefined);

  const [queryString, setQueryString] = React.useState({per_page: 20});

  const constructQueryString = (need) => {
    var result = "";
    for (const key in need) {
      if (result.length > 0) {
        result += "&" + key + "=" + need[key];
      } else {
        result += "?" + key + "=" + need[key];
      }
    }

    return result;
  }

  React.useEffect(() => {
    const parsed = qs.parse(window.location.search);
    fetch(`${REACT_APP_PUBLIC_BACKEND_URL}/api/product/product_type_id/${parsed.product_type_id}${constructQueryString({per_page: 20})}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error_code === 200) {
        setProducts(data?.payload?.data);
        setPaginateData({
          ...data?.payload,
          data: undefined,
        });
      }

      setIsLoading(false);
    })
    .catch(error => {
      console.error(error);
      setIsLoading(false);
    })
  }, []);

  const handleLoadMore = () => {
    setIsLoadMore(true);
    fetch(`${paginateData?.next_page_url}&${constructQueryString(queryString).replace('?', '')}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error_code === 200) {
        setProducts(prev => ([...prev, ...data?.payload?.data]));
        setPaginateData({
          ...data?.payload,
          data: undefined,
        });
      } 

      setIsLoadMore(false);
    })
    .catch(error => {
      console.error(error);
      setIsLoadMore(false);
    })
  }

  const handlePriceDesc = () => {
    setIsLoading(true);
    const parsed = qs.parse(window.location.search);
    const forkQs = {
      ...queryString,
      price_order: 'desc'
    }
    setQueryString(forkQs);

    fetch(`${REACT_APP_PUBLIC_BACKEND_URL}/api/product/${parsed.product_type_id}${constructQueryString(forkQs)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error_code === 200) {
        setProducts(data?.payload?.data);
        setPaginateData({
          ...data?.payload,
          data: undefined,
        });
      }

      setIsLoading(false);
    })
    .catch(error => {
      console.error(error);
      setIsLoading(false);
    })
  }

  const handlePriceAsc = () => {
    setIsLoading(true);
    const forkQs = {
      ...queryString,
      price_order: 'asc'
    }
    setQueryString(forkQs);

    const parsed = qs.parse(window.location.search);
    fetch(`${REACT_APP_PUBLIC_BACKEND_URL}/api/product/${parsed.product_type_id}${constructQueryString(forkQs)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error_code === 200) {
        setProducts(data?.payload?.data);
        setPaginateData({
          ...data?.payload,
          data: undefined,
        });
      }

      setIsLoading(false);
    })
    .catch(error => {
      console.error(error);
      setIsLoading(false);
    })
  }

  return (
    <div className="container-xl pt-3" style={{flex: 1}}>
      {/* <p className="h6 mt-3 font-weight-bold">Chọn theo tiêu chí</p>
      <div className="d-flex justify-content-start">
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={
            <Popover id={`popover-positioned- right`}>
              <Popover.Title as="h3">{`Popover 'Click'`}</Popover.Title>
              <Popover.Content>
                <strong>Holy guacamole!</strong> Check this info.
              </Popover.Content>
            </Popover>
          }
        >
          <button className="btn btn-info mr-1">
            <i className="fa fa-money"/> Giá
          </button>
        </OverlayTrigger>
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={
            <Popover id={`popover-positioned- right`}>
              <Popover.Title as="h3">{`Popover 'Click'`}</Popover.Title>
              <Popover.Content>
                <strong>Holy guacamole!</strong> Check this info.
              </Popover.Content>
            </Popover>
          }
        >
          <button className="btn btn-info mr-1">
            Loại điện thoại <i className="fa fa-caret-square-o-down"/>
          </button>
        </OverlayTrigger>
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={
            <Popover id={`popover-positioned- right`}>
              <Popover.Title as="h3">{`Popover 'Click'`}</Popover.Title>
              <Popover.Content>
                <strong>Holy guacamole!</strong> Check this info.
              </Popover.Content>
            </Popover>
          }
        >
          <button className="btn btn-info mr-1">
            Tính năng camera <i className="fa fa-caret-square-o-down"/>
          </button>
        </OverlayTrigger>

        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={
            <Popover id={`popover-positioned- right`}>
              <Popover.Title as="h3">{`Popover 'Click'`}</Popover.Title>
              <Popover.Content>
                <strong>Holy guacamole!</strong> Check this info.
              </Popover.Content>
            </Popover>
          }
        >
          <button className="btn btn-info mr-1">
            Bộ nhớ trong <i className="fa fa-caret-square-o-down"/>
          </button>
        </OverlayTrigger>
        
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={
            <Popover id={`popover-positioned- right`}>
              <Popover.Title as="h3">{`Popover 'Click'`}</Popover.Title>
              <Popover.Content>
                <strong>Holy guacamole!</strong> Check this info.
              </Popover.Content>
            </Popover>
          }
        >
          <button className="btn btn-info mr-1">
            Nhu cầu sử dụng <i className="fa fa-caret-square-o-down"/>
          </button>
        </OverlayTrigger>
      </div> */}
      <p className="h6 mt-3 font-weight-bold">Sắp xếp theo</p>
      <div className="d-flex justify-content-start">
        <button className="btn btn-info mr-1" onClick={handlePriceDesc}>
          <i className="fa fa-sort-amount-desc"/> Giá cao - thấp
        </button>
        <button className="btn btn-info mr-1" onClick={handlePriceAsc}>
          <i className="fa fa-sort-amount-asc"/> Giá thấp - cao
        </button>
        <button className="btn btn-info mr-1">
          <i className="icon icon-badge"/> Khuyến mãi hot
        </button>
      </div>

      {
        isLoading ? (
          <div className="mt-4">
            <Skeleton height={200} count={3}/>
          </div>
        ) : (
          <div className="d-flex flex-wrap mt-4">
            {
              products?.map((product, index) => {
                return (
                  <div key={index} className="mx-2" style={{width: "250px"}}>
                    <ProductCard
                      image={product.image_1}
                      name={product.name}
                      officialPrice={product.official_price}
                      originPrice={product.origin_price}
                      catagories={["RED", "BEATS", "HEADPHONE"]}
                      rate={product.average_evaluation}
                      linkTo={`/rcm/product_detail?id=${product.id}`}
                    />
                  </div>
                )
              })
            }
          </div>
        )
      }

      <div className="d-flex justify-content-center mb-5">
        <Button
          variant="info"
          onClick={handleLoadMore}
          disabled={paginateData?.next_page_url === null || isLoadMore}
        >
          {
            isLoadMore ? 'Đang tải ...' : 'Xem thêm'
          }
        </Button>
      </div>
    </div>
  )
}

const mapStateToProps = ({
  analyticalReducer,
}) => ({
  loadingPage: analyticalReducer.loadingPage,
});

export default connect(mapStateToProps, {})(ProductList);
