import React from "react";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import moment from "moment";
import R from "ramda";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CardSaleReport = ({ socket, vendor }) => {
  const [chartData, setChartData] = useState([]);
  const [chartCategories, setChartCategories] = useState([]);

  const [selectedDay, setSelectedDay] = useState(new Date());
  const [bookings, setBookings] = useState();
  const [originalBookings, setOriginalBookings] = useState([]);
  const [stylists, setStylists] = useState();
  const [originalStylists, setOriginalStylists] = useState();
  const [selectedStylist, setSelectedStylist] = useState();
  const [selectedBooking, setSelectedBooking] = useState();

  useEffect(() => {
    console.log("bookings", bookings);
    console.log("socket", socket);
    console.log("vendor", vendor);
    if (!bookings && socket && vendor) {
      socket.emit("GET_VENDOR_BOOKINGS", { id: vendor.id });
      socket.on("RECEIVE_VENDOR_BOOKINGS", (data) => {
        console.log("RECEIVE_VENDOR_BOOKINGS", data);
        setBookings(data);
      });
      socket.emit("GET_VENDOR_STYLISTS", { id: vendor.id });
      socket.on("RECEIVE_VENDOR_STYLISTS", (data) => {
        setStylists(data);
      });
    }
  }, []);

  const state = {
    series: [
      {
        name: "series1",
        data: chartData,
      },
    ],

    options: {
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#fe0056", "#f9f9f9", "#9C27B0"],
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: chartCategories,
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      responsive: [
        {
          breakpoint: 1680,
          options: {
            chart: {
              width: "100%",
            },
          },
        },
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100%",
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  useEffect(() => {
    if (bookings) {
      const services = bookings.map((b) => b.service);
      const serviceSales = services.map((s) => {
        const serviceBookings = bookings.filter((b) => b.service === s);
        const serviceSales = serviceBookings.reduce(
          (acc, curr) => acc + parseInt(curr.service.salePrice),
          0
        );
        return serviceSales;
      });
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
      const categories = Object.values(prices).map((p) => p.name);
      setChartData(data);
      setChartCategories(categories);
    }
  }, [bookings]);

  return (
    <div className="ps-card ps-card--sale-report">
      <div className="ps-card__header">
        <h4>Sales Reports</h4>
      </div>

      <div className="ps-card__content">
        <div id="chart"></div>
        <Chart
          options={state.options}
          series={state.series}
          type="bar"
          height={320}
        />
      </div>

      <div className="ps-card__footer">
        <div className="row">
          <div className="col-md-8">
            <p>Potential Sales By Service (R)</p>
          </div>
          <div className="col-md-4">
            <a href="#">
              Export Report
              <i className="icon icon-cloud-download ml-2"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSaleReport;
