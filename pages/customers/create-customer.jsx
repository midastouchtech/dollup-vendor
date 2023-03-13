import React, { useEffect, useState } from "react";
import ContainerDashboard from "~/components/layouts/ContainerDashboard";
import Upload from "~/components/upload";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import categories from "~/public/data/categories.json";
import { Select, Form, notification } from "antd";
import { isEmpty } from "ramda";
import { useRouter } from "next/router";
import AutoComplete from "~/components/autocomplete";
const { uuid } = require("uuidv4");

// import {  Upload } from 'antd';

const CreateServicePage = ({ vendor, socket }) => {
  const router = useRouter();

  console.log("vendor", vendor);
  const dispatch = useDispatch();
  const [details, setDetails] = useState({});

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  const setDetail = (key, val) => {
    setDetails({ ...details, [key]: val });
  };

  const handleSubmit = () => {
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });
    notification.destroy(details.name);
    console.log(details);
    if (socket && !isEmpty(details)) {
      socket.emit("CREATE_VENDOR_CUSTOMER", {
        vendor,
        customer: {
          active: true,
          dateAdded: new Date(),
          servicesBooked: [],
          servicesCompleted: [],
          id: uuid(),
          ...details,
        },
      });
      socket.on("RECEIVE_CREATE_VENDOR_CUSTOMER_SUCCESS", () => {
        notification.success({
          key: details.name,
          message: "Success!",
          description: "Your new customer has been added to your store!",
        });
        router.push("/customers");
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

  return (
    <ContainerDashboard title="Create new product">
      <HeaderDashboard
        title="Create Customer"
        description="Dollup Create New Customer "
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
                      <label>
                        Customer Name<sup>*</sup>
                      </label>
                      <Form.Item
                        name="customerName"
                        rules={[
                          {
                            required: true,
                            message: "Please input customer name",
                          },
                        ]}
                      >
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter customer name..."
                          value={details.name}
                          onChange={(e) => setDetail("name", e.target.value)}
                        />
                      </Form.Item>
                    </div>
                    <div className="form-group">
                      <label>
                        Phone number<sup>*</sup>
                      </label>
                      <Form.Item
                        name="phoneNumber"
                        rules={[
                          {
                            required: true,
                            message: "Please input customer phone number",
                          },
                        ]}
                      >
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter phone number..."
                          value={details.phoneNumber}
                          onChange={(e) =>
                            setDetail("phoneNumber", e.target.value)
                          }
                        />
                      </Form.Item>
                    </div>
                    <div className="form-group">
                      <label>
                        Email<sup>*</sup>
                      </label>
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Please input customer phone number",
                          },
                        ]}
                      >
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter email..."
                          value={details.email}
                          onChange={(e) => setDetail("email", e.target.value)}
                        />
                      </Form.Item>
                    </div>
                    <div className="form-group">
                      <label>
                        Password<sup>*</sup>
                      </label>
                      <Form.Item
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Please input customer phone number",
                          },
                        ]}
                      >
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter email..."
                          value={details.password}
                          onChange={(e) =>
                            setDetail("password", e.target.value)
                          }
                        />
                      </Form.Item>
                    </div>

                    <div className="form-group">
                      <label>
                        Address<sup>*</sup>
                      </label>
                      <AutoComplete
                        value={details?.address?.address}
                        onChange={(v) => setDetail("address", {address:v})}
                        onSelect={(v, l) => {
                          setDetail("address", {address:v, coordinates:l})
                        }}
                      />
                    </div>
                  </div>
                </figure>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                <figure className="ps-block--form-box">
                  <figcaption>Profile Image</figcaption>
                  <div className="ps-block__content">
                    <div className="form-group">
                      <Upload
                        onUploadComplete={(url) => setDetail("avatar", url)}
                      />
                    </div>
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
export default connect((state) => state.app)(CreateServicePage);
