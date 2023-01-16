import React from 'react';
import TableOrderSummary from '~/components/shared/tables/TableOrderSummary';

const CardRecentOrders = ({vendor}) => (
    <div className="ps-card">
        <div className="ps-card__header">
            <h4>Recent Bookings</h4>
        </div>

        <div className="ps-card__content">
            <TableOrderSummary vendor={vendor}/>
        </div>

        <div className="ps-card__footer">
            <a className="ps-card__morelink" href="orders.htmls">
                View Full Bookings
                <i className="icon icon-chevron-right"></i>
            </a>
        </div>
    </div>
);

export default CardRecentOrders;
