import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import ProductCard from '../../components/rcm/ProductCard';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  REACT_APP_PUBLIC_BACKEND_URL,
} from "../../constant/constant";
import createAxios from '../../util/createAxios';

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
      result += "&" + key + "=" + need[key];
    }

    return result;
  }

  React.useEffect(() => {
    const parsed = qs.parse(window.location.search);
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`/api/product_version?product_versions.product_type_id=${parsed.product_type_id}${constructQueryString({per_page: 20})}`, {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {
        setProducts(response.data?.payload?.data);
        setPaginateData({
          ...response.data?.payload,
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
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`${paginateData?.next_page_url}&${constructQueryString(queryString).replace('?', '')}`.replace(REACT_APP_PUBLIC_BACKEND_URL, ''), {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {
        setProducts(prev => ([...prev, ...response.data?.payload?.data]));
        setPaginateData({
          ...response.data?.payload,
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
    // setIsLoading(true);
    // const parsed = qs.parse(window.location.search);
    // const forkQs = {
    //   ...queryString,
    //   price_order: 'desc'
    // }
    // setQueryString(forkQs);

    // createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    // .get(`/api/product/${parsed.product_type_id}${constructQueryString(forkQs)}`, {withCredentials: true})
    // .then(response => {
    //   if (response.data.error_code === 200) {
    //     setProducts(response.data?.payload?.data);
    //     setPaginateData({
    //       ...response.data?.payload,
    //       data: undefined,
    //     });
    //   }

    //   setIsLoading(false);
    // })
    // .catch(error => {
    //   console.error(error);
    //   setIsLoading(false);
    // })
  }

  const handlePriceAsc = () => {
    // setIsLoading(true);
    // const forkQs = {
    //   ...queryString,
    //   price_order: 'asc'
    // }
    // setQueryString(forkQs);

    // const parsed = qs.parse(window.location.search);
    // createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    // .get(`/api/product/${parsed.product_type_id}${constructQueryString(forkQs)}`, {withCredentials: true})
    // .then(response => {
    //   if (response.data.error_code === 200) {
    //     setProducts(response.data?.payload?.data);
    //     setPaginateData({
    //       ...response.data?.payload,
    //       data: undefined,
    //     });
    //   }

    //   setIsLoading(false);
    // })
    // .catch(error => {
    //   console.error(error);
    //   setIsLoading(false);
    // })
  }

  return (
    <div className="container-xl pt-3" style={{flex: 1}}>
      {/* <p className="h6 mt-3 font-weight-bold">Ch???n theo ti??u ch??</p>
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
            <i className="fa fa-money"/> Gi??
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
            Lo???i ??i???n tho???i <i className="fa fa-caret-square-o-down"/>
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
            T??nh n??ng camera <i className="fa fa-caret-square-o-down"/>
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
            B??? nh??? trong <i className="fa fa-caret-square-o-down"/>
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
            Nhu c???u s??? d???ng <i className="fa fa-caret-square-o-down"/>
          </button>
        </OverlayTrigger>
      </div> */}
      <p className="h6 mt-3 font-weight-bold">S???p x???p theo</p>
      <div className="d-flex justify-content-start">
        <button className="btn btn-info mr-1" onClick={handlePriceDesc}>
          <i className="fa fa-sort-amount-desc"/> Gi?? cao - th???p
        </button>
        <button className="btn btn-info mr-1" onClick={handlePriceAsc}>
          <i className="fa fa-sort-amount-asc"/> Gi?? th???p - cao
        </button>
        <button className="btn btn-info mr-1">
          <i className="icon icon-badge"/> Khuy???n m??i hot
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
                      image={product.default_image}
                      name={product.name}
                      officialPrice={product.official_price}
                      originPrice={product.origin_price}
                      catagories={["RED", "BEATS", "HEADPHONE"]}
                      rate={product.average_evaluation}
                      linkTo={`/rcm/product_detail?id=${product.id}&product_id=${product.product_id}`}
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
            isLoadMore ? '??ang t???i ...' : 'Xem th??m'
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
