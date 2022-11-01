import "gridjs/dist/theme/mermaid.css";
import { Grid, _ } from "gridjs-react";
import React from "react";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../../constant/constant";
import ProductOrderModal from "./ProductOrderModal";
import viVN from "../../locales/gridjs/viVN";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function ProductOrderGrid() {
  const statusMaps = [
    <div>
      Chưa hoàn thành đặt hàng
    </div>,
    <div>
      Chờ khách hàng thanh toán
    </div>,
    <div>
      Khách hàng đã thanh toán
    </div>,
    <div>
      Chờ nhân viên xác nhận đơn hàng
    </div>,
    <div>
      Nhân viên đã xác nhận đặt hàng
    </div>,
    <div>
      Đơn hàng chờ vận chuyển
    </div>,
    <div>
      Đã vận chuyển
    </div>
  ]

  const modalRef = React.useRef(undefined);
  const [forceRenderState, setForceRenderState] = React.useState(false);

  const handleFinal = () => {
    setForceRenderState(prev => !prev);
  }

  return (
    <div>
      <ProductOrderModal ref={modalRef} handleAddFinal={handleFinal} handleUpdateFinal={handleFinal} handleDeleteFinal={handleFinal}/>
      <div className="d-flex justify-content-start mb-2">
        <button className="btn btn-outline-info mr-2" onClick={() => {modalRef?.current && modalRef.current.handleAdd();}}>
          <span className="fa fa-plus"></span> Thêm
        </button>
      </div>
      <Grid
        columns={[
          {
            name: "Id",
            width: "32px"
          },
          "Tên người đặt",
          "Số điện thoại",
          "Email",
          {
            name: "Vận chuyển",
            formatter: (value) => _(
              <div>
                {
                  value == 0 ? (
                    <div>
                      Nhận tại cửa hàng
                    </div>
                  ) : (
                    <div>
                      Giao hàng tận nơi
                    </div>
                  )
                }
              </div>
            )
          },
          "Thanh toán",
          {
            name: "Địa chỉ",
            width: "300px"
          },
          "Yêu cầu khác",
          "Tổng tiền",
          {
            name: "Trạng thái",
            formatter: (value) => _(
              <div>
                {
                  statusMaps[value]
                }
              </div>
            )
          },
          {
            name: "Thao tác",
            sort: false,
            width: "100px"
          },
        ]}
        server={{
          url: `${REACT_APP_PUBLIC_BACKEND_URL}/api/product_order`,
          data: (opts) => {
            return new Promise((resolve, reject) => {
              const xhttp = new XMLHttpRequest();
              xhttp.withCredentials = true;
              xhttp.onreadystatechange = function() {
                if (this.readyState === 4) {
                  if (this.status === 200) {
                    const resp = JSON.parse(this.response);

                    resolve({
                      data: resp.payload.data.map(productOrder => [
                        productOrder.id,
                        productOrder.name,
                        productOrder.phone_number,
                        productOrder.email,
                        productOrder.delivery_method,
                        productOrder.payment_method_name,
                        productOrder.customer_address,
                        productOrder.other_request,
                        productOrder.total_price,
                        productOrder.status,
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
                              <button className="btn btn-outline-info btn-sm mr-2" onClick={() => {modalRef?.current && modalRef.current.handleEdit(productOrder);}}><span className="icon icon-pencil"/></button>
                            </OverlayTrigger>

                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip>
                                  Sản phẩn đặt
                                </Tooltip>
                              }
                            >
                              <button className="btn btn-outline-info btn-sm mr-2" onClick={() => {modalRef?.current && modalRef.current.handleEdit(productOrder);}}><span className="icon icon-present"/></button>
                            </OverlayTrigger>

                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip>
                                  Xóa
                                </Tooltip>
                              }
                            >
                              <button className="btn btn-outline-danger btn-sm mr-2" onClick={() => {modalRef?.current && modalRef.current.handleDelete(productOrder);}}><span className="fa fa-trash-o"/></button>
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
              let colName = ['id', 'name', 'phone_number', 'email', 'delivery_method', 'payment_method_name', 'customer_address', 'other_request', 'total_price', 'status'][col.index];

              return `${prev}`.includes('?') ? `${prev}&order_col=${colName}&order_key=${dir}` : `${prev}?order_col=${colName}&order_key=${dir}`
            }
          }
        }}
      />
    </div>
  );
}

export default ProductOrderGrid;
