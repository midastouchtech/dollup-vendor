import React from 'react';
import DropdownAction from '~/components/elements/basic/DropdownAction';

const TableProjectItems = ({services, socket}) => {
    const productItems = [
        {
            name: 'Herschel Leather Duffle Bag In Brown Color',
            sku: 'AB123456789-1',
            stock: 'true',
            price: '£125.30',
            date: '2019/11/06',
            categories: [
                {
                    name: 'Bags',
                },
                {
                    name: 'Clothing & Apparel',
                },
            ],
        },
    ];
    const tableItems = services?.map((item, index) => {
        let badgeView;
        if (item?.active) {
            badgeView = <span className="ps-badge success">Active</span>;
        } else {
            badgeView = <span className="ps-badge gray">Inactive</span>;
        }
        return (
            <tr key={item?.name}>
                <td>{index + 1}</td>
                <td>
                    <a href="#">
                        <strong>{item?.name}</strong>
                    </a>
                </td>
                <td>{badgeView}</td>
                <td>
                    <strong>{item?.salePrice}</strong>
                </td>
                <td>
                    <p className="ps-item-categories">
                        {item?.category}
                        {/* {item?.categories.map((cat) => (
                            <a href="#" key={cat.name}>
                                {cat.name}
                            </a>
                        ))} */}
                    </p>
                </td>
                <td>{item?.date}</td>
                <td>
                    <DropdownAction id={item?.id} socket={socket} />
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
                        <th>Active</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>{tableItems}</tbody>
            </table>
        </div>
    );
};

export default TableProjectItems;
