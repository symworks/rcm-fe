import React from "react";
import PageHeader from "../../components/PageHeader";
import ProductOrderGrid from "../../components/admin/ProductOrderGrid";
import { useHistory } from "react-router-dom";
import { AuthContextTemp } from "../../providers/AuthContextProvider";

const ProductOrder = (props) => {
  const {authState} = React.useContext(AuthContextTemp);
  const history = useHistory();

  React.useEffect(() => {
    const handleProductOrder = () => {
      if (!authState.isLoggedin) {
        history.push('/login?next=category_vn_province');
      }
    }
    
    handleProductOrder();
  }, [authState]);

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
            HeaderText="Đặt hàng"
            Breadcrumb={[
              { name: "Danh mục", navigate: "" },
              { name: "Đặt hàng", navigate: "" },
            ]}
          />
          <div className="row clearfix">
            <div className="col-lg-12 col-md-12">
              <div className="card mb-4">
                <div className="body project_report">
                  <ProductOrderGrid/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductOrder;
