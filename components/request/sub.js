import { isEmpty, set, assocPath,omit } from "ramda";
import React, { useEffect, useState } from "react";
import { uuid } from "uuidv4";
import ImgUploadWithCropper from "../Img/crop";
import Select from "react-select";
import { notification } from "antd";
// import {  Upload } from 'antd';

const RequestSubCategory = ({ socket }) => {
  const [error, setError] = useState();
  const [categories, setCategories] = useState([]);

  const [request, setRequest] = useState({
    type: "sub",
    id: uuid(),
  });

  useEffect(() => {
    socket.emit("GET_ALL_CATEGORIES");
    socket.on("RECEIVE_ALL_CATEGORIES", (data) => {
      setCategories(data.categories);
    });
  }, []);

  const submit = () => {
    console.log(request?.name, request?.description);
    if (request?.name && request?.description && request?.category && request?.thumbnail) {
      socket.emit("CREATE_CATEGORY_REQUEST", request);
      socket.on("RECEIVE_CREATE_REQUEST_SUCCESS", ()=>{
        notification.success({
            key: uuid(),
            message: "Success!",
            description: "Your new category has been requested!",
          });
      })
      setError("");
      setRequest({
        description: null,
        name: null,
        id: uuid(),
        type: "sub",
        category: null,
        thumbnail: null
      });
    } else {
      setError("Please fill all the fields");
    }
  };

  const handleChange = (selectedOption) => {
    const selectedCategory = omit(["subCategories"], categories.find(c => c.id === selectedOption.value));
    setRequest(assocPath(["category"], selectedCategory, request));
  };

  const categoriesOptions = categories?.map(c => ({label: c.name, value: c.id}));
 console.log(request)
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
                      Sub Category Name<sup>*</sup>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter category name..."
                      value={request?.name ?? ""}
                      onChange={(e) =>
                        setRequest({ ...request, name: e.target.value })
                      }
                    />
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-12 col-form-label">Category</label>
                    <div class="col-sm-12">
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        defaultValue={categoriesOptions[0]}
                        isDisabled={isEmpty(categories)}
                        isLoading={isEmpty(categories)}
                        isSearchable
                        name="categories"
                        options={categoriesOptions}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>
                      Sub Category description<sup>*</sup>
                    </label>
                    <br />

                    <small>
                      A brief summary about this sub category highlighting what
                      you do and how you do it.
                    </small>

                    <textarea
                      className="form-control mt-4"
                      type="text"
                      placeholder="Enter category description..."
                      value={request?.description ?? ""}
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
                      src={request?.thumbnail}
                      width="150"
                      height="150"
                      onUploadComplete={(src) =>
                        setRequest({ ...request, thumbnail: src })
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
export default RequestSubCategory;
