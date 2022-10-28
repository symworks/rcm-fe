import React from "react";
import PageHeader from "../../components/PageHeader";
import CategoryVnDistrictGrid from "../../components/admin/CategoryVnDistrictGrid";
import { AuthContextTemp } from "../../providers/AuthContextProvider";
import { useHistory } from "react-router-dom";

const CategoryVnDistrict = (props) => {
  const { authState } = React.useContext(AuthContextTemp);
  const history = useHistory();

  React.useLayoutEffect(() => {
    const handleCategoryVnDistrictInit = () => {
      if (!authState.isLoggedin) {
        history.pushState('/login?next=/category_vn_district');
      }
    }

    window.addEventListener("categoryVnDistrict", handleCategoryVnDistrictInit);

    return () => {
      window.removeEventListener("categoryVnDistrict", handleCategoryVnDistrictInit);
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
            HeaderText="Đơn vị hành chính huyện"
            Breadcrumb={[
              { name: "Danh mục", navigate: "" },
              { name: "Đơn vị hành chính huyện", navigate: "" },
            ]}
          />
          <div className="row clearfix">
            <div className="col-lg-12 col-md-12">
              <div className="card mb-4">
                <div className="body project_report">
                  <CategoryVnDistrictGrid/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryVnDistrict;
