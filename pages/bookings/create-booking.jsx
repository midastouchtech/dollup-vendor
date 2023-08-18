import React, { useEffect, useState } from "react";
import ContainerDashboard from "~/components/layouts/ContainerDashboard";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import { Select, Form, notification } from "antd";
import { isEmpty, omit } from "ramda";
import { useRouter } from "next/router";
const { uuid } = require("uuidv4");
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateBookingPage = ({ vendor, socket }) => {
  const router = useRouter();

  console.log("vendor", vendor);
  const dispatch = useDispatch();
  const [details, setDetails] = useState({ isPaid: false, price: 0 });
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [selectedService, setSelectedService] = useState();
  const [selectedStylist, setSelectedStylist] = useState();

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
    if (
      socket &&
      isEmpty(customers) &&
      isEmpty(services) &&
      isEmpty(stylists)
    ) {
      socket.emit("GET_VENDOR_CUSTOMERS", { id: vendor.id });
      socket.emit("GET_VENDOR_STYLISTS", { id: vendor.id });
      socket.emit("GET_VENDOR_SERVICES", { id: vendor.id });
      socket.on("RECEIVE_VENDOR_CUSTOMERS", (data) => {
        setCustomers(data);
      });
      socket.on("RECEIVE_VENDOR_STYLISTS", (data) => {
        setStylists(data);
      });
      socket.on("RECEIVE_VENDOR_SERVICES", (data) => {
        setServices(data);
      });
    }
  }, []);

  const setDetail = (key, val) => {
    setDetails({ ...details, [key]: val });
  };

  const handleSubmit = () => {
    const id = uuid();
    notification.destroy(id);
    if (socket && !isEmpty(details)) {
      socket.emit("CREATE_BOOKING", {
        vendor: vendor,
        customer: selectedCustomer,
        service: selectedService,
        stylist: selectedStylist,
        isComplete: false,
        isCancelled: false,
        dateAdded: new Date(),
        id: id,
        ...details,
      });
      socket.on("RECEIVE_CREATE_BOOKING_SUCCESS", () => {
        notification.success({
          key: details.name,
          message: "Success!",
          description: "Your new booking has been added to your store!",
        });
        router.push("/bookings");
      });
      socket.on("RECEIVE_CREATE_BOOKING_ERROR", () => {
        notification.error({
          key: details.name,
          message: "Something went wrong.",
          description: "Your new booking could not be created.",
        });
      });
    }
  };
  return (
    <ContainerDashboard title="Create new product">
      <HeaderDashboard
        title="Create Booking"
        description="Dollup Create New Booking "
      />
      <section className="ps-new-item">
        <Form className="ps-form ps-form--new-product">
          <div className="ps-form__content">
            <div className="row d-flex justify-content-center">
              <div className="col-md-8 col-sm-12">
                <figure className="ps-block--form-box">
                  <figcaption>General</figcaption>
                  <div className="ps-block__content">
                    <div className="form-group">
                      <label>
                        Booking Type
                        <sup>*</sup>
                      </label>
                      <Select
                        id="type"
                        placeholder="Select Booking Type"
                        className="ps-ant-dropdown"
                        listItemHeight={20}
                        onChange={(val) => {
                          setDetail("type", val);
                          setSelectedCustomer({
                            ...selectedCustomer,
                            registered: false,
                            id: uuid(),
                            associatedVendors: [
                              omit(
                                [
                                  "services",
                                  "stylists",
                                  "hash",
                                  "password",
                                  "fullName",
                                  "tracking",
                                  "bannerImages",
                                ],
                                vendor
                              ),
                            ],
                          });
                        }}
                      >
                        <option value="walkin">Walk In</option>
                        <option value="online">Online</option>
                      </Select>
                    </div>
                    {details.type === "online" && (
                      <div className="form-group">
                        <label>Customer</label>
                        <Select
                          id="customer"
                          placeholder="Select Customer"
                          className="ps-ant-dropdown"
                          listItemHeight={20}
                          value={selectedCustomer?.name}
                          onChange={(customerId) => {
                            const customer = customers?.filter(
                              (c) => c.id === customerId
                            )[0];
                            setSelectedCustomer({
                              id: customerId,
                              name: customer.name,
                              email: customer.email,
                              phoneNumber: customer.phoneNumber,
                              registered: true,
                            });
                          }}
                        >
                          {customers?.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </Select>
                      </div>
                    )}
                    {details.type === "walkin" && (
                      <div>
                        <div className="form-group">
                          <label>Customer Name</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Customer Name"
                            onChange={(e) =>
                              setSelectedCustomer({
                                ...selectedCustomer,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Customer Email</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Customer Email"
                            onChange={(e) =>
                              setSelectedCustomer({
                                ...selectedCustomer,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Customer Phone Number</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Customer Phone Number"
                            onChange={(e) =>
                              setSelectedCustomer({
                                ...selectedCustomer,
                                phoneNumber: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                    <div className="form-group">
                      <label>Service</label>
                      <Select
                        id="service"
                        placeholder="Select Service"
                        className="ps-ant-dropdown"
                        listItemHeight={20}
                        value={selectedService?.name}
                        onChange={(serviceId) => {
                          const service = services?.filter(
                            (c) => c._id === serviceId
                          )[0];
                          console.log("selecting  service", service);
                          setSelectedService(service);
                        }}
                      >
                        {services?.map((c) => (
                          <option key={c.id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </Select>
                      {selectedService && (
                        <p className="text-mute mt-3">
                          Price: R {selectedService?.salePrice}
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Stylist</label>
                      <Select
                        id="stylist"
                        placeholder="Select Customer"
                        className="ps-ant-dropdown"
                        listItemHeight={20}
                        value={details?.stylist?.name}
                        onChange={(stylistId) => {
                          const stylist = stylists?.filter(
                            (c) => c.id === stylistId
                          )[0];
                          setSelectedStylist(stylist);
                        }}
                      >
                        {stylists?.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="form-group">
                      <label>
                        Date<sup>*</sup>
                      </label>
                      <DatePicker
                        selected={details?.dateTime}
                        onChange={(time) => setDetail("dateTime", time)}
                        timeInputLabel="Time:"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        showTimeInput
                        wrapperClassName="form-control"
                        className="form-control"
                        fixedHeight={true}
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
export default connect((state) => state.app)(CreateBookingPage);
