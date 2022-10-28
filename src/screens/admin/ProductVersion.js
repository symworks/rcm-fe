import React from "react";
import PageHeader from "../../components/PageHeader";
import ProductVersionGrid from "../../components/admin/ProductVersionGrid";
import { useHistory } from "react-router-dom";
import { AuthContextTemp } from "../../providers/AuthContextProvider";

const ProductVersion = (props) => {
  const history = useHistory();
  const { authState } = React.useContext(AuthContextTemp);

  React.useLayoutEffect(() => {
    const handleProductVersionInit = () => {
      if (!authState.isLoggedin) {
        history.push('/login?next=/product_version');
      }
    }

    window.addEventListener("productVersionInit", handleProductVersionInit);

    return () => {
      window.removeEventListener("productVersionInit", handleProductVersionInit);
    }
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
            HeaderText="Dòng sản phẩm"
            Breadcrumb={[
              { name: "Danh mục", navigate: "" },
              { name: "Dòng sản phẩm", navigate: "" },
            ]}
          />
          <div className="row clearfix">
            <div className="col-lg-12 col-md-12">
              <div className="card mb-4">
                <div className="body project_report">
                  <ProductVersionGrid/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductVersion;
