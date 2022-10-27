import "gridjs/dist/theme/mermaid.css";
import { Grid, _ } from "gridjs-react";
import React from "react";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../../constant/constant";
import CategoryVnDistrictModal from "./CategoryVnDistrictModal";
import viVN from "../../locales/gridjs/viVN";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import CategoryVnDistrictBar from "./CategoryVnDistrictBar";

function CategoryVnDistrictGrid() {
  const modalRef = React.useRef(undefined);
  const [forceRenderState, setForceRenderState] = React.useState(false);
  const [selectedProvinceState, setSelectedProvinceState] = React.useState(undefined);

  const handleFinal = () => {
    setForceRenderState(prev => !prev);
  }

  return (
    <div>
      <CategoryVnDistrictModal ref={modalRef} handleAddFinal={handleFinal} handleUpdateFinal={handleFinal} handleDeleteFinal={handleFinal}/>
      <CategoryVnDistrictBar
        handleAdd={() => {modalRef.current && modalRef.current.handleAdd()}}
        value={selectedProvinceState}
        setValue={setSelectedProvinceState}
      />
      <Grid
        columns={[
          "Id",
          "Mã huyện",
          "Tên huyện",
          {
            name: "Thao tác",
            sort: false
          },
        ]}
        server={{
          url: `${REACT_APP_PUBLIC_BACKEND_URL}/api/category_vn_district?match_col=category_vn_province_id&match_key=${selectedProvinceState?.value}`,
          data: (opts) => {
            return new Promise((resolve, reject) => {
              if (opts.url.includes('undefined')) {
                reject();
                return;
              }

              const xhttp = new XMLHttpRequest();
              xhttp.withCredentials = true;
              xhttp.onreadystatechange = function() {
                if (this.readyState === 4) {
                  if (this.status === 200) {
                    const resp = JSON.parse(this.response);

                    resolve({
                      data: resp.payload.data.map(categoryVnDistrict => [
                        categoryVnDistrict.id,
                        categoryVnDistrict.code,
                        categoryVnDistrict.name,
                        _(
                          <div className="d-flex justify-content-start">
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip>
                                  Sửa
                                </Tooltip>
                              }
                            >
                              <button className="btn btn-outline-info mr-2" onClick={() => {modalRef?.current && modalRef.current.handleEdit(categoryVnDistrict);}}><span className="icon icon-pencil"/></button>
                            </OverlayTrigger>

                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip>
                                  Xóa
                                </Tooltip>
                              }
                            >
                              <button className="btn btn-outline-danger" onClick={() => {modalRef?.current && modalRef.current.handleDelete(categoryVnDistrict);}}><span className="fa fa-trash-o"/></button>
                            </OverlayTrigger>
                          </div>
                        )            
                      ]),
                      total: resp.payload.total,
                    });
                  } else {
                    reject();
                  }
                }
              };

              xhttp.open("GET", opts.url, true);
              xhttp.send();
            })
          },
        }}
        search={{
          server: {
            url: (prev, keyword) => prev.includes('?') ? `${prev}&find_col=name&find_key=${keyword}` : `${prev}?find_col=name&find_key=${keyword}`
          }
        }}
        pagination={{
          enabled: true,
          limit: 15,
          server: {
            url: (prev, page, limit) => prev.includes('?') ? `${prev}&page=${page + 1}&per_page=${limit}` : `${prev}?page=${page + 1}&per_page=${limit}`
          }
        }}
        language={viVN}
        sort={{
          multiColumn: false,
          server: {
            url: (prev, columns) => {
              if (!columns.length) return prev;

              const col = columns[0];
              const dir = col.direction === 1 ? 'asc' : 'desc';
              let colName = ['id', 'code', 'name'][col.index];

              return `${prev}`.includes('?') ? `${prev}&order_col=${colName}&order_key=${dir}` : `${prev}?order_col=${colName}&order_key=${dir}`
            }
          }
        }}
      />
    </div>
  );
}

export default CategoryVnDistrictGrid;
