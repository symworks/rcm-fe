import React from "react";
import ReactSelect from "react-select";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../../constant/constant";
import createAxios from "../../util/createAxios";

const CategoryVnWardBar = ({handleAdd, value, setValue}) => {
  const [provinces, setProvinces] = React.useState([]);
  const [selectedProvince, setSelectedProvince] = React.useState(undefined);
  const [districts, setDistricts] = React.useState([]);

  React.useState(() => {
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`/api/category_vn_province?use_paginate=false&fields[]=id as value&fields[]=name as label`, {withCredentials: true})
    .then(response => {
      if (response.data.error_code == 200) {
        setProvinces(response.data.payload);
        response.data.payload.length > 0 && setSelectedProvince(response.data.payload[0]);
      }
    })
    .catch(error => {
      console.error(error);
    })
  }, []);

  React.useEffect(() => {
    if (!selectedProvince) {
      return;
    }

    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`/api/category_vn_district?use_paginate=false&fields[]=id as value&fields[]=name as label&match_col=category_vn_province_id&match_key=${selectedProvince.value}`, {withCredentials: true})
    .then(response => {
      if (response.data.error_code == 200) {
        setDistricts(response.data.payload);
        response.data.payload.length > 0 && setValue(response.data.payload[0]);
      }
    })
    .catch(error => {
      console.error(error);
    })
  }, [selectedProvince])

  return (
    <div className="d-flex justify-content-start mb-2">
      <button
        className="btn btn-outline-info mr-2"
        onClick={handleAdd}  
      >
        <span className="fa fa-plus"></span> Thêm
      </button>
      <div className="flex-fill">
        <div className="row">
          <div className="col-sm-12 col-md-4 col-xl-3">
            <ReactSelect
              placeholder="Chọn tỉnh"
              options={provinces}
              value={selectedProvince}
              onChange={(option) => {setSelectedProvince(option);}}
            />
          </div>
          <div className="col-sm-col-md-4 col-xl-3 px-0">
            <ReactSelect
              placeholder="Chọn huyện"
              options={districts}
              value={value}
              onChange={(option) => {setValue(option);}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryVnWardBar;
