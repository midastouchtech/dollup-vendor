import React from 'react';
import TableOrderSummary from '~/components/shared/tables/TableOrderSummary';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { take } from 'ramda';
import Link from 'next/link';

const CardRecentOrders = ({ vendor, socket }) => {
  const [bookings, setBookings] = useState();

  useEffect(() => {
    if (!bookings && socket && vendor) {
      socket.emit('GET_VENDOR_BOOKINGS', { id: vendor.id });
      socket.on('RECEIVE_VENDOR_BOOKINGS', (data) => {
        const sorted = data.sort((a, b) => {
          return moment(b.dateAdded).diff(moment(a.dateAdded));
        });
        setBookings(take(5, sorted));
      });
    }
  }, []);

  console.log('bookings', bookings);

  return (
    <div className='ps-card'>
      <div className='ps-card__header'>
        <h4>Recent Bookings</h4>
      </div>

      <div className='ps-card__content'>
        <TableOrderSummary bookings={bookings} vendor={vendor} />
      </div>

      <div className='ps-card__footer'>
        <Link className='ps-card__morelink' href='/bookings-report'>
          View Full Bookings
          <i className='icon icon-chevron-right'></i>
        </Link>
      </div>
    </div>
  );
};

export default CardRecentOrders;
