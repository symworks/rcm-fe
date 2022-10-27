import React from 'react';
import { connect } from 'react-redux';
import CategoryPopover from '../components/rcm/CategoryPopover';
import ProductCard from '../components/rcm/ProductCard';
import { LeftArrow, RightArrow } from "../components/rcm/Arrows";
import useDrag from '../custom_hooks/useDrag';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  ScrollMenu,
  getItemsPos,
} from "react-horizontal-scrolling-menu";
import {
  REACT_APP_PUBLIC_BACKEND_URL,
} from "../constant/constant";

const Rcm = () => {
  const [productTypes, setProductTypes] = React.useState(undefined);
  const [adsCampaigns, setAdsCampaigns] = React.useState(undefined);
  const [products, setProducts] = React.useState([]);

  const [loadingMenuCount, setLoadingMenuCount] = React.useState(0);
  const [loadingProductCount, setLoadingProductsCount] = React.useState(0);

  const { dragStart, dragStop, dragMove } = useDrag();
  const handleDrag = ({ scrollContainer }) => (ev) =>
    dragMove(ev, (posDiff) => {
      if (scrollContainer.current) {
        scrollContainer.current.scrollLeft += posDiff;
      }
    }
  );

  React.useEffect(() => {
    setLoadingMenuCount(prev => ++prev);
    fetch(`${REACT_APP_PUBLIC_BACKEND_URL}/api/product_type?per_page=10&is_active=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error_code === 200) {
        setProductTypes(data?.payload);
      }

      setLoadingMenuCount(prev => --prev);
    })
    .catch(error => {
      console.error(error);
      setLoadingMenuCount(prev => --prev);
    });

    setLoadingMenuCount(prev => ++prev);
    fetch(`${REACT_APP_PUBLIC_BACKEND_URL}/api/ads_campaign?per_page=7&is_active=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error_code === 200) {
        setAdsCampaigns(data?.payload);
      }

      setLoadingMenuCount(prev => --prev);
    })
    .catch(error => {
      console.error(error);
      setLoadingMenuCount(prev => --prev);
    });
  }, []);

  React.useEffect(() => {
    productTypes?.data && productTypes.data.forEach(productType => {
      setLoadingProductsCount(prev => ++prev);
      fetch(`${REACT_APP_PUBLIC_BACKEND_URL}/api/product?per_page=15&product_type_id=${productType.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.error_code === 200) {
          setProducts(prev => ([
            ...prev,
            data.payload,
          ]))
        }

        setLoadingProductsCount(prev => --prev);
      })
      .catch(error => {
        console.error(error);
        setLoadingProductsCount(prev => --prev);
      });
    });
  }, [productTypes]);

  return (
    <div className="container-xl" style={{ flex: 1 }}>
      <CategoryPopover productTypes={productTypes} adsCampaigns={adsCampaigns} isLoading={loadingMenuCount}/>

      {
        products?.map((product, i) => {
          return (
            <div className="mb-5" key={i}>
              <div className="d-flex justify-content-between mx-4 mb-3">
                <p className="h5 text-uppercase">{product?.data?.length > 0 && product?.data?.[0].name}</p>
                <a
                  href={`/rcm/product_list?product_type_id=${product?.data?.length > 0 && product?.data?.[0].product_type_id}`}
                  className="text-dark"
                >
                  Tất cả <i className="fa fa-angle-double-right ml-1"/>
                </a>
              </div>
              <div onMouseLeave={dragStop}>
                <ScrollMenu
                  LeftArrow={LeftArrow}
                  RightArrow={RightArrow}
                  onMouseDown={() => dragStart}
                  onMouseUp={({getItemById, scrollToItem, visibleItems}) => () => {
                    dragStop();
                    const { center } = getItemsPos(visibleItems);
                    scrollToItem(getItemById(center), "smooth", "center");
                  }}
                  options={{ throttle: 0 }}
                  onMouseMove={handleDrag}
                >
                  {product?.data?.map((item, j) => (
                    <div key={j} className="mx-1" style={{width: "250px"}}>
                      <ProductCard
                        image={item.image_1}
                        name={item.name}
                        officialPrice={item.official_price}
                        originPrice={item.origin_price}
                        catagories={["RED", "BEATS", "HEADPHONE"]}
                        rate={item.average_evaluation}
                        linkTo="http://localhost:3000/uiicons"
                      />
                    </div>
                  ))}
                </ScrollMenu>
              </div>
            </div>
          )
        })
      }

      {
        loadingProductCount !== 0 && (
          <Skeleton height={200}/>
        )
      }
    </div>
  )
}

const mapStateToProps = ({
  analyticalReducer,
}) => ({
  loadingPage: analyticalReducer.loadingPage,
});

export default connect(mapStateToProps, {})(Rcm);
