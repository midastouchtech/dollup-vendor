import React from 'react';
import DropdownAction from '~/components/elements/basic/DropdownAction';

const TableCustomerItems = () => {
    const customers = [
        {
            name: 'Katlego Marais',
            phone: '+27 211-32-1145',
            balance: 'R211.00',
            orders: '10',
            status: 'true',
        },
        {
            name: 'Kuhle Amara',
            phone: '+27 916-971-217',
            balance: 'R211.00',
            orders: '10',
            status: 'true',
        },
        {
            name: 'Sive Vuza',
            phone: '+27 319-176-113',
            balance: 'R211.00',
            orders: '10',
            status: 'true',
        },
        {
            name: 'Amanda Black',
            phone: '+27 393-112-298',
            balance: 'R211.00',
            orders: '10',
            status: 'false',
        },
        {
            name: 'Grover Sampson',
            phone: '+27 393-872-137',
            balance: 'R211.00',
            orders: '10',
            status: 'true',
        },
        {
            name: 'Nelson Mckeown',
            phone: '+27 393-872-998',
            balance: 'R211.00',
            orders: '10',
            status: 'false',
        },
        {
            name: 'Zunaira Akhtar',
            phone: '+27 393-872-145',
            balance: 'R211.00',
            orders: '10',
            status: 'true',
        },
        {
            name: 'Natan Kramer',
            phone: '+27 293-872-145',
            balance: 'R211.00',
            orders: '10',
            status: 'false',
        },
        {
            name: 'Jesse Pollard',
            phone: '+27 291-32-145',
            balance: 'R211.00',
            orders: '10',
            status: 'true',
        },
    ];
    const tableItemsView = customers.map((item, index) => {
        let badgeView;

        if (item.status) {
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
                <td>{item.phone}</td>
                <td>{item.balance}</td>
                <td>{item.orders}</td>
                <td>{badgeView}</td>
                <td>
                    <DropdownAction />
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
