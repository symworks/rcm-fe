import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { REACT_APP_PUBLIC_BACKEND_URL } from "../../constant/constant";
import { NotificationContextTemp } from "../../providers/NotificationProvider";
import * as yup from "yup";
import createAxios from "../../util/createAxios";
import Confirmation from "../Confirmation";
import ControlledSelect from "../RcmSelect/ControlledSelect";

const StoreModal = React.forwardRef(({handleAddFinal, handleUpdateFinal, handleDeleteFinal, ...rest}, ref) => {
  const [show, setShow] = React.useState(false);
  const [apiType, setApiType] = React.useState("insert");
  const [deleteData, setDeleteData] = React.useState(undefined);
  const [provinceOpts, setProvinceOpts] = React.useState([]);
  const [districtOpts, setDistrictOpts] = React.useState([]);
  const [wardOpts, setWardOpts] = React.useState([]);

  const { setNotificationState } = React.useContext(NotificationContextTemp);
  const confirmationRef = React.useRef(null);

  const validationScheme = yup.object().shape({
    name: yup
    .string()
    .min(1, 'Tên cửa hàng bắt buộc nhập')
    .max(255, 'Tên cửa hàng có tối đa 255 ký tự'),
    address_detail: yup
    .string()
    .min(1, 'Địa chỉ chi tiết bắt buộc nhập')
    .max(255, 'Địa chỉ chi tiết có tối đa 255 ký tự'),
    province_address: yup
    .object()
    .shape({
      value: yup.number().required('Tỉnh bắt buộc chọn'),
      label: yup.string().required('Tỉnh bắt buộc chọn')
    })
    .nullable()
    .required('Tỉnh bắt buộc chọn'),
    district_address: yup
    .object()
    .shape({
      value: yup.number().required('Huyện bắt buộc chọn'),
      label: yup.string().required('Huyện bắt buộc chọn')
    })
    .nullable()
    .required('Huyện bắt buộc chọn'),
    ward_address: yup
    .object()
    .shape({
      value: yup.number().required('Xã bắt buộc chọn'),
      label: yup.string().required('Xã bắt buộc chọn')
    })
    .nullable()
    .required('Xã bắt buộc chọn'),
  });

  const defaultValue = {
    name: '',
    address_detail: '',
    province_address: null,
    district_address: null,
    ward_address: null,
  };

  const { register, handleSubmit, reset, formState: {errors}, control } = useForm({
    resolver: yupResolver(validationScheme),
    defaultValue: defaultValue,
  });

  React.useEffect(() => {
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`/api/category_vn_province?use_paginate=false&fields[]=id as value&fields[]=name as label`, {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {
        setProvinceOpts(response.data.payload);
      }
    })
    .catch(error => {
      console.error(error);
    });
  }, []);

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
        province_address: {
          value: data.province_address_id,
          label: data.province_address_name,
        },
        district_address: {
          value: data.district_address_id,
          label: data.district_address_name,
        },
        ward_address: {
          value: data.ward_address_id,
          label: data.ward_address_name,
        }
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
      .post(`/api/store`, data, {withCredentials: true});
    } else if (apiType === "update") {
      if (data.is_system_role === true) {
        setNotificationState({
          notificationType: "error",
          dialogText: "Không thể chỉnh sửa cửa hàng",
          isShow: true,
        });

        return;
      }

      handleFinal = handleUpdateFinal;
      axiosInstance = axiosInstance
      .patch(`/api/store`, data, {withCredentials: true});
    } else if (apiType === "delete") {
      if (data.is_system_role === true) {
        setNotificationState({
          notificationType: "error",
          dialogText: "Không thể xóa cửa hàng",
          isShow: true,
        });

        return;
      }

      handleFinal = handleDeleteFinal;
      axiosInstance = axiosInstance
      .delete(`/api/store/${data.id}`, {withCredentials: true}); 
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

  const handleChangeProvince = (provinceId) => {
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`/api/category_vn_district?use_paginate=false&fields[]=id as value&fields[]=name as label&match_col=category_vn_province_id&match_key=${provinceId}`, {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {
        setDistrictOpts(response.data.payload);
      }
    })
    .catch(error => {
      console.error(error);
    })
  }

  const handleDistrictChange = (districtId) => {
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`/api/category_vn_ward?use_paginate=false&fields[]=id as value&fields[]=name as label&match_col=category_vn_district_id&match_key=${districtId}`, {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {
        setWardOpts(response.data.payload);
      }
    })
    .catch(error => {
      console.error(error);
    })
  }

  return (
    <div>
      <Confirmation
        ref={confirmationRef}
        title="Xóa cửa hàng"
        detail={
          <span>
            Bạn có muốn chắc xóa cửa hàng <span className="font-weight-bold">{deleteData?.name}</span> không?
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
            Cửa hàng
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <input
                    {...register("name")}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Tên cửa hàng"
                    autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <input
                    {...register("address_detail")}
                    className={`form-control ${errors.address_detail ? 'is-invalid' : ''}`}
                    placeholder="Địa chỉ chi tiết"
                    autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.address_detail?.message}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <ControlledSelect
                  name="province_address"
                  placeholder="Chọn tỉnh"
                  options={provinceOpts}
                  control={control}
                  onChangeInteract={handleChangeProvince}
                />
                <div className="text-danger"><small>{errors.province_address?.message || errors.province_address?.label.message}</small></div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <ControlledSelect
                  name="district_address"
                  placeholder="Chọn huyện"
                  options={districtOpts}
                  control={control}
                  onChangeInteract={handleDistrictChange}
                />
                <div className="text-danger"><small>{errors.district_address?.message || errors.district_address?.label.message}</small></div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <ControlledSelect
                  name="ward_address"
                  placeholder="Chọn xã"
                  options={wardOpts}
                  control={control}
                />
                <div className="text-danger"><small>{errors.ward_address?.message || errors.ward_address?.label.message}</small></div>
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

export default StoreModal;
