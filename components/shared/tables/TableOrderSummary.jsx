import React from "react";
import moment from "moment";

const TableOrderSummary = ({ bookings }) => (
  <div className="table-responsive">
    <table className="table ps-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Service</th>
          <th>Payment</th>
          <th>Fullfillment</th>
          <th>Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {bookings &&
          bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id.split("-")[0]}</td>
              <td>{moment(booking.dateTime).format("DD MMM YYYY HH:mm")}</td>
              <td>{booking.service.name}</td>
              <td>{booking.isPaid ? "Paid" : "Not Paid"}</td>
              <td>{booking.isComplete ? "Fullfilled" : "Not Fullfilled"}</td>
              <td>R {booking.service.salePrice}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

export default TableOrderSummary;
