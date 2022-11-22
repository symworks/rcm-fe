import React from "react";
import PageHeader from "../../components/PageHeader";
import CategoryRoleGrid from "../../components/admin/CategoryRoleGrid";
import { AuthContextTemp } from "../../providers/AuthContextProvider";
import { useHistory } from "react-router-dom";

const CategoryRole = (props) => {
  const {authState} = React.useContext(AuthContextTemp);
  const history = useHistory();

  React.useLayoutEffect(() => {
    const handleCategoryRoleInit = () => {
      if (!authState.isLoggedin) {
        history.push('/login?next=/category_role');
      }
    }

    handleCategoryRoleInit();
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
            HeaderText="Vai trò"
            Breadcrumb={[
              { name: "Danh mục", navigate: "" },
              { name: "Vai trò", navigate: "" },
            ]}
          />
          <div className="row clearfix">
            <div className="col-lg-12 col-md-12">
              <div className="card mb-4">
                <div className="body project_report">
                  <CategoryRoleGrid/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryRole;
