import React, { useEffect, useState } from "react";
import ContainerDashboard from "~/components/layouts/ContainerDashboard";
import Upload from "~/components/upload";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import categories from "~/public/data/categories.json";
import { Select, Form, notification } from "antd";
import { isEmpty, omit } from "ramda";
import { useRouter } from "next/router";
const { uuid } = require("uuidv4");

// import {  Upload } from 'antd';

const CreateBookingPage = ({ vendor, socket }) => {
  const router = useRouter();

  console.log("vendor", vendor);
  const dispatch = useDispatch();
  const [details, setDetails] = useState({ isPaid: false, price: 0 });
  const [updatedVendor, setUpdatedVendor] = useState();

  if(socket && ! updatedVendor){
    socket.emit("GET_VENDOR", {id: vendor.id})
    socket.on("RECEIVE_VENDOR", data => {
      setUpdatedVendor(data)
    })
  }
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  const setDetail = (key, val) => {
    setDetails({ ...details, [key]: val });
  };

  const handleSubmit = () => {
    const id = uuid();
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });
    notification.destroy(id);
    console.log(details);
    if (socket && !isEmpty(details)) {
      socket.emit("CREATE_VENDOR_BOOKING", {
        vendor: { _id: vendor._id },
        booking: {
          isComplete: false,
          isCancelled: false,
          dateAdded: new Date(),
          id: id,
          ...details,
        },
      });
      socket.on("RECEIVE_CREATE_VENDOR_BOOKING_SUCCESS", () => {
        notification.success({
          key: details.name,
          message: "Success!",
          description: "Your new booking has been added to your store!",
        });

        router.push("/orders");
      });
      socket.on("RECEIVE_CREATE_VENDOR_CUSTOMER_ERROR", () => {
        notification.error({
          key: details.name,
          message: "Something went wrong.",
          description: "Your new Service could not be added to your store.",
        });
      });
    }
  };
  console.log(details);
  return (
    <ContainerDashboard title="Create new product">
      <HeaderDashboard
        title="Create Booking"
        description="Dollup Create New Booking "
      />
      <section className="ps-new-item">
        <Form className="ps-form ps-form--new-product">
          <div className="ps-form__content">
            <div className="row">
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                <figure className="ps-block--form-box">
                  <figcaption>General</figcaption>
                  <div className="ps-block__content">
                    <div className="form-group">
                      <Form.Item
                        name="customer"
                        rules={[
                          {
                            required: true,
                            message: "Please select a customer",
                          },
                        ]}
                      >
                        <Select
                          id="customer"
                          placeholder="Select Customer"
                          className="ps-ant-dropdown"
                          listItemHeight={20}
                          value={details?.customer?.name}
                          onChange={(customerId) => {
                            const customer = updatedVendor?.customers?.filter(
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
                          {updatedVendor?.customers?.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="form-group">
                      <Form.Item
                        name="service"
                        rules={[
                          {
                            required: true,
                            message: "Please select a service",
                          },
                        ]}
                      >
                        <Select
                          id="service"
                          placeholder="Select Service"
                          className="ps-ant-dropdown"
                          listItemHeight={20}
                          value={details?.service?.name}
                          onChange={(serviceId) => {
                            const service = updatedVendor?.services?.filter(
                              (c) => c.id === serviceId
                            )[0];
                            setDetail("service", service);
                            //setDetail('price', service?.salePrice)
                          }}
                        >
                          {updatedVendor?.services?.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="form-group">
                      <label>
                        Date<sup>*</sup>
                      </label>
                      <Form.Item
                        name="date"
                        rules={[
                          {
                            required: true,
                            message: "Please input date",
                          },
                        ]}
                      >
                        <input
                          className="form-control"
                          type="date"
                          placeholder="Select Date"
                          value={details.date}
                          onChange={(e) => setDetail("date", e.target.value)}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </figure>
              </div>

              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                <figure className="ps-block--form-box">
                  <figcaption>Price</figcaption>
                  <div className="ps-block__content">
                    <h2>R{details?.service?.salePrice ?? 0}</h2>
                  </div>
                </figure>
              </div>
            </div>
          </div>
          <div className="ps-form__bottom">
            <a className="ps-btn ps-btn--black" href="products.html">
              Back
            </a>
            <button className="ps-btn ps-btn--gray">Cancel</button>
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
