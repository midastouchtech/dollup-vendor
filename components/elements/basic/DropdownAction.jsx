import React, { Fragment } from "react";
import { Dropdown, Menu } from "antd";
import { connect } from "react-redux";
import Link from "next/link";
import { notification } from "antd";
import { useRouter } from "next/router";

const DropdownAction = ({ id, socket, vendor, type }) => {
  const router = useRouter();

  const deleteService = (e) => {
    console.log("deleting", id);
    e.preventDefault();
    console.log(socket)
    if (socket) {
      socket.emit("DELETE_VENDOR_SERVICE", { vendor, id });
      socket.on("RECEIVE_DELETE_VENDOR_SERVICE_SUCCESS", () => {
        notification.success({
          key: "RECEIVE_DELETE_VENDOR_SERVICE_SUCCESS" + id,
          message: "Success!",
          description: "Your new Service has been removed from your store!",
        });
        router.reload(window.location.pathname)
      });
      socket.on("RECEIVE_DELETE_VENDOR_SERVICE_ERROR", () => {
        notification.error({
          key: id + "RECEIVE_DELETE_VENDOR_SERVICE_ERROR",
          message: "Success!",
          description: "Your new Service has been removed from your store!",
        });
      });
    }
  };

  const deleteCustomer = (e) => {
    console.log("deleting", id);
    e.preventDefault();
    console.log(socket)
    if (socket) {
      socket.emit("DELETE_VENDOR_CUSTOMER", { vendor, id });
      socket.on("RECEIVE_DELETE_VENDOR_CUSTOMER_SUCCESS", () => {
        notification.success({
          key: "RECEIVE_DELETE_VENDOR_CUSTOMER_SUCCESS" + id,
          message: "Success!",
          description: "Your new CUSTOMER has been removed from your store!",
        });
        router.reload(window.location.pathname)
      });
      socket.on("RECEIVE_DELETE_VENDOR_CUSTOMER_ERROR", () => {
        notification.error({
          key: id + "RECEIVE_DELETE_VENDOR_CUSTOMER_ERROR",
          message: "Success!",
          description: "Your new CUSTOMER has been removed from your store!",
        });
      });
    }
  };
  const menuView = (
    <Menu>
      {type === "services" && 
      <Fragment>
        <Menu.Item
        key={0}
        onClick={() =>
          router.push(
            `/products/edit-product/?vendorId=${vendor?.id}&serviceId=${id}`
          )
        }
      >
        <>
          <i className="icon-pencil mr-2"></i>
          Edit
        </>
      </Menu.Item>

      <Menu.Item key={1}>
        <a className="dropdown-item" href="#" onClick={deleteService}>
          <i className="icon-trash2 mr-2"></i>
          Delete
        </a>
      </Menu.Item></Fragment>}
      {type !== "services" && 
      <Fragment>
        <Menu.Item
        key={0}
        onClick={() =>
          router.push(
            `/customers/edit-customer/?vendorId=${vendor?.id}&customerId=${id}`
          )
        }
      >
        <>
          <i className="icon-pencil mr-2"></i>
          Edit
        </>
      </Menu.Item>

      <Menu.Item key={1}>
        <a className="dropdown-item" href="#" onClick={deleteCustomer}>
          <i className="icon-trash2 mr-2"></i>
          Delete
        </a>
      </Menu.Item></Fragment>}
    </Menu>
  );
  return (
    <Dropdown overlay={menuView} className="ps-dropdown">
      <a onClick={(e) => e.preventDefault()} className="ps-dropdown__toggle">
        <i className="icon-ellipsis"></i>
      </a>
    </Dropdown>
  );
};

export default connect((state) => state.app)(DropdownAction);
