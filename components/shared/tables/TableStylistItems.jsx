import React from 'react';
import DropdownAction from '~/components/elements/basic/DropdownAction';

const StylistsTable = ({socket, stylists}) => {

    const tableItemsView = stylists?.map((item, index) => {
        let badgeView;

        if (item.active) {
            badgeView = <span className="ps-badge success">active</span>;
        } else {
            badgeView = <span className="ps-badge gray">deactive</span>;
        }

        return (
            <tr key={index}>
                <td>{index+1}</td>
                <td>
                    <strong>{item.name}</strong>
                </td>
                <td>{item.phoneNumber}</td>
                <td>{item.email}</td>
                <td>
                    <DropdownAction type="stylists" id={item?.id} socket={socket}/>
                </td>
            </tr>
        );
    });
    return (
        <div className="table-responsive">
            <table className="table ps-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>{tableItemsView}</tbody>
            </table>
        </div>
    );
};

export default StylistsTable;
