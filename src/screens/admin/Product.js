import React from "react";
import PageHeader from "../../components/PageHeader";
import ProductGrid from "../../components/admin/ProductGrid";
import { useHistory } from "react-router-dom";
import { AuthContextTemp } from "../../providers/AuthContextProvider";

const Product = (props) => {
  const history = useHistory();
  const {authState} = React.useContext(AuthContextTemp);

  React.useLayoutEffect(() => {
    const handleProductInit = () => {
      if (!authState.isLoggedin) {
        history.push('/login?next=/product');
      }
    }

    handleProductInit();
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
            HeaderText="Sản phẩm"
            Breadcrumb={[
              { name: "Danh mục", navigate: "" },
              { name: "Sản phẩm", navigate: "" },
            ]}
          />
          <div className="row clearfix">
            <div className="col-lg-12 col-md-12">
              <div className="card mb-4">
                <div className="body project_report">
                  <ProductGrid/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
