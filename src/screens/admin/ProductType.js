import React from "react";
import PageHeader from "../../components/PageHeader";
import ProductTypeGrid from "../../components/admin/ProductTypeGrid";

const ProductType = (props) => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{ flex: 1 }}
      onClick={() => {
        document.body.classList.remove("offcanvas-active");
      }}
    >
      <div>
        <div className="container-fluid pb-4">
          <PageHeader
            HeaderText="Loại sản phẩm"
            Breadcrumb={[
              { name: "Danh mục", navigate: "" },
              { name: "Loại sản phẩm", navigate: "" },
            ]}
          />
          <div className="row clearfix">
            <div className="col-lg-12 col-md-12">
              <div className="card mb-4">
                <div className="body project_report">
                  <ProductTypeGrid/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductType;
