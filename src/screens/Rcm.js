import React from 'react';
import { connect } from 'react-redux';
import CategoryPopover from '../components/rcm/CategoryPopover';
import ProductCard from '../components/rcm/ProductCard';
import headphone from "../assets/images/ecommerce/wireless-red-quarter.jpg";
import { LeftArrow, RightArrow } from "../components/rcm/Arrows";
import useDrag from '../custom_hooks/useDrag';
import {
  ScrollMenu,
  getItemsPos,
} from "react-horizontal-scrolling-menu";
import ScrollToTop from "react-scroll-to-top";

const elemPrefix = "test";
const getId = (index) => `${elemPrefix}${index}`;

const getItems = () =>
  Array(10)
    .fill(0)
    .map((_, ind) => ({ id: getId(ind) }));

const Rcm = () => {
  const [items] = React.useState(getItems);
  const { dragStart, dragStop, dragMove } = useDrag();
  const handleDrag = ({ scrollContainer }) => (ev) =>
    dragMove(ev, (posDiff) => {
      if (scrollContainer.current) {
        scrollContainer.current.scrollLeft += posDiff;
      }
    }
  );

  return (
    <div style={{ flex: 1 }}>
      <ScrollToTop smooth />
      <CategoryPopover/>
      <div className="container-fluid mb-5" >
        <div className="d-flex justify-content-between mx-4 mb-3">
          <p className="h5 text-uppercase">Tai nghe</p>
          <a
            href="#!"
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
            {items.map(({ id }) => (
              <div key={id} className="mx-1" style={{width: "250px"}}>
                <ProductCard
                  image={headphone}
                  name="BEATS HEADPHONE"
                  officialPrice={10000000}
                  originPrice={12950000}
                  catagories={["RED", "BEATS", "HEADPHONE"]}
                  rate={3.6}
                  linkTo="http://localhost:3000/uiicons"
                />
              </div>
            ))}
          </ScrollMenu>
        </div>
      </div>
      <div className="container-fluid mb-5" >
        <div className="d-flex justify-content-between mx-4 mb-3">
          <p className="h5 text-uppercase">Tai nghe</p>
          <a
            href="#!"
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
            {items.map(({ id }) => (
              <div key={id} className="mx-1" style={{width: "250px"}}>
                <ProductCard
                  image={headphone}
                  name="BEATS HEADPHONE"
                  officialPrice={2000000}
                  originPrice={2400000}
                  catagories={["RED", "BEATS", "HEADPHONE"]}
                  rate={3.6}
                  linkTo="http://localhost:3000/uiicons"
                />
              </div>
            ))}
          </ScrollMenu>
        </div>
      </div>
      <div className="container-fluid mb-5" >
        <div className="d-flex justify-content-between mx-4 mb-3">
          <p className="h5 text-uppercase">Tai nghe</p>
          <a
            href="#!"
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
            {items.map(({ id }) => (
              <div key={id} className="mx-1" style={{width: "250px"}}>
                <ProductCard
                  image={headphone}
                  name="BEATS HEADPHONE"
                  officialPrice={2000000}
                  originPrice={2400000}
                  catagories={["RED", "BEATS", "HEADPHONE"]}
                  rate={3.6}
                  linkTo="http://localhost:3000/uiicons"
                />
              </div>
            ))}
          </ScrollMenu>
        </div>
      </div>
      <div className="container-fluid mb-5" >
        <div className="d-flex justify-content-between mx-4 mb-3">
          <p className="h5 text-uppercase">Tai nghe</p>
          <a
            href="#!"
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
            {items.map(({ id }) => (
              <div key={id} className="mx-1" style={{width: "250px"}}>
                <ProductCard
                  image={headphone}
                  name="BEATS HEADPHONE"
                  officialPrice={2000000}
                  originPrice={2400000}
                  catagories={["RED", "BEATS", "HEADPHONE"]}
                  rate={3.6}
                  linkTo="http://localhost:3000/uiicons"
                />
              </div>
            ))}
          </ScrollMenu>
        </div>
      </div>
      <div className="container-fluid mb-5" >
        <div className="d-flex justify-content-between mx-4 mb-3">
          <p className="h5 text-uppercase">Tai nghe</p>
          <a
            href="#!"
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
            {items.map(({ id }) => (
              <div key={id} className="mx-1" style={{width: "250px"}}>
                <ProductCard
                  image={headphone}
                  name="BEATS HEADPHONE"
                  officialPrice={2000000}
                  originPrice={2400000}
                  catagories={["RED", "BEATS", "HEADPHONE"]}
                  rate={3.6}
                  linkTo="http://localhost:3000/uiicons"
                />
              </div>
            ))}
          </ScrollMenu>
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

export default connect(mapStateToProps, {})(Rcm);
