import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { REACT_APP_PUBLIC_BACKEND_URL } from '../../constant/constant';
import createAxios from '../../util/createAxios';
import ControlledSelect from '../RcmSelect/ControlledSelect';
import { NotificationContextTemp } from '../../providers/NotificationProvider';
import _ from 'lodash';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UserModalRole = React.forwardRef((props, ref) => {
  const [show, setShow] = React.useState(false);
  const [categoryRoleOpts, setCategoryRoleOpts] = React.useState([]);
  const [initialRoles, setInitialRoles] = React.useState([]);
  const [userData, setUserData] = React.useState(undefined);
  const [isLoadingCountState, setIsLoadingCountState] = React.useState(0);
  const [responseFailedState, setResponseFailedState] = React.useState({
    showFailed: false,
    totalRequested: 0,
    totalReponsed: 0,
  });

  const {setNotificationState} = React.useContext(NotificationContextTemp);

  const validationScheme = yup.object().shape({
    roles: yup
    .array()
    .min(1, "Vai trò bắt buộc chọn"),
  });

  const defaultValues = {
    roles: [],
  }

  const {handleSubmit, reset, formState: {errors}, control} = useForm({
    resolver: yupResolver(validationScheme),
    defaultValues: defaultValues,
  });
  
  React.useEffect(() => {
    createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
    .get(`/api/category_role?use_paginate=false&fields[]=id as value&fields[]=name as label`, {withCredentials: true})
    .then(response => {
      if (response.data.error_code === 200) {
        setCategoryRoleOpts(response.data.payload);
      }
    })
    .catch(error => {
      console.log(error);
    })
  }, []);

  React.useImperativeHandle(ref, () => ({
    handleOpen: (data) => {
      setUserData(data);
      setInitialRoles({
        roles: [],
      });
      reset({
        roles: [],
      });

      setShow(true);
      setIsLoadingCountState(prev => ++prev);
      createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
      .get(`/api/role?use_paginate=false&fields[]=category_role_id as value&fields[]=category_role_name as label&fields[]=id&match_col=user_id&match_key=${data.id}`, {withCredentials: true})
      .then(response => {
        if (response.data.error_code === 200) {
          setInitialRoles({
            roles: response.data.payload,
          });
          reset({
            roles: response.data.payload,
          });
        }

        setIsLoadingCountState(prev => --prev);
      })
      .catch(error => {
        console.error(error);
        setIsLoadingCountState(prev => --prev);
      })
    }
  }));

  const onSubmit = data => {
    const deleteRoles = _.differenceBy(initialRoles.roles, data.roles, "value");
    const insertRoles = _.differenceBy(data.roles, initialRoles.roles, "value");
    setResponseFailedState(prev => {
      return {
        ...prev,
        totalRequested: deleteRoles.length + insertRoles.length,
      }
    });

    insertRoles.forEach(insertRole => {
      createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
      .post(`/api/role`, {
        user_id: userData.id,
        category_role_id: insertRole.value,
        category_role_name: insertRole.label,
      }, {withCredentials: true})
      .then(response => {
        if (response.data.error_code !== 200) {
          setResponseFailedState(prev => {
            return {
              ...prev,
              totalReponsed: prev.totalReponsed + 1,
              showFailed: true,
            }
          });
        } else {
          setResponseFailedState(prev => {
            return {
              ...prev,
              totalReponsed: prev.totalReponsed + 1,
            }
          });
        }
      })
      .catch(error => {
        console.error(error);
        setResponseFailedState(prev => {
          return {
            ...prev,
            totalReponsed: prev.totalReponsed + 1,
          }
        });
      });
    });

    deleteRoles.forEach(deleteRole => {
      createAxios(`${REACT_APP_PUBLIC_BACKEND_URL}`)
      .delete(`/api/role/${deleteRole.id}`, {withCredentials: true})
      .then(response => {
        if (response.data.error_code !== 200) {
          setResponseFailedState(prev => {
            return {
              ...prev,
              totalReponsed: prev.totalReponsed + 1,
              showFailed: true,
            }
          });
        } else {
          setResponseFailedState(prev => {
            return {
              ...prev,
              totalReponsed: prev.totalReponsed + 1,
            }
          });
        }

      })
      .catch(error => {
        console.error(error);
        setResponseFailedState(prev => {
          return {
            ...prev,
            totalReponsed: prev.totalReponsed + 1,
          }
        });
      });
    });
  }

  React.useEffect(() => {
    if (responseFailedState.totalRequested == 0) {
      return;
    }

    if (responseFailedState.totalRequested == responseFailedState.totalReponsed) {
      if (responseFailedState.showFailed) {
        setNotificationState({
          notificationType: "error",
          dialogText: "Thao tác thất bại",
          isShow: true,
        })
      } else {
        setNotificationState({
          notificationType: "info",
          dialogText: "Thao tác thành công",
          isShow: true,
        });
      }
    }
  }, [responseFailedState]);

  return (
    <div>
      <Modal
        show={show}
        onHide={() => {setShow(false);}}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <div className="h5 font-weight-bold">
            Vai trò
          </div>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            {
              isLoadingCountState !== 0 ? (
                <Skeleton height={30}/>
              ) : (
                <div>
                  <ControlledSelect
                    name="roles"
                    placeholder="Vai trò"
                    options={categoryRoleOpts}
                    control={control}
                    onChangeInteract={() => {}}
                    isMulti={true}
                  />
                  <div className="text-danger"><small>{errors.roles?.message || errors.roles?.label.message}</small></div>
                </div>
              )
            }
          </Modal.Body>
          <Modal.Footer>
            <div>
              <button type="submit" className="btn btn-outline-info">Cập nhật</button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
});

export default UserModalRole;
