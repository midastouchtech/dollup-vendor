import React from 'react';
import DropdownAction from '~/components/elements/basic/DropdownAction';

const TableCustomerItems = ({socket, customers}) => {

    const tableItemsView = customers?.map((item, index) => {
        let badgeView;

        if (item.active) {
            badgeView = <span className="ps-badge success">active</span>;
        } else {
            badgeView = <span className="ps-badge gray">deactive</span>;
        }

        return (
            <tr key={index}>
                <td>{index}</td>
                <td>
                    <strong>{item.name}</strong>
                </td>
                <td>{item.phoneNumber}</td>
                <td>{item.city}</td>
                <td>{item.balance ? `R${item.balance}` : 'R 0.00'}</td>
                <td>{item?.servicesBooked?.length}</td>
                <td>{badgeView}</td>
                <td>
                    <DropdownAction type="customers" id={item?.id} socket={socket}/>
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
                        <th>Balances</th>
                        <th>Total orders</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>{tableItemsView}</tbody>
            </table>
        </div>
    );
};

export default TableCustomerItems;
