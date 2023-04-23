import { set } from "ramda";
import React, { useEffect, useState } from "react";
import { uuid } from "uuidv4";
import ImgUploadWithCropper from "../Img/crop";
import { notification } from "antd";
// import {  Upload } from 'antd';

const RequestMainCategory = ({ socket }) => {
  const [error, setError] = useState();

  const [request, setRequest] = useState({
    type: "main",
    id: uuid(),
  });

  const submit = () => {
    console.log(request.name, request.description)
    if (request.name && request.description) {
      socket.emit("CREATE_CATEGORY_REQUEST", request);
      socket.on("RECEIVE_CREATE_REQUEST_SUCCESS", ()=>{
        notification.success({
            key: uuid(),
            message: "Success!",
            description: "Your new category has been requested!",
          });
      })
      setError("")
      setRequest({
        description: null,
        name: null,
        id: uuid(),
        type: "main",
      })
    } else {
      setError("Please fill all the fields");
    }
  };

  return (
    <section className="ps-new-item">
      <div className="ps-form ps-form--new-product">
        <div className="ps-form__content">
          <div className="row">
            <div className=" col-12">
              <figure className="ps-block--form-box">
                <figcaption>Please provide the following</figcaption>
                <div className="ps-block__content">
                  <div className="form-group">
                    <label>
                      <sup>{error}</sup>
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      Category Name<sup>*</sup>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter category name..."
                      value={request.name ?? ""}
                      onChange={(e) =>
                        setRequest({ ...request, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Category description<sup>*</sup>
                    </label>
                    <br />
                    <small>
                      A brief summary about this category highlighting what you
                      do and how you do it.
                    </small>

                    <textarea
                      className="form-control mt-4"
                      type="text"
                      placeholder="Enter category description..."
                      value={request.description ?? ""}
                      onChange={(e) =>
                        setRequest({ ...request, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Example Image<sup>*</sup>
                    </label>
                    <ImgUploadWithCropper
                        src={request?.src}
                        width="150"
                        height="150"
                        onUploadComplete={(src) => 
                          setRequest({ ...request, thumbnail:src })
                        }
                        onUploadError={(err) => console.log(err)}
                      />
                  </div>
                </div>
              </figure>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button className="ps-btn" onClick={submit}>
            Submit
          </button>
        </div>
      </div>
    </section>
  );
};
export default RequestMainCategory;
