import React from 'react';
import { REACT_APP_PUBLIC_BACKEND_URL } from '../../constant/constant';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Card, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import createAxios from '../../util/createAxios';

const Cart = () => {
  const [loadingProductCount, setLoadingProductCount] = React.useState(0);
  const [products, setProducts] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState(0);

  const history = useHistory();

  React.useEffect(() => {
    const finalProducts = [];
    const storageStr = localStorage.getItem('products');
    if (!storageStr) {
      return;
    }

    const storageProducts = JSON.parse(storageStr);
    var queryParams = "";
    storageProducts.forEach(product => {
      finalProducts.push({
        productVersion: product.productVersion,
        productColorQty: product.productColorQty,
        qty: product.qty,
      });

      queryParams += '&match_keys[]=' + product.productVersion.id;
    });

    if (queryParams.length == 0) {
      return;
    }

    queryParams = queryParams.slice(1, queryParams.length);
    setLoadingProductCount(prev => ++prev);
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`/api/product_version?match_col=product_versions.id&${queryParams}&use_paginate=false`, {withCredentials: true})
    .then(response => {
      if (response.data.error_code == 200) {
        response.data.payload.forEach((payloadItem) => {
          var currentProductVersion = finalProducts.find(productVersionItem => productVersionItem.productVersion.id == payloadItem.id);
          currentProductVersion && (currentProductVersion.productPayload = payloadItem);
        });

        setProducts(finalProducts);
      }

      setLoadingProductCount(prev => --prev);
    })
    .catch(error => {
      console.error(error);
      setLoadingProductCount(prev => --prev);
    });

  }, []);

  const handleClearCart = (index) => {
    var storageProducts = localStorage.getItem('products');
    if (!storageProducts) {
      return;
    }

    storageProducts = JSON.parse(storageProducts);
    storageProducts.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(storageProducts));
    setProducts(prev => {prev.splice(index, 1);return [...prev];});
  };

  const handleStartOrder = () => {
    var tmpProducts = [...products];
    tmpProducts.forEach(product => {
      delete product.productPayload;
    });

    localStorage.setItem('products', JSON.stringify(tmpProducts));
    localStorage.setItem('price', totalPrice);
    history.push('/rcm/order_info');
  };

  const handleTotalProductChange = (index, value) => {
    setProducts(prev => {
      prev[index].qty = parseInt(value);
      return [...prev];
    })
  };

  React.useEffect(() => {
    var tmpPrice = 0;
    products.forEach(item => {if (item.productPayload?.official_price) {
      tmpPrice += (item.qty * item.productPayload.official_price);
    }});

    setTotalPrice(tmpPrice.toLocaleString('it-IT', {style: 'currency', currency: 'VND'}).replace('VND', '??'));
  }, [products]);

  return (
    <div className="container-sm pt-4 d-flex justify-content-center">
      <div className="w-75">
        <div className="d-flex justify-content-between mb-2">
          <a className="text-danger h6 font-weight-bold" href="/rcm"><span className="fa fa-angle-left"/> Tr??? v???</a>
          <span className="text-danger h5 font-weight-bold">Gi??? h??ng</span>
          <span></span>
        </div>
        {
          loadingProductCount !== 0 ? (
            <Skeleton/>
          ) : (
            products?.map((product, index) => {
              return (
                <Card className="mt-1" key={index}>
                  <Card.Body>
                    <div className="d-flex justify-content-center">
                      <Image className="mr-3" src={product.productPayload.default_image} height={200}/>
                      <div>
                        <div className="d-flex justify-content-between">
                          <div className="font-weight-bold h6 text-dark">{product.productVersion.name} {product?.productColorQty?.name && (' - ' + product.productColorQty.name)}</div>
                          <button className="close" onClick={() => {handleClearCart(index)}}>
                            <span className="icon icon-close"></span>
                          </button>
                        </div>
                        <div className="d-flex justify-content-start">
                          <div><span className="text-danger font-weight-bold h6 mr-3">{product.productPayload.official_price.toLocaleString('it-IT', {style: 'currency', currency: 'VND'}).replace('VND', '??')}</span></div>
                          <div><span className="text-secondary h6 mr-2"><del>{product.productPayload.origin_price.toLocaleString('it-IT', {style: 'currency', currency: 'VND'}).replace('VND', '??')} ??</del></span></div>
                          <div><span className="badge badge-danger">{`Gi???m ${((product.productPayload.origin_price - product.productPayload.official_price) * 100 / product.productPayload.origin_price).toFixed(2)} %`}</span></div>
                        </div>
                        <div className="d-flex justify-content-start align-items-center my-2">
                          <span className="mr-2">Ch???n s??? l?????ng:</span><input className="form-control" style={{width: "150px"}} type="number" min={1} value={product.qty} onChange={e => {handleTotalProductChange(index, e.target.value);}}/>
                        </div>
                        <div className="mt-2 rounded px-3 py-2" style={{backgroundColor: "#e2e3e5"}}>
                          {product.productPayload.product_info}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )
            })
          )
        }

        <Card className="mt-2">
          <Card.Body>
            <div className="d-flex justify-content-between">
              <span className="font-weight-bold h6">T???ng ti???n t???m t??nh</span>
              <span className="text-danger font-weight-bold h6">{totalPrice.toLocaleString('it-IT', {style: 'currency', currency: 'VND'}).replace('VND', '??')}</span>
            </div>
            <button className="btn btn-danger w-100 mt-2 py-3 font-weight-bold h6" onClick={handleStartOrder} disabled={products.length == 0}>Ti???n h??nh ?????t h??ng</button>
            <button className="btn btn-outline-danger w-100 mt-2 py-3 font-weight-bold h6" onClick={() => {history.push('/rcm')}}>Ch???n th??m s???n ph???m kh??c</button>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
};

export default Cart;
