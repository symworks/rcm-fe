import React from "react";
import PageHeader from "../../components/PageHeader";
import AdsCampaignGrid from "../../components/admin/AdsCampaignGrid";
import { useHistory } from "react-router-dom";
import { AuthContextTemp } from "../../providers/AuthContextProvider";

const CategoryVnProvince = (props) => {
  const {authState} = React.useContext(AuthContextTemp);
  const history = useHistory();

  React.useLayoutEffect(() => {
    const handleCategoryVnProvince = () => {
      if (!authState.isLoggedin) {
        history.push('/login?next=category_vn_province');
      }
    }

    handleCategoryVnProvince();
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
            HeaderText="Chiến dịch quảng cáo"
            Breadcrumb={[
              { name: "Danh mục", navigate: "" },
              { name: "Chiến dịch quảng cáo", navigate: "" },
            ]}
          />
          <div className="row clearfix">
            <div className="col-lg-12 col-md-12">
              <div className="card mb-4">
                <div className="body project_report">
                  <AdsCampaignGrid/>
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
