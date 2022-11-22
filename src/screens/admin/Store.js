import React from "react";
import PageHeader from "../../components/PageHeader";
import StoreGrid from "../../components/admin/StoreGrid";
import { useHistory } from "react-router-dom";
import { AuthContextTemp } from "../../providers/AuthContextProvider";

const Store = (props) => {
  const history = useHistory();
  const { authState } = React.useContext(AuthContextTemp);
  
  React.useLayoutEffect(() => {
    const handleStoreInit = () => {
      if (!authState.isLoggedin) {
        history.push('/login?next=/product_version');
      }
    }

    handleStoreInit();
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
            HeaderText="Cửa hàng"
            Breadcrumb={[
              { name: "Danh mục", navigate: "" },
              { name: "Cửa hàng", navigate: "" },
            ]}
          />
          <div className="row clearfix">
            <div className="col-lg-12 col-md-12">
              <div className="card mb-4">
                <div className="body project_report">
                  <StoreGrid/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Store;
