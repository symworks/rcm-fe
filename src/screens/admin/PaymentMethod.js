import React from "react";
import PageHeader from "../../components/PageHeader";
import PaymentMethodGrid from "../../components/admin/PaymentMethodGrid";

const PaymentMethod = (props) => {
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
            HeaderText="Người dùng"
            Breadcrumb={[
              { name: "Danh mục", navigate: "" },
              { name: "Người dùng", navigate: "" },
            ]}
          />
          <div className="row clearfix">
            <div className="col-lg-12 col-md-12">
              <div className="card mb-4">
                <div className="body project_report">
                  <PaymentMethodGrid/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentMethod;
