import React, { useEffect, useState } from "react";
import ContainerDashboard from "~/components/layouts/ContainerDashboard";
import Upload from "~/components/upload";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import categories from "~/public/data/categories.json";
import { Select, Form, notification } from "antd";
import { isEmpty } from "ramda";
import { useRouter } from 'next/router';
import Link from "next/link";
import AutoComplete from "~/components/autocomplete";

// import {  Upload } from 'antd';

const CreateStylistPage = ({ vendor, socket }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [details, setDetails] = useState();
  const { vendorId, stylistId } = router.query;    
 
  if(socket && !details){
    console.log("Getting stylist", vendorId, stylistId)
    socket.emit("GET_STYLIST", { vendorId, stylistId })
    socket.on("RECEIVE_VENDOR_STYLIST", (data) => {
      console.log("Receiving stylist", data)
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
      socket.emit("UPDATE_STYLIST", { vendor, stylist: {
        ...details
      } });
      
    }
    socket.on("RECEIVE_UPDATE_STYLIST_SUCCESS", () => {
      notification.success({
        key: details.name,
        message: 'Success!',
        description:
          'Your new stylist has been added to your store!',
      });
      router.push('/stylists')
      console.log("pushed stylists")
    });
    socket.on("RECEIVE_UPDATE_STYLIST_ERROR", () => {
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
    <ContainerDashboard title="Create new stylist">
      <HeaderDashboard
        title="Create Stylist"
        description="Dollup Create New Stylist "
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
                        Stylist Name<sup>*</sup>
                      </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter stylist name..."
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
                        Email<sup>*</sup>
                      </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter email..."
                          value={details?.email}
                          onChange={(e) => setDetail("email", e.target.value)}
                        />
                    </div>
                  </div>
                </figure>
              </div>
              
            </div>
          </div>
          <div className="ps-form__bottom">
            <Link className="ps-btn ps-btn--black" href="/stylists">
              Back
            </Link>
            <button className="ps-btn ps-btn--gray">Cancel</button>
            <button className="ps-btn" onClick={handleSubmit}>Submit</button>
          </div>
        </Form>
      </section>
    </ContainerDashboard>
  );
};
export default connect((state) => state.app)(CreateStylistPage);
