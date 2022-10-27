import React from "react";
import { connect } from "react-redux";
import StarRatings from "react-star-ratings";

class ProductCard extends React.Component {
  render() {
    const { image, name, originPrice, officialPrice, catagories, rate, linkTo } = this.props;
    return (
      <div className="card">
        <div className="body">
          <div className="top-bar">
            <span className="badge badge-pill badge-danger">Giảm {(officialPrice * 100 / originPrice).toFixed(2)} %</span>
            <span className="float-right icon-heart"></span>
          </div>
          <a href={linkTo}>
            <img className="img-fluid" src={image} alt=""/>
          </a>
          <div className="title mb-1">
            <a className="text-dark" href={linkTo}>
              <strong><p>{name}</p></strong>
            </a>
            <span className="mr-2 text-danger h6"><strong>{officialPrice.toLocaleString('it-IT', {style: 'currency', currency: 'VND'}).replace('VND', '')}</strong></span>
            {
              originPrice !== "" && (
                <span className="text-secondary h6"><del><strong>{originPrice.toLocaleString('it-IT', {style: 'currency', currency: 'VND'}).replace('VND', 'đ')}</strong></del></span>
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
          <div className="footer">
            {catagories.map((data, i) => {
              return (
                <span key={i} className="badge badge-default mt-1">
                  {data}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ UIElementsReducer }) => ({});

export default connect(mapStateToProps, {})(ProductCard);
