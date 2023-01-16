import React from 'react';

const TableOrderSummary = ({vendor}) => (
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
            </tbody>
        </table>
    </div>
);

export default TableOrderSummary;
