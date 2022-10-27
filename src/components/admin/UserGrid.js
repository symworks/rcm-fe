import "gridjs/dist/theme/mermaid.css";
import { Grid, _ } from "gridjs-react";
import React from "react";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../../constant/constant";
import viVN from "../../locales/gridjs/viVN";
import { Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import UserModal from "./UserModal";
import UserModalChangePassword from "./UserModalChangePassword";
import UserModalInsert from "./UserModalInsert";
import UserModalRole from "./UserModalRole";

function UserGrid() {
  const modalRef = React.useRef(undefined);
  const modalChangePasswordRef = React.useRef(undefined);
  const modalInsertRef = React.useRef(undefined);
  const modalRoleRef = React.useRef(undefined);
  const [forceRenderState, setForceRenderState] = React.useState(false);

  const handleFinal = () => {
    setForceRenderState(prev => !prev);
  }

  return (
    <div>
      <UserModalChangePassword ref={modalChangePasswordRef}/>
      <UserModalInsert ref={modalInsertRef}/>
      <UserModalRole ref={modalRoleRef}/>
      <UserModal ref={modalRef} handleUpdateFinal={handleFinal} handleDeleteFinal={handleFinal}/>
      <div className="d-flex justify-content-start mb-2">
        <button className="btn btn-outline-info mr-2" onClick={() => {modalInsertRef.current && modalInsertRef.current.handleAdd()}}>
          <span className="fa fa-plus"></span> Thêm
        </button>
      </div>
      <Grid
        columns={[
          "Id",
          "Người dùng",
          "Email",
          {
            name: "Đăng ký",
            formatter: (value) => _(
              <div className="d-flex justify-content-center">
                {
                  value == true ? (
                    <span className="badge badge-success"><span className="fa fa-check"/></span>
                  ) : (
                    <span className="badge badge-danger"><span className="fa fa-times"/></span>
                  )
                }
              </div>
            )
          },
          {
            name: "Trạng thái",
            formatter: (value) => _(
              <span>
                {
                  value == 0 ? (
                    <span className="badge badge-success">
                      Đang hoạt động
                    </span>
                  ) : (
                    value == 1 ? (
                      <span className="badge badge-danger">
                        Tắt hoạt động
                      </span>
                    ) : (
                      <span className="badge badge-warning">
                        Chưa xác thực
                      </span>
                    )
                  )
                }
              </span>
            )
          },
          {
            name: "Thao tác",
            sort: false,
            width: "65px"
          },
        ]}
        server={{
          url: `${REACT_APP_PUBLIC_BACKEND_URL}/api/user`,
          data: (opts) => {
            return new Promise((resolve, reject) => {
              const xhttp = new XMLHttpRequest();
              xhttp.withCredentials = true;
              xhttp.onreadystatechange = function() {
                if (this.readyState === 4) {
                  if (this.status === 200) {
                    const resp = JSON.parse(this.response);

                    resolve({
                      data: resp.payload.data.map(user => [
                        user.id,
                        _(
                          <div>
                            <Image className="mr-3" src={user.avatar} width={"40px"}/>
                            <span>{user.name}</span>
                          </div>
                        ),
                        user.email,
                        user.anonymous_user,
                        user.status,
                        _(
                          <div className="d-flex flex-wrap">
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip>
                                  Sửa
                                </Tooltip>
                              }
                            >
                              <button
                                className="btn btn-outline-info btn-sm mr-2"
                                onClick={() => {modalRef?.current && modalRef.current.handleEdit(user);}}
                              >
                                <span className="icon icon-pencil"/>
                              </button>
                            </OverlayTrigger>

                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip>
                                  Vai trò
                                </Tooltip>
                              }
                            >
                              <button
                                className="btn btn-outline-info btn-sm mr-2"
                                onClick={() => {modalRoleRef?.current && modalRoleRef.current.handleOpen(user);}}
                              >
                                <span className="icon icon-fire"/>
                              </button>
                            </OverlayTrigger>

                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip>
                                  Đổi mật khẩu
                                </Tooltip>
                              }
                            >
                              <button
                                className="btn btn-outline-info btn-sm mr-2 mt-2"
                                onClick={() => {modalChangePasswordRef?.current && modalChangePasswordRef.current.handleChangePassword(user);}}
                              >
                                <span className="icon icon-key"/>
                              </button>
                            </OverlayTrigger>

                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip>
                                  Xóa
                                </Tooltip>
                              }
                            >
                              <button
                                className="btn btn-outline-danger btn-sm mr-2 mt-2"
                                onClick={() => {modalRef?.current && modalRef.current.handleDelete(user);}}
                              >
                                <span className="icon icon-trash"/>
                              </button>
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
              let colName = ['id', 'name', 'email', 'anonymous_user', 'status'][col.index];

              return `${prev}`.includes('?') ? `${prev}&order_col=${colName}&order_key=${dir}` : `${prev}?order_col=${colName}&order_key=${dir}`
            }
          }
        }}
      />
    </div>
  );
}

export default UserGrid;
