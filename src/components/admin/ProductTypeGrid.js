import "gridjs/dist/theme/mermaid.css";
import { Grid, _ } from "gridjs-react";
import React from "react";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../../constant/constant";
import ProductTypeModal from "./ProductTypeModal";
import viVN from "../../locales/gridjs/viVN";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function ProductTypeGrid() {
  const modalRef = React.useRef(undefined);
  const [forceRenderState, setForceRenderState] = React.useState(false);

  const handleFinal = () => {
    setForceRenderState(prev => !prev);
  }

  return (
    <div>
      <ProductTypeModal ref={modalRef} handleAddFinal={handleFinal} handleUpdateFinal={handleFinal} handleDeleteFinal={handleFinal}/>
      <div className="d-flex justify-content-start mb-2">
        <button className="btn btn-outline-info mr-2" onClick={modalRef?.current && modalRef.current.handleAdd}>
          <span className="fa fa-plus"></span> Thêm
        </button>
      </div>
      <Grid
        columns={[
          "Id",
          "Tên loại sản phẩm",
          {
            name: "Icon",
            sort: false
          },
          {
            name: "Trạng thái",
            formatter: (text) => _(<b>{text == true ? (
              <span className="badge badge-success">Đang hoạt động</span>
            ) : (
              <span className="badge badge-danger">Tắt hoạt động</span>
            )}</b>)
          },
          {
            name: "Thao tác",
            sort: false
          },
        ]}
        server={{
          url: `${REACT_APP_PUBLIC_BACKEND_URL}/api/product_type`,
          then: data => data.payload.data.map(productType => [
            productType.id,
            productType.name,
            _(
              <div>
                <span className="font-weight-bold">{productType.ui_icon}</span> <span className={productType.ui_icon}/>
              </div>
            ),
            productType.is_active,
            _(<div className="d-flex justify-content-center">
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip>
                      Sửa
                    </Tooltip>
                  }
                >
                  <button className="btn btn-outline-info mr-2" onClick={() => {modalRef?.current && modalRef.current.handleEdit(productType);}}><span className="icon icon-pencil"/></button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip>
                      Xóa
                    </Tooltip>
                  }
                >
                  <button className="btn btn-outline-danger" onClick={() => {modalRef?.current && modalRef.current.handleDelete(productType);}}><span className="fa fa-trash-o"/></button>
                </OverlayTrigger>
              </div>)
          ]),
          total: data => data.payload.total,
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
              let colName = ['id', 'name', 'ui_icon', 'is_active'][col.index];

              return `${prev}`.includes('?') ? `${prev}&order_col=${colName}&order_key=${dir}` : `${prev}?order_col=${colName}&order_key=${dir}`
            }
          }
        }}
      />
    </div>
  );
}

export default ProductTypeGrid;
