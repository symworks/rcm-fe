import React from "react";
import { connect } from "react-redux";
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";

const CategoryPopover = ({
  productTypes,
  adsCampaigns,
  isLoading,
}) => {
  return (
    <div className="mx-4" style={{ flex: 1}}>
      <div className="row clearfix pt-3">
        <div className="col-lg-12">
          <div className="card">
            <div className="mail-inbox">
              <div className="mail-left collapse">
                <div className="mail-side">
                  <ul className="nav">
                    {
                      isLoading ? (
                        <Skeleton count={15}/>
                      ) : (
                        productTypes?.data?.map((product_type, index) => {
                          return (
                            <li key={`${index}`}>
                              <a href={`/rcm/product_list?product_type_id=${product_type.id}`}>
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
