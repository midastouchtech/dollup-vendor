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
    console.log(socket);
    if (socket) {
      socket.emit("DELETE_VENDOR_SERVICE", { vendor: { _id: vendor._id }, id });
      socket.on("RECEIVE_DELETE_SERVICE_SUCCESS", () => {
        notification.success({
          key: "RECEIVE_DELETE_SERVICE_SUCCESS" + id,
          message: "Success!",
          description: "Your new Service has been removed from your store!",
        });
        router.reload(window.location.pathname);
      });
      socket.on("RECEIVE_DELETE_SERVICE_ERROR", () => {
        notification.error({
          key: id + "RECEIVE_DELETE_SERVICE_ERROR",
          message: "Success!",
          description: "Your new Service has been removed from your store!",
        });
      });
    }
  };

  const deleteCustomer = (e) => {
    console.log("deleting", id);
    e.preventDefault();
    console.log(socket);
    if (socket) {
      socket.emit("DELETE_VENDOR_CUSTOMER", {
        vendor: { _id: vendor._id },
        id,
      });
      socket.on("RECEIVE_DELETE_CUSTOMER_SUCCESS", () => {
        notification.success({
          key: "RECEIVE_DELETE_CUSTOMER_SUCCESS" + id,
          message: "Success!",
          description: "Your new CUSTOMER has been removed from your store!",
        });
        router.reload(window.location.pathname);
      });
      socket.on("RECEIVE_DELETE_CUSTOMER_ERROR", () => {
        notification.error({
          key: id + "RECEIVE_DELETE_CUSTOMER_ERROR",
          message: "Success!",
          description: "Your new CUSTOMER has been removed from your store!",
        });
      });
    }
  };

  const deleteStylist = (e) => {
    console.log("deleting", id);
    e.preventDefault();
    console.log(socket);
    if (socket) {
      socket.emit("DELETE_STYLIST", {
        vendor: { _id: vendor._id },
        id,
      });
      socket.on("RECEIVE_DELETE_STYLIST_SUCCESS", () => {
        notification.success({
          key: "RECEIVE_DELETE_STYLIST_SUCCESS" + id,
          message: "Success!",
          description: "Your new STYLIST has been removed from your store!",
        });
        router.reload(window.location.pathname);
      });
      socket.on("RECEIVE_DELETE_STYLIST_ERROR", () => {
        notification.error({
          key: id + "RECEIVE_DELETE_STYLIST_ERROR",
          message: "Success!",
          description: "Your new STYLIST has been removed from your store!",
        });
      });
    }
  };

  const deleteBooking = (e) => {
    console.log("deleting", id);
    e.preventDefault();
    console.log(socket);
    if (socket) {
      socket.emit("DELETE_BOOKING", { vendor: { _id: vendor._id }, id });
      socket.on("RECEIVE_DELETE_BOOKING_SUCCESS", () => {
        notification.success({
          key: "RECEIVE_DELETE_BOOKING_SUCCESS" + id,
          message: "Success!",
          description: "Your new BOOKING has been removed from your store!",
        });
        router.reload(window.location.pathname);
      });
      socket.on("RECEIVE_DELETE_BOOKING_ERROR", () => {
        notification.error({
          key: id + "RECEIVE_DELETE_BOOKING_ERROR",
          message: "Success!",
          description: "Your new BOOKING has been removed from your store!",
        });
      });
    }
  };
  const menuView = (
    <Menu>
      {type === "services" && (
        <Fragment>
          <Menu.Item
            key={0}
            onClick={() =>
              router.push(
                `/services/edit-service/?vendorId=${vendor?.id}&serviceId=${id}`
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
          </Menu.Item>
        </Fragment>
      )}
      {type === "customers" && (
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
          </Menu.Item>
        </Fragment>
      )}
      {type === "stylists" && (
        <Fragment>
          <Menu.Item
            key={0}
            onClick={() =>
              router.push(
                `/stylists/edit-stylist/?vendorId=${vendor?.id}&stylistId=${id}`
              )
            }
          >
            <>
              <i className="icon-pencil mr-2"></i>
              Edit
            </>
          </Menu.Item>

          <Menu.Item key={1}>
            <a className="dropdown-item" href="#" onClick={deleteStylist}>
              <i className="icon-trash2 mr-2"></i>
              Delete
            </a>
          </Menu.Item>
        </Fragment>
      )}
      {type === "bookings" && (
        <Fragment>
          <Menu.Item
            key={0}
            onClick={() =>
              router.push(
                `/bookings/edit-booking/?vendorId=${vendor?.id}&bookingId=${id}`
              )
            }
          >
            <>
              <i className="icon-pencil mr-2"></i>
              Edit
            </>
          </Menu.Item>

          <Menu.Item key={1}>
            <a className="dropdown-item" href="#" onClick={deleteBooking}>
              <i className="icon-trash2 mr-2"></i>
              Delete
            </a>
          </Menu.Item>
        </Fragment>
      )}
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
