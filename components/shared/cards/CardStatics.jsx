import React from "react";
import { useState, useEffect } from "react";

const PLATFORM_COMMISION = 0.2;

const CardStatics = ({ vendor, socket }) => {
  const [chartData, setChartData] = useState([]);
  const [bookings, setBookings] = useState();

  useEffect(() => {
    if (!bookings && socket && vendor) {
      socket.emit("GET_VENDOR_BOOKINGS", { id: vendor.id });
      socket.on("RECEIVE_VENDOR_BOOKINGS", (data) => {
        setBookings(data);
      });
    }
  }, []);

  const completedBookings = bookings?.filter((b) => b.isComplete === true);

  useEffect(() => {
    if (bookings) {
      const services = completedBookings.map((b) => b.service);
      let prices = {};
      services.forEach((s, i) => {
        if (!prices[s.id]) {
          prices[s.id] = {
            name: s.name,
            price: parseInt(s.salePrice),
          };
        } else {
          prices[s.id].price = prices[s.id].price + parseInt(s.salePrice);
        }
      });
      const data = Object.values(prices).map((p) => p.price);
      setChartData(data);
    }
  }, [bookings]);

  const total = chartData.reduce((acc, curr) => acc + curr, 0);
  const stylistCommision = total * (parseInt(vendor?.stylistCommision) / 100);
  const platformCommision = total * PLATFORM_COMMISION;
  const balance = total - stylistCommision - platformCommision;
  return (
    <section className="ps-card ps-card--statics">
      <div className="ps-card__header">
        <h4>Statics</h4>
        {/* <div className="ps-card__sortby">
          <i className="icon-calendar-empty"></i>
          <div className="form-group--select">
            <select className="form-control">
              <option value="1">Last 30 days</option>
              <option value="2">Last 90 days</option>
              <option value="3">Last 180 days</option>
            </select>
            <i className="icon-chevron-down"></i>
          </div>
        </div> */}
      </div>
      <div className="ps-card__content">
        <div className="ps-block--stat yellow">
          <div className="ps-block__left">
            <span>
              <i className="icon-cart"></i>
            </span>
          </div>
          <div className="ps-block__content">
            <p>Complete Bookings</p>
            <h4>
              {completedBookings?.length}
              {/* <small className="asc">
                <i className="icon-arrow-up"></i>
                <span>0%</span>
              </small> */}
            </h4>
          </div>
        </div>
        <div className="ps-block--stat pink">
          <div className="ps-block__left">
            <span>
              <i className="icon-cart"></i>
            </span>
          </div>
          <div className="ps-block__content">
            <p>Revenue</p>
            <h4>
              R{total}
              {/* <small className="asc">
                <i className="icon-arrow-up"></i>
                <span>0%</span>
              </small> */}
            </h4>
          </div>
        </div>
        <div className="ps-block--stat green">
          <div className="ps-block__left">
            <span>
              <i className="icon-cart"></i>
            </span>
          </div>
          <div className="ps-block__content">
            <p>Earning</p>
            <h4>
              R{balance}
              {/* <small className="desc">
                <i className="icon-arrow-down"></i>
                <span>0%</span>
              </small> */}
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardStatics;
