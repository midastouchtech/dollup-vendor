import moment from "moment";
import React from "react";
import DropdownAction from "~/components/elements/basic/DropdownAction";

const TableCustomerItems = ({ socket, customers }) => {
  const tableItemsView = customers?.map((item, index) => {
    let badgeView;

    if (item.active ? item.active : item.registered) {
      badgeView = <span className="ps-badge success">Registered</span>;
    } else {
      badgeView = <span className="ps-badge gray">Not Registered</span>;
    }

    return (
      <tr key={index}>
        <td>{index}</td>
        <td>
          <strong>{item.name}</strong>
        </td>
        <td>{item.phoneNumber}</td>
        <td>
          {
            item?.address?.address?.split(",")[
              item?.address?.address?.split(",").length - 2
            ]
          }
        </td>
        <td className={item.totalpaid > 0 ? "text-success" : "text-danger"}>
          {item.totalpaid ? `+R ${item.totalpaid}` : "R 0.00"}
        </td>
        <td className={item.totalunpaid > 0 ? "text-danger" : "text-success"}>
          {item.totalunpaid ? `-R ${item.totalunpaid}` : "R 0.00"}
        </td>
        <td>{item?.bookings}</td>
        <td>
          {item.lastBooking.service.name}
          <br /> {item.lastBooking.vendor.storeName} <br />
          {moment(item.lastBooking.dateTime).format("DD/MM/YYYY")}
        </td>
        <td>
          <DropdownAction type="customers" id={item?.id} socket={socket} />
        </td>
      </tr>
    );
  });
  return (
    <div className="table-responsive">
      <table className="table ps-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>City</th>
            <th>Total Paid</th>
            <th>Total Un-Paid</th>
            <th>Total Bookings</th>
            <th>Last Booking</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{tableItemsView}</tbody>
      </table>
    </div>
  );
};

export default TableCustomerItems;
