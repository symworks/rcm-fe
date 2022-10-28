import React from "react";
import PageHeader from "../../components/PageHeader";
import CategoryVnProvinceGrid from "../../components/admin/CategoryVnProvinceGrid";
import { useHistory } from "react-router-dom";
import { AuthContextTemp } from "../../providers/AuthContextProvider";

const CategoryVnProvince = (props) => {
  const {authState} = React.useContext(AuthContextTemp);
  const history = useHistory();

  React.useEffect(() => {
    const handleCategoryVnProvince = () => {
      if (!authState.isLoggedin) {
        history.push('/login?next=category_vn_province');
      }
    }

    window.addEventListener("categoryVnProvinceInit", handleCategoryVnProvince);

    return () => {
      window.removeEventListener("categoryVnProvinceInit", handleCategoryVnProvince);
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
            HeaderText="Đơn vị hành chính tỉnh"
            Breadcrumb={[
              { name: "Danh mục", navigate: "" },
              { name: "Đơn vị hành chính tỉnh", navigate: "" },
            ]}
          />
          <div className="row clearfix">
            <div className="col-lg-12 col-md-12">
              <div className="card mb-4">
                <div className="body project_report">
                  <CategoryVnProvinceGrid/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryVnProvince;
