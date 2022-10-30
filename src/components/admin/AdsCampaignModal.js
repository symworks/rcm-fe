import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../../constant/constant";
import { NotificationContextTemp } from "../../providers/NotificationProvider";
import * as yup from "yup";
import createAxios from "../../util/createAxios";
import Confirmation from "../Confirmation";

const AdsCampaignModal = React.forwardRef(({handleAddFinal, handleUpdateFinal, handleDeleteFinal, ...rest}, ref) => {
  const [show, setShow] = React.useState(false);
  const [apiType, setApiType] = React.useState("insert");
  const [deleteData, setDeleteData] = React.useState(undefined);

  const { setNotificationState } = React.useContext(NotificationContextTemp);

  const confirmationRef = React.useRef(null);

  const validationScheme = yup.object().shape({
    title: yup
    .string()
    .min(1, 'Tên chiến dịch bắt buộc nhập'),
    original: yup
    .string()
    .min(1, 'Ảnh chiến dịch'),
    thumbnail: yup
    .string()
    .min(1, 'Ảnh thumbnail'),
    link_to_campaign: yup
    .string(),
    is_active: yup
    .boolean(),
  });

  const defaultValue = {
    title: '',
    original: '',
    thumbnail: '',
    link_to_campaign: '',
    is_active: false,
  };

  const { register, handleSubmit, reset, formState: {errors} } = useForm({
    resolver: yupResolver(validationScheme),
    defaultValue: defaultValue,
  });

  React.useImperativeHandle(ref, () => ({
    handleAdd: () => {
      reset(defaultValue);
      setApiType("insert");
      setShow(true);
    },
    handleEdit: (data) => {
      reset({
        ...defaultValue,
        ...data,
      })
      setApiType("update");
      setShow(true);
    },
    handleDelete: (data) => {
      setDeleteData(data);
      setApiType("delete");
      confirmationRef.current && confirmationRef.current.handleOpen();
    }
  }));

  const onSubmit = data => {
    var axiosInstance = createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    var handleFinal = undefined;
    if (apiType === "insert") {
      handleFinal = handleAddFinal;
      axiosInstance = axiosInstance
      .post(`/api/ads_campaign`, data, {withCredentials: true});
    } else if (apiType === "update") {
      handleFinal = handleUpdateFinal;
      axiosInstance = axiosInstance
      .patch(`/api/ads_campaign`, data, {withCredentials: true});
    } else if (apiType === "delete") {
      handleFinal = handleDeleteFinal;
      axiosInstance = axiosInstance
      .delete(`/api/ads_campaign/${data.id}`, {withCredentials: true});
    } else {
      console.error("something went wrong");
      return;
    }

    axiosInstance
    .then(response => {
      if (response.data.error_code === 200) {
        setShow(false);
        setNotificationState({
          notificationType: "info",
          dialogText: "Thao tác thành công",
          isShow: true,
        });

        if (handleFinal) {
          handleFinal();
        }

        return;
      }

      //
      setNotificationState({
        notificationType: "error",
        dialogText: response.data.msg,
        isShow: true,
      });
    })
    .catch(error => {
      console.error(error);
    });
  }

  const handleOnYesDelete = () => {
    onSubmit(deleteData);
  }

  return (
    <div {...rest}>
      <Confirmation
        ref={confirmationRef}
        title="Xóa chiến dịch quảng cáo"
        detail={
          <span>
            Bạn có muốn chắc xóa chiến dịch quảng cáo <span className="font-weight-bold">{deleteData?.title}</span> không?
          </span>
        }
        handleOnYes={handleOnYesDelete}
        handleOnNo={() => {}}
      />
      <Modal
        show={show}
        onHide={() => {setShow(false);}}
        backdrop="static"
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <div className="h5 font-weight-bold">
            Chiến dịch quảng cáo
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Tên chiến dịch quảng cáo</label>
                  <input
                    {...register("title")}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Tên chiến dịch quảng cáo"
                    autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Ảnh gốc</label>
                  <input
                    {...register("original")}
                    className={`form-control ${errors.original ? 'is-invalid' : ''}`}
                    placeholder="Nhập ảnh gốc chiến dịch"
                    autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.original?.message}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Ảnh thumbnail</label>
                  <input
                    {...register("thumbnail")}
                    className={`form-control ${errors.thumbnail ? 'is-invalid' : ''}`}
                    placeholder="Nhập ảnh thumbnail"
                    autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.thumbnail?.message}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Link đến chiến dịch</label>
                  <input
                    {...register("link_to_campaign")}
                    className={`form-control ${errors.link_to_campaign ? 'is-invalid' : ''}`}
                    placeholder="Nhập link đến chiến dịch"
                    autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.link_to_campaign?.message}</div>
                </div>
              </div>
            </div>
            <label>Trạng thái</label>
            <div className="d-flex justify-content-start">
              <div className="form-check mr-4">
                <input
                  {...register("is_active")}
                  className="form-check-input"
                  type="radio"
                  value={true}
                  defaultChecked={true}
                  id="is_active_1"
                />
                <label className="form-check-label font-weight-normal" htmlFor="is_active_1">Đang hoạt động</label>
              </div>
              <div className="form-check">
                <input
                  {...register("is_active")}
                  className="form-check-input"
                  type="radio"
                  value={false}
                  id="is_active_2"
                />
                <label className="form-check-label font-weight-normal" htmlFor="is_active_2">Tắt hoạt động</label>
              </div>
            </div>
            <div className="mt-2 d-flex justify-content-end">
              <button type="submit" className="btn btn-outline-info">Cập nhật</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
});

export default AdsCampaignModal;
