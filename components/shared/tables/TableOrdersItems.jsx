import React from 'react';
import Link from 'next/link';
import { Menu } from 'antd';
import DropdownAction from '~/components/elements/basic/DropdownAction';

const TableOrdersItems = ({socket, bookings }) => {
    

    const tableItemsView = bookings?.map((item) => {
        let badgeView, fullfillmentView;
        const menuView = (
            <Menu>
                <Menu.Item key={0}>
                    <a className="dropdown-item" href="#">
                        Edit
                    </a>
                </Menu.Item>
                <Menu.Item key={0}>
                    <a className="dropdown-item" href="#">
                        <i className="icon-t"></i>
                        Delete
                    </a>
                </Menu.Item>
            </Menu>
        );
        if (item.payment) {
            badgeView = <span className="ps-badge success">Paid</span>;
        } else {
            badgeView = <span className="ps-badge gray">Unpaid</span>;
        }
        if (item.isComplete) {
            fullfillmentView = (
                <span className="ps-fullfillment success">Completed</span>
            );
        }
        else if(item.isCancelled){
            fullfillmentView = (
                <span className="ps-fullfillment danger">Cancelled</span>
            );
        }
        else{
            fullfillmentView = (
                <span className="ps-fullfillment warning">In Progress</span>
            );
        }
        console.log("table bookings", bookings)
        return (
            <tr key={item?.id}>
                <td>
                    <strong> {item?.date}</strong>
                </td>
                <td>
                    <Link href="/bookings/order-detail">
                        <p>
                            <strong>{item?.customer?.name}</strong>
                        </p>
                    </Link>
                </td>
                <td>
                    <Link href="/bookings/order-detail">
                        <p>
                            <strong>{item?.service?.name}</strong>
                        </p>
                    </Link>
                </td>
                
                <td>{badgeView}</td>
                <td>{fullfillmentView}</td>
                <td>
                    <strong>R{item?.service?.salePrice ?? 0}</strong>
                </td>
                <td>
                    <DropdownAction socket={socket} id={item.id} type="bookings"/>
                </td>
            </tr>
        );
    });
    return (
        <div className="table-responsive">
            <table className="table ps-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Payment</th>
                        <th>Fullfillment</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>{tableItemsView}</tbody>
            </table>
        </div>
    );
};

export default TableOrdersItems;
