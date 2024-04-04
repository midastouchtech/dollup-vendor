import React, { useEffect, useState } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";
import Upload from "~/components/upload";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import { Select, Form, notification } from "antd";
import { assoc, flatten, isEmpty, omit } from "ramda";
import { useRouter } from "next/router";
import { Button, Modal } from "antd";
import ImgUploadWithCropper from "~/components/Img/crop";
import { uuid } from "uuidv4";
// import {  Upload } from 'antd';

const CreateServicePage = ({ vendor, socket }) => {
  const router = useRouter();

  console.log("vendor", vendor);
  const dispatch = useDispatch();
  const [details, setDetails] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (socket && isEmpty(categories)) {
      socket.emit("GET_ALL_CATEGORIES");
      socket.on("RECEIVE_ALL_CATEGORIES", (data) => {
        console.log(data);
        setCategories(data.categories);
      });
    }
  }, []);

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  const setDetail = (key, val) => {
    setDetails({ ...details, [key]: val });
  };

  const showModal = () => {
    if (!details?.duration) {
      setDetails({
        ...details,
        duration: { hours: 0, minutes: 0 },
        isModalOpen: true,
      });
    } else {
      setDetails({
        ...details,
        isModalOpen: true,
      });
    }
  };

  const handleOk = () => {
    setDetails({
      ...details,
      isModalOpen: false,
    });
  };

  const handleCancel = () => {
    setDetails({
      ...details,
      isModalOpen: false,
    });
  };

  const setDurationHours = (hours) =>
    setDetails({ ...details, duration: { ...details?.duration, hours } });
  const setDurationMinutes = (minutes) =>
    setDetails({ ...details, duration: { ...details?.duration, minutes } });

  const handleSubmit = () => {
    console.log("saving ", details)
    notification.destroy(details.name);
    console.log(details);
    if (socket && !isEmpty(details)) {
      const categoryWithoutSubs = omit(["subCategories"], details.category)
      const updatedDetails = {
        ...details,
        category: categoryWithoutSubs,
      }

      const detailsWithDuration = updatedDetails?.duration
        ? updatedDetails
        : assoc("duration", { hours: 0, minutes: 0 }, updatedDetails);
      console.log("saving", detailsWithDuration);
      socket.emit("CREATE_VENDOR_PRODUCT", {
        id: uuid(),
        vendor,
        active: true,
        date: new Date(),
        ...omit(["isModalOpen"], detailsWithDuration),
      });
      socket.on("RECEIVE_CREATE_PRODUCT_SUCCESS", () => {
        notification.success({
          key: details.name,
          message: "Success!",
          description: "Your new Product has been added to your store!",
        });

        setDetails({
          name: "",
          regularPrice: "",
          salePrice: "",
          thumbnail: "",
          galleryImage1: "",
          galleryImage2: "",
          description: "",
          category: "",
          videoUrl: "",
        });
        router.push("/products");
      });
      socket.on("RECEIVE_CREATE_PRODUCT_ERROR", () => {
        notification.error({
          key: details.name,
          message: "Something went wrong.",
          description: "Your new Product could not be added to your store.",
        });
      });
    }
  };
  console.log("details", details);
  return (
    <ContainerDefault title="Create new product">
      <HeaderDashboard
        title="Create Product"
        description="Dollup Create New Product "
      />
      <Modal
        title="Product duration"
        open={details?.isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <p>
            Please enter the number of hours and minutes this Product is going
            to take to perform.
          </p>
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6">
              <div className="form-group">
                <label>Hours</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder="Enter Hours..."
                  value={details?.duration?.hours}
                  onChange={(e) => setDurationHours(e.target.value)}
                />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6">
              <div className="form-group">
                <label>Minutes</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder="Enter Minutes..."
                  value={details?.duration?.minutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
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
                        Product Title<sup>*</sup>
                      </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter Product name..."
                          value={details.title}
                          onChange={(e) => setDetail("title", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                      <label>
                        Product Sub Title<sup>*</sup>
                      </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter Product name..."
                          value={details.subTitle}
                          onChange={(e) => setDetail("subTitle", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>
                          Category<sup>*</sup>
                        </label>
                        <Select
                          placeholder="Select Category"
                          className="ps-ant-dropdown"
                          listItemHeight={20}
                          value={details?.category?.id}
                          onChange={(value) => {
                            const category = categories.find(
                              (c) => c.id === value
                            );
                            setDetail("category", category);
                          }}
                        >
                          {categories?.map((c) => (
                            <option value={c.id}>{c.name}</option>
                          ))}
                        </Select>
                    </div>
                    <div className="form-group">
                        <label>
                          Sub Category<sup>*</sup>
                        </label>
                        <Select
                          placeholder="Select Sub Category"
                          className="ps-ant-dropdown"
                          listItemHeight={20}
                          value={details?.subCategory?.id}
                          onChange={(value) => {
                            const subCategory =
                              details.category?.subCategories?.find(
                                (sub) => sub.id === value
                              );
                            setDetail("subCategory", subCategory);
                          }}
                        >
                          {details.category?.subCategories?.map((sub) => (
                            <option value={sub.id}>{sub.name}</option>
                          ))}
                        </Select>
                    </div>
                    <div className="form-group">
                      <label>
                        Regular Price<sup>*</sup>
                      </label>
                        <input
                          className="form-control"
                          type="number"
                          placeholder=""
                          value={details.regularPrice}
                          onChange={(e) =>
                            setDetail("regularPrice", e.target.value)
                          }
                        />
                    </div>
                    <div className="form-group">
                      <label>
                        Sale Price<sup>*</sup>
                      </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder=""
                          value={details.salePrice}
                          onChange={(e) =>
                            setDetail("salePrice", e.target.value)
                          }
                        />
                    </div>
                    <div className="form-group">
                      <label>
                        Product Description<sup>*</sup>
                      </label>
                        <textarea
                          className="form-control"
                          rows="6"
                          name="editordata"
                          value={details.description}
                          onChange={(e) =>
                            setDetail("description", e.target.value)
                          }
                        ></textarea>
                    </div>
                  </div>
                </figure>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                <figure className="ps-block--form-box">
                  <figcaption>Product Images</figcaption>
                  <div className="ps-block__content">
                    <div className="form-group">
                      <label>Product Thumbnail</label>

                      <ImgUploadWithCropper
                        src={details?.thumbnail}
                        width="150"
                        height="150"
                        onUploadComplete={(src) => 
                          setDetail("thumbnail", src)
                        }
                        onUploadError={(err) => console.log(err)}
                      />
                    </div>
                  </div>
                  <br/>
                  <br/>
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
    </ContainerDefault>
  );
};
export default connect((state) => state.app)(CreateServicePage);
