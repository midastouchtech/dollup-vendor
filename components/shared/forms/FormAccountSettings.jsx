import React from "react";
import Upload from "~/components/upload";
import AutoComplete from "~/components/autocomplete";

const FormAccountSettings = ({vendor, socket}) => {
  console.log(vendor)
  const [details, setDetails] = React.useState({
    fullName: "",
    storeName: "",
    email: "",
    cell: "",
    address: "",
    bio: "",
    avatar: "",
    ...vendor
  });

  const setDetail = (key, value) => {
    setDetails({
      ...details,
      [key]: value,
    });
  };
  
  const onSubmit = (e) => {
    e.preventDefault()
    socket.emit("UPDATE_VENDOR", {...vendor, ...details});
    socket.on("UPDATE_VENDOR_SUCCESS", () => {
        console.log("Vendor update success");
    })
  };

  return (
    <form
      className="ps-form--account-settings"
    >
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label>Full Name</label>
            <input
              className="form-control"
              type="text"
              placeholder=""
              value={details?.fullName}
              onChange={(e) => setDetail("fullName", e.target.value)}
            />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Salon Name</label>
            <input
              className="form-control"
              type="text"
              placeholder=""
              value={details?.storeName}
              onChange={(e) => setDetail("storeName", e.target.value)}
            />
          </div>
        </div>
        <div className="col-sm-12">
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="text"
              placeholder=""
              value={details?.email}
              onChange={(e) => setDetail("email", e.target.value)}
            />
          </div>
        </div>
        <div className="col-sm-12">
          <div className="form-group">
            <label>Contact Number</label>
            <input
              className="form-control"
              type="text"
              placeholder=""
              value={details?.cell}
              onChange={(e) => setDetail("cell", e.target.value)}
            />
          </div>
        </div>
        <div className="col-sm-12">
          <div className="form-group">
            <label>Address</label>
            <AutoComplete
              value={details?.address}
              onChange={(v) => setDetail("address", v)}
              onSelect={(v) => setDetail("address", v)}
            />
          </div>
        </div>
        <div className="col-sm-12">
          <div className="form-group">
            <label>Salon Bio</label>
            <textarea
              className="form-control"
              rows="6"
              placeholder=""
              value={details?.bio}
              onChange={(e) => setDetail("bio", e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
          <figure className="ps-block--form-box">
            <figcaption>Salon profile Image</figcaption>
            <div className="ps-block__content">
              <div className="form-group">
                <Upload onUploadComplete={(url) => setDetail("avatar", url)} />
              </div>
            </div>
          </figure>
        </div>
      </div>
      <div className="ps-form__submit text-center">
        <button className="ps-btn success" onClick={onSubmit}>Update Profile</button>
      </div>
    </form>
  );
};

export default FormAccountSettings;
