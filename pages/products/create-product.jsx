import React, { useEffect, useState } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";
import Upload from "~/components/upload";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { Select } from "antd";
import { toggleDrawerMenu } from "~/store/app/action";
import categories from "~/public/data/categories.json";
import { Form, notification } from "antd";
import { isEmpty } from "ramda";
import { useRouter } from 'next/router';

// import {  Upload } from 'antd';

const CreateServicePage = ({ vendor, socket }) => {
  const router = useRouter();

  console.log("vendor", vendor)
  const dispatch = useDispatch();
  const [details, setDetails] = useState({});

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  const setDetail = (key, val) => {
    setDetails({ ...details, [key]: val });
  };

  const handleSubmit = () => {
    notification.destroy(details.name)
    console.log(details)
    if (socket && !isEmpty(details)) {
      socket.emit("CREATE_VENDOR_SERVICE", { vendor, service: {
        active: true,
        date: new Date(),
        ...details
      } });
      socket.on("RECEIVE_CREATE_VENDOR_SERVICE_SUCCESS", () => {
        notification.success({
          key: details.name,
          message: 'Success!',
          description:
            'Your new Service has been added to your store!',
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
        router.push('/products')
      });
      socket.on("RECEIVE_CREATE_VENDOR_SERVICE_ERROR", () => {
        notification.error({
          key: details.name,
          message: 'Something went wrong.',
          description:
            'Your new Service could not be added to your store.',
        });       
      });
    }
  };

  return (
    <ContainerDefault title="Create new product">
      <HeaderDashboard
        title="Create Service"
        description="Dollup Create New Service "
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
                        Service Name<sup>*</sup>
                      </label>
                      <Form.Item
                        name="serviceName"
                        rules={[
                          {
                            required: true,
                            message: "Please input service name",
                          },
                        ]}
                      >
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter service name..."
                          value={details.name}
                          onChange={(e) => setDetail("name", e.target.value)}
                        />
                      </Form.Item>
                    </div>
                    <div className="form-group">
                      <Form.Item
                        name="category"
                        rules={[
                          {
                            required: true,
                            message: "Please select category",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select Category"
                          className="ps-ant-dropdown"
                          listItemHeight={20}
                          value={details.category}
                          onChange={(value) => setDetail("category", value)}
                        >
                          {categories.map((c) => (
                            <option value={c.slug}>{c.title}</option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="form-group">
                      <label>
                        Regular Price<sup>*</sup>
                      </label>
                      <Form.Item
                        name="regularPrice"
                        rules={[
                          {
                            required: true,
                            message: "Please input regular price",
                          },
                        ]}
                      >
                        <input
                          className="form-control"
                          type="number"
                          placeholder=""
                          value={details.regularPrice}
                          onChange={(e) =>
                            setDetail("regularPrice", e.target.value)
                          }
                        />
                      </Form.Item>
                    </div>
                    <div className="form-group">
                      <label>
                        Sale Price<sup>*</sup>
                      </label>
                      <Form.Item
                        name="salePrice"
                        rules={[
                          {
                            required: true,
                            message: "Please input sale price",
                          },
                        ]}
                      >
                        <input
                          className="form-control"
                          type="text"
                          placeholder=""
                          value={details.salePrice}
                          onChange={(e) =>
                            setDetail("salePrice", e.target.value)
                          }
                        />
                      </Form.Item>
                    </div>
                    <div className="form-group">
                      <label>
                        Service Description<sup>*</sup>
                      </label>
                      <Form.Item
                        name="description"
                        rules={[
                          {
                            required: true,
                            message: "Please input service description",
                          },
                        ]}
                      >
                        <textarea
                          className="form-control"
                          rows="6"
                          name="editordata"
                          value={details.description}
                          onChange={(e) =>
                            setDetail("description", e.target.value)
                          }
                        ></textarea>
                      </Form.Item>
                    </div>
                  </div>
                </figure>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                <figure className="ps-block--form-box">
                  <figcaption>Service Images</figcaption>
                  <div className="ps-block__content">
                    <div className="form-group">
                      <label>Service Thumbnail</label>
                      
                        <Upload
                          onUploadComplete={(url) =>
                            setDetail("thumbnail", url)
                          }
                        />
                    </div>
                    <div className="form-group">
                      <label>Service Gallery</label>
                      <div className="form-group--nest">
                        <Upload
                          onUploadComplete={(url) =>
                            setDetail("galeryImage1", url)
                          }
                        />
                      </div>
                    </div>
                    <div className="form-group form-group--nest">
                      <Upload
                        onUploadComplete={(url) =>
                          setDetail("galeryImage2", url)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Video (optional)</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter video URL"
                        value={details.videoUrl}
                        onChange={(e) => setDetail("videoUrl", e.target.value)}
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
            <button className="ps-btn" onClick={handleSubmit}>Submit</button>
          </div>
        </Form>
      </section>
    </ContainerDefault>
  );
};
export default connect((state) => state.app)(CreateServicePage);
