import "gridjs/dist/theme/mermaid.css";
import { Grid, _ } from "gridjs-react";
import React from "react";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../../constant/constant";
import StoreModal from "./StoreModal";
import viVN from "../../locales/gridjs/viVN";
import { Image, OverlayTrigger, Tooltip } from "react-bootstrap";

function StoreGrid() {
  const modalRef = React.useRef(undefined);
  const [forceRenderState, setForceRenderState] = React.useState(false);

  const handleFinal = () => {
    setForceRenderState(prev => !prev);
  }

  return (
    <div>
      <StoreModal ref={modalRef} handleAddFinal={handleFinal} handleUpdateFinal={handleFinal} handleDeleteFinal={handleFinal}/>
      <div className="d-flex justify-content-start mb-2">
        <button className="btn btn-outline-info mr-2" onClick={() => {modalRef?.current && modalRef.current.handleAdd();}}>
          <span className="fa fa-plus"></span> Thêm
        </button>
      </div>
      <Grid
        columns={[
          "Id",
          "Tên cửa hàng",
          "Địa chỉ chi tiết",
          "Tỉnh",
          "Huyện",
          "Xã",
          {
            name: "Thao tác",
            sort: false,
            width: "80px",
          },
        ]}
        server={{
          url: `${REACT_APP_PUBLIC_BACKEND_URL}/api/store`,
          data: (opts) => {
            return new Promise((resolve, reject) => {
              const xhttp = new XMLHttpRequest();
              xhttp.withCredentials = true;
              xhttp.onreadystatechange = function() {
                if (this.readyState === 4) {
                  if (this.status === 200) {
                    const resp = JSON.parse(this.response);

                    resolve({
                      data: resp.payload.data.map(store => [
                        store.id,
                        store.name,
                        store.address_detail,
                        store.province_address_name,
                        store.district_address_name,
                        store.ward_address_name,
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
                              <button className="btn btn-outline-info mr-2" onClick={() => {modalRef?.current && modalRef.current.handleEdit(store);}}><span className="icon icon-pencil"/></button>
                            </OverlayTrigger>

                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip>
                                  Xóa
                                </Tooltip>
                              }
                            >
                              <button className="btn btn-outline-danger" onClick={() => {modalRef?.current && modalRef.current.handleDelete(store);}}><span className="fa fa-trash-o"/></button>
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
              let colName = ['id', 'name', 'address_detail', 'province_address_name', 'district_address_name', 'ward_address_name'][col.index];

              return `${prev}`.includes('?') ? `${prev}&order_col=${colName}&order_key=${dir}` : `${prev}?order_col=${colName}&order_key=${dir}`
            }
          }
        }}
      />
    </div>
  );
}

export default StoreGrid;
