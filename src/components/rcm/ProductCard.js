import React from "react";
import { connect } from "react-redux";
import StarRatings from "react-star-ratings";

class ProductCard extends React.Component {
  render() {
    const { image, name, originPrice, officialPrice, rate, linkTo } = this.props;
    const discount = ((originPrice - officialPrice) * 100 / originPrice).toFixed(2);
    return (
      <div className="card">
        <div className="body">
          <div className="top-bar">
            <span className="badge badge-pill badge-danger">{discount > 0 ? `Giảm ${discount}` : `Tăng ${-discount}` } %</span>
            <span className="float-right icon-heart"></span>
          </div>
          <div className="my-2">
            <a href={linkTo}>
              <img className="img-fluid" src={image} alt=""/>
            </a>
          </div>
          <div className="title mb-1">
            <a className="text-dark" href={linkTo}>
              <strong><p>{name}</p></strong>
            </a>
            <span className="mr-2 text-danger h6"><strong>{officialPrice?.toLocaleString('it-IT', {style: 'currency', currency: 'VND'}).replace('VND', '')}</strong></span>
            {
              originPrice !== "" && (
                <span className="text-secondary h6"><del><strong>{originPrice?.toLocaleString('it-IT', {style: 'currency', currency: 'VND'}).replace('VND', 'đ')}</strong></del></span>
              )
            }
          </div>
          <div>
            <StarRatings
              starRatedColor="orange"
              rating={rate}
              numberOfStars={5}
              starDimension="20px"
              starSpacing="2px"
            />
          </div>
          <hr className="mt-2"/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ UIElementsReducer }) => ({});

export default connect(mapStateToProps, {})(ProductCard);
