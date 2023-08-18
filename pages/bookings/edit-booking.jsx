import React, { useEffect, useState } from "react";
import ContainerDashboard from "~/components/layouts/ContainerDashboard";
import Upload from "~/components/upload";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import categories from "~/public/data/categories.json";
import { Select, Form, Checkbox, Typography } from "antd";
import { isEmpty, omit } from "ramda";
import { useRouter } from "next/router";
import Link from "next/link";
const { uuid } = require("uuidv4");
import { TimePicker } from "antd";
import dayjs from "dayjs";
const format = "HH:mm";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Button, Radio, Icon } from "antd";
import notification from "~/components/notification";

const CreateBookingPage = ({ vendor, socket }) => {
  const router = useRouter();

  console.log("vendor", vendor);
  const dispatch = useDispatch();
  const [details, setDetails] = useState({});
  const { vendorId, bookingId } = router.query;
  const [updatedVendor, setUpdatedVendor] = useState();
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
    if (socket) {
      console.log("Getting booking", vendorId, bookingId);
      socket.emit("GET_BOOKING", { id: bookingId });
      socket.on("RECEIVE_BOOKING", (data) => {
        console.log("Receiving booking", data);
        setDetails(data);
      });
      socket.emit("GET_VENDOR_CUSTOMERS", { id: vendor.id });
      socket.emit("GET_VENDOR_STYLISTS", { id: vendor.id });
      socket.emit("GET_VENDOR_SERVICES", { id: vendor.id });
      socket.on("RECEIVE_VENDOR_CUSTOMERS", (data) => {
        setCustomers(data);
      });
      socket.on("RECEIVE_VENDOR_STYLISTS", (data) => {
        setStylists(data);
      });
      socket.on("RECEIVE_VENDOR_SERVICES", (data) => {
        setServices(data);
      });
    }
  }, []);

  const setDetail = (key, val) => {
    setDetails({ ...details, [key]: val });
  };

  const handleSubmit = () => {
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });
    if (socket && !isEmpty(details)) {
      socket.emit("UPDATE_BOOKING", details);
      socket.on("RECEIVE_UPDATE_BOOKING_SUCCESS", () => {
        notification.success("Your booking has been edited.");
        //router.push("/bookings");
      });
      socket.on("RECEIVE_UPDATE_CUSTOMER_ERROR", () => {
        notification.error(
          "Your new Service could not be added to your store."
        );
      });
    }
  };
  return (
    <ContainerDashboard title="Create new product">
      <HeaderDashboard
        title="Edit Booking"
        description="Dollup Edit Booking "
      />
      <section className="ps-new-item">
        <Form className="ps-form ps-form--new-product">
          <div className="ps-form__bottom my-4">
            <Link className="ps-btn ps-btn--black" href="/bookings">
              Back
            </Link>
            <Link className="ps-btn ps-btn--gray" href="/bookings">
              Cancel
            </Link>
            <button className="ps-btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
          <div className="ps-form__content edit-booking">
            <div className="row d-flex flex-row justify-content-center">
              <div className="col-md-8">
                <figure className="ps-block--form-box">
                  <figcaption>Booking Status</figcaption>
                  <div className="ps-block__content">
                    <div className="row">
                      <div className="form-group col-md-3 col-sm-12 col-xs-12">
                        <label>Appointment Is Complete</label>
                        <br />
                        <Button
                          type={
                            details?.isComplete === false
                              ? "primary"
                              : "default"
                          }
                          size="large"
                          className="mr-3"
                          onClick={() => setDetail("isComplete", false)}
                        >
                          No
                        </Button>
                        <Button
                          type={details?.isComplete ? "primary" : "default"}
                          size="large"
                          className="mr-3"
                          onClick={() => setDetail("isComplete", true)}
                        >
                          Yes
                        </Button>
                      </div>
                      <div className="form-group col-md-3 col-sm-12 col-xs-12">
                        <label>Appointment Is Paid</label>
                        <br />
                        <Button
                          type={
                            details?.isPaid === false ? "primary" : "default"
                          }
                          size="large"
                          className="mr-3"
                          onClick={() => setDetail("isPaid", false)}
                        >
                          No
                        </Button>
                        <Button
                          type={details?.isPaid ? "primary" : "default"}
                          size="large"
                          className="mr-3"
                          onClick={() => setDetail("isPaid", true)}
                        >
                          Yes
                        </Button>
                      </div>
                      <div className="form-group col-md-3 col-sm-12 col-xs-12">
                        <label>Appointment Is Cancelled</label>
                        <br />
                        <Button
                          type={
                            details?.isCancelled === false
                              ? "primary"
                              : "default"
                          }
                          size="large"
                          className="mr-3"
                          onClick={() => setDetail("isCancelled", false)}
                        >
                          No
                        </Button>
                        <Button
                          type={details?.isCancelled ? "primary" : "default"}
                          size="large"
                          className="mr-3"
                          onClick={() => setDetail("isCancelled", true)}
                        >
                          Yes
                        </Button>
                      </div>
                      <div className="form-group col-md-3 col-sm-12 col-xs-12">
                        <label>Client didn't show up</label>
                        <br />
                        <Button
                          type={
                            details?.isNoShow === false ? "primary" : "default"
                          }
                          size="large"
                          className="mr-3"
                          onClick={() => setDetail("isNoShow", false)}
                          checked={details?.isNoShow}
                        >
                          No
                        </Button>
                        <Button
                          type={details?.isNoShow ? "primary" : "default"}
                          size="large"
                          className="mr-3"
                          onClick={() => setDetail("isNoShow", true)}
                          checked={details?.isNoShow}
                        >
                          Yes
                        </Button>
                      </div>
                    </div>
                  </div>
                </figure>
              </div>
              <div className="col-md-8">
                <figure className="ps-block--form-box">
                  <figcaption>Price</figcaption>
                  <div className="ps-block__content">
                    <h2>R{details?.service?.salePrice ?? 0}</h2>
                  </div>
                </figure>
              </div>
              <div className="col-md-8">
                <figure className="ps-block--form-box">
                  <figcaption>General</figcaption>
                  <div className="ps-block__content">
                    <div className="form-group">
                      <label>Customer</label>
                      <Select
                        id="customer"
                        placeholder="Select Customer"
                        className="ps-ant-dropdown"
                        listItemHeight={20}
                        value={details?.customer?.name}
                        onChange={(customerId) => {
                          const customer = customers?.filter(
                            (c) => c.id === customerId
                          )[0];
                          setDetail(
                            "customer",
                            omit(
                              ["servicesBooked", "servicesCompleted"],
                              customer
                            )
                          );
                        }}
                      >
                        {customers?.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="form-group">
                      <label>Stylist</label>
                      <Select
                        id="stylist"
                        placeholder="Select Stylist"
                        className="ps-ant-dropdown"
                        listItemHeight={20}
                        value={details?.stylist?.name}
                        onChange={(stylistId) => {
                          const stylist = stylists?.filter(
                            (c) => c.id === stylistId
                          )[0];
                          setDetail(
                            "stylist",
                            omit(
                              ["servicesBooked", "servicesCompleted"],
                              stylist
                            )
                          );
                        }}
                      >
                        {stylists?.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="form-group">
                      <label>Service</label>
                      <Select
                        id="service"
                        placeholder="Select Service"
                        className="ps-ant-dropdown"
                        listItemHeight={20}
                        value={details?.service?.name}
                        onChange={(serviceId) => {
                          const service = services?.filter(
                            (c) => c.id === serviceId
                          )[0];
                          setDetail("service", service);
                          //setDetail('price', service?.salePrice)
                        }}
                      >
                        {services?.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="form-group">
                      <label>
                        Date and Time<sup>*</sup>
                      </label>
                      <DatePicker
                        selected={
                          details?.dateTime
                            ? moment(details?.dateTime).toDate()
                            : moment().toDate()
                        }
                        onChange={(time) => setDetail("dateTime", time)}
                        timeInputLabel="Time:"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        showTimeInput
                        wrapperClassName="form-control"
                        className="form-control"
                        fixedHeight={true}
                      />
                    </div>
                  </div>
                </figure>
              </div>
            </div>
          </div>
          <div className="ps-form__bottom">
            <Link className="ps-btn ps-btn--black" href="/bookings">
              Back
            </Link>
            <Link className="ps-btn ps-btn--gray" href="/bookings">
              Cancel
            </Link>
            <button className="ps-btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </Form>
      </section>
    </ContainerDashboard>
  );
};
export default connect((state) => state.app)(CreateBookingPage);
