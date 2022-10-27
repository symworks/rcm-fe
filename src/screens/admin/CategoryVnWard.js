import React from "react";
import PageHeader from "../../components/PageHeader";
import CategoryVnWardGrid from "../../components/admin/CategoryVnWardGrid";

const CategoryVnWard = (props) => {
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
            HeaderText="Đơn vị hành chính xã"
            Breadcrumb={[
              { name: "Danh mục", navigate: "" },
              { name: "Đơn vị hành chính xã", navigate: "" },
            ]}
          />
          <div className="row clearfix">
            <div className="col-lg-12 col-md-12">
              <div className="card mb-4">
                <div className="body project_report">
                  <CategoryVnWardGrid/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryVnWard;
