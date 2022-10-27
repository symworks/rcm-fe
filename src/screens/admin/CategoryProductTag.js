import React from "react";
import PageHeader from "../../components/PageHeader";
import CategoryProductTagGrid from "../../components/admin/CategoryProductTagGrid";

const CategoryProductTag = (props) => {
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
            HeaderText="Nhãn sản phẩm"
            Breadcrumb={[
              { name: "Danh mục", navigate: "" },
              { name: "Nhãn sản phẩm", navigate: "" },
            ]}
          />
          <div className="row clearfix">
            <div className="col-lg-12 col-md-12">
              <div className="card mb-4">
                <div className="body project_report">
                  <CategoryProductTagGrid/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryProductTag;
