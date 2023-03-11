import React, { useEffect, useState } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";
import Upload from "~/components/upload";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import categories from "~/public/data/categories.json";
import { Select, Form, notification } from "antd";
import { isEmpty } from "ramda";
import { useRouter } from 'next/router';
import Link from "next/link";

// import {  Upload } from 'antd';

const CreateServicePage = ({ vendor, socket }) => {
  const router = useRouter();

  console.log("vendor", vendor)
  const dispatch = useDispatch();
  const [details, setDetails] = useState();
  const { vendorId, customerId } = router.query;    
 
   console.log("socketlives",socket)
  if(socket && !details){
    console.log("Getting customer", vendorId, customerId)
    socket.emit("GET_VENDOR_CUSTOMER", { vendorId, customerId })
    socket.on("RECEIVE_VENDOR_CUSTOMER", (data) => {
      console.log("Receiving customer", data)
      setDetails(data)
    })
  }

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
    notification.destroy(details.name)
    console.log(details)
    if (socket && !isEmpty(details)) {
      socket.emit("UPDATE_VENDOR_CUSTOMER", { vendor, customer: {
        ...details
      } });
      
    }
    socket.on("RECEIVE_UPDATE_VENDOR_CUSTOMER_SUCCESS", () => {
      notification.success({
        key: details.name,
        message: 'Success!',
        description:
          'Your new customer has been added to your store!',
      });
      router.push('/customers')
      console.log("pushed customers")
    });
    socket.on("RECEIVE_UPDATE_VENDOR_CUSTOMER_ERROR", () => {
      notification.error({
        key: details.name,
        message: 'Something went wrong.',
        description:
          'Your new Service could not be added to your store.',
      });       
    });
  };

  console.log("details", details)
  return (
    <ContainerDefault title="Create new product">
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
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter customer name..."
                          value={details?.name}
                          onChange={(e) => setDetail("name", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                      <label>
                        Phone number<sup>*</sup>
                      </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter phone number..."
                          value={details?.phoneNumber}
                          onChange={(e) => setDetail("phoneNumber", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                      <label>
                        City<sup>*</sup>
                      </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter city name..."
                          value={details?.city}
                          onChange={(e) => setDetail("city", e.target.value)}
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
                          onUploadComplete={(url) =>
                            setDetail("avatar", url)
                          }
                        />
                    </div>
                  </div>
                </figure>
              </div>
            </div>
          </div>
          <div className="ps-form__bottom">
            <Link className="ps-btn ps-btn--black" href="/customers">
              Back
            </Link>
            <button className="ps-btn ps-btn--gray">Cancel</button>
            <button className="ps-btn" onClick={handleSubmit}>Submit</button>
          </div>
        </Form>
      </section>
    </ContainerDefault>
  );
};
export default connect((state) => state.app)(CreateServicePage);
