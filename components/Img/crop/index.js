import React, { useState, useRef } from "react";
import axios from "axios";
import { set } from "ramda";

export default function ImgUploadWithCropper(props) {

  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [percentCompleted, setPercentCompleted] = useState(0);

  function onSelectFile(e) {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  }

  function uploadFileToCloudinary() {
    setIsUploading(true);
    setUploadComplete(false);
    const url = "https://api.cloudinary.com/v1_1/dhrndsuey/raw/upload";
    const formData = new FormData();
    formData.append("file", file, fileName);
    formData.append("upload_preset", "v2f3pxl6");
    axios({
      method: "POST",
      data: formData,
      onUploadProgress: (progressEvent) => {
        console.log(progressEvent.loaded);

        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setPercentCompleted(percentCompleted);
        if (percentCompleted === 100) {
          setPercentCompleted(0);
        }
      },
      headers: { "Content-Type": "multipart/form-data" },
      url,
    })
      .then((response) => {
        setIsUploading(false);
        console.log(response.data.secure_url);
        props.onUploadComplete(response.data.secure_url);
        setUploadComplete(true);
      })
      .then((data) => {});
  }

  function upload(e) {
    setIsUploading(true);
    const url = "https://api.cloudinary.com/v1_1/clinic-plus/raw/upload";
    const formData = new FormData();
    formData.append("file", file, fileName);
    formData.append("upload_preset", "pwdsm6sz");
    axios({
      method: "POST",
      data: formData,
      onUploadProgress: (progressEvent) => {
        console.log(progressEvent.loaded);

        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setPercentCompleted(percentCompleted);
        if (percentCompleted === 100) {
          setPercentCompleted(0);
        }
      },
      headers: { "Content-Type": "multipart/form-data" },
      url,
    })
      .then((response) => {
        setIsUploading(false);
        console.log(response.data.secure_url);
        props.onUploadComplete(response.data.secure_url);
      })
      .then((data) => {});
  }


  return (
    <div className="App">
      <div className="row">
        <div class="col-sm-12 col-xs-12">
          <div className="flex-column align-items-center d-flex justify-content-center">
            <div className="col-md-12 mb-3">
              <input
                type="file"
                class="custom-file-input"
                onChange={onSelectFile}
              />
              <label class="custom-file-label">{fileName ? fileName : "Choose file"}</label>
            </div>
          </div>
          <div className="d-flex justify-content-center flex-column mb-3">
            <div
              className="col-md-12 text-center"
              style={{
                padding: 0,
              }}
            >
              <button
                className="btn btn-primary mb-3"
                onClick={uploadFileToCloudinary}
              >
                Upload
              </button>
              {isUploading && <div>Uploading... {percentCompleted}%</div>}
              {uploadComplete && <div>Upload Complete !</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
