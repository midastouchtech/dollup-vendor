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
import Link from 'next/link';
import dynamic from 'next/dynamic'

// const Select = dynamic(import('antd/es/select'), { ssr: false }) 
// const Form = dynamic(import('antd/es/form'), { ssr: false })
// const notification = dynamic(import('antd/es/notification'), { ssr: false }) 

const EditServicePage = ({ vendor, socket }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { vendorId, serviceId } = router.query;  

  
  const [details, setDetails] = useState();

  if(socket && !details){
    socket.emit("GET_VENDOR_SERVICE", { vendorId, serviceId })
    socket.on("RECEIVE_VENDOR_SERVICE", (data) => {
      console.log("Receiving service", data)
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
    notification.destroy()
    console.log(details)
    if (socket && !isEmpty(details)) {
      socket.emit("UPDATE_VENDOR_SERVICE", { vendor, service: details });
      socket.on("RECEIVE_UPDATE_VENDOR_SERVICE_SUCCESS", () => {
        notification.success({
          message: 'Success!',
          description:
            'Your service info has been updated!',
        });
        router.push('/products')
      });
      socket.on("RECEIVE_CREATE_VENDOR_SERVICE_ERROR", () => {
        notification.error({
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
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter service name..."
                          value={details?.name}
                          onChange={(e) => setDetail("name", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <Select
                          placeholder="Select Category"
                          className="ps-ant-dropdown"
                          listItemHeight={20}
                          value={details?.category}
                          onChange={(value) => setDetail("category", value)}
                        >
                          {categories.map((c) => (
                            <option value={c.slug}>{c.title}</option>
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
                          value={details?.regularPrice}
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
                          value={details?.salePrice}
                          onChange={(e) =>
                            setDetail("salePrice", e.target.value)
                          }
                        />
                    </div>
                    <div className="form-group">
                      <label>
                        Service Description<sup>*</sup>
                      </label>
                        <textarea
                          className="form-control"
                          rows="6"
                          name="editordata"
                          value={details?.description}
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
                  <figcaption>Service Images</figcaption>
                  <div className="ps-block__content">
                    <div className="form-group">
                      <label>Service Thumbnail</label>
                      
                        <Upload
                          existingFileList={details?.thumbnail ? [{url:details?.thumbnail}]: []}
                          onUploadComplete={(url) =>
                            setDetail("thumbnail", url)
                          }
                        />
                    </div>
                    <div className="form-group">
                      <label>Service Gallery</label>
                      <div className="form-group--nest">
                        <Upload
                          existingFileList={details?.galeryImage1 ? [{url:details?.galeryImage1}]: []}
                          onUploadComplete={(url) =>
                            setDetail("galeryImage1", url)
                          }
                        />
                      </div>
                    </div>
                    <div className="form-group form-group--nest">
                      <Upload
                        existingFileList={details?.galeryImage2 ? [{url:details?.galeryImage2}]: []}
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
                        value={details?.videoUrl}
                        onChange={(e) => setDetail("videoUrl", e.target.value)}
                      />
                    </div>
                  </div>
                </figure>
              </div>
            </div>
          </div>
          <div className="ps-form__bottom">
            <Link  href="/products">
              <button className="ps-btn ps-btn--black">Back</button>
            </Link>
            <Link  href="/products">
              <button className="ps-btn ps-btn--gray">Cancel</button>
            </Link>
            <button className="ps-btn" onClick={handleSubmit}>Submit</button>
          </div>
        </Form>
      </section>
    </ContainerDefault>
  );
};
export default connect((state) => state.app)(EditServicePage);
