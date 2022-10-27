import "gridjs/dist/theme/mermaid.css";
import { Grid, _ } from "gridjs-react";
import React from "react";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../../constant/constant";
import CategoryRoleModal from "./CategoryRoleModal";
import viVN from "../../locales/gridjs/viVN";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function CategoryRoleGrid() {
  const modalRef = React.useRef(undefined);
  const [forceRenderState, setForceRenderState] = React.useState(false);

  const handleFinal = () => {
    setForceRenderState(prev => !prev);
  }

  return (
    <div>
      <CategoryRoleModal ref={modalRef} handleAddFinal={handleFinal} handleUpdateFinal={handleFinal} handleDeleteFinal={handleFinal}/>
      <div className="d-flex justify-content-start mb-2">
        <button className="btn btn-outline-info mr-2" onClick={modalRef?.current && modalRef.current.handleAdd}>
          <span className="fa fa-plus"></span> Thêm
        </button>
      </div>
      <Grid
        columns={[
          "Id",
          "Mã vai trò",
          "Tên vai trò",
          {
            name: "Hệ thống",
            formatter: (text) => _(
            <b>
              {text == true ? (
                <span className="badge badge-success"><span className="fa fa-check"/></span>
              ) : (
                <span className="badge badge-danger"><span className="fa fa-times"/></span>
              )}
            </b>
            )
          },
          {
            name: "Thao tác",
            sort: false
          },
        ]}
        server={{
          url: `${REACT_APP_PUBLIC_BACKEND_URL}/api/category_role`,
          data: (opts) => {
            return new Promise((resolve, reject) => {
              const xhttp = new XMLHttpRequest();
              xhttp.withCredentials = true;
              xhttp.onreadystatechange = function() {
                if (this.readyState === 4) {
                  if (this.status === 200) {
                    const resp = JSON.parse(this.response);

                    resolve({
                      data: resp.payload.data.map(categoryRole => [
                        categoryRole.id,
                        categoryRole.code,
                        categoryRole.name,
                        categoryRole.is_system_role,
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
                              <button className="btn btn-outline-info mr-2" onClick={() => {modalRef?.current && modalRef.current.handleEdit(categoryRole);}}><span className="icon icon-pencil"/></button>
                            </OverlayTrigger>

                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip>
                                  Xóa
                                </Tooltip>
                              }
                            >
                              <button className="btn btn-outline-danger" onClick={() => {modalRef?.current && modalRef.current.handleDelete(categoryRole);}}><span className="fa fa-trash-o"/></button>
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
              let colName = ['id', 'code', 'name', 'is_system_role'][col.index];

              return `${prev}`.includes('?') ? `${prev}&order_col=${colName}&order_key=${dir}` : `${prev}?order_col=${colName}&order_key=${dir}`
            }
          }
        }}
      />
    </div>
  );
}

export default CategoryRoleGrid;
