import React from 'react';
import Link from 'next/link';
import { Menu } from 'antd';
import DropdownAction from '~/components/elements/basic/DropdownAction';
import moment from 'moment';
import { PLATFORM_COMMISION } from '../cards/CardEarning';

const TableOrdersItems = ({ socket, bookings, vendor }) => {
  const tableItemsView = bookings?.map((item) => {
    let badgeView, fullfillmentView;
    const menuView = (
      <Menu>
        <Menu.Item key={0}>
          <a className='dropdown-item' href='#'>
            Edit
          </a>
        </Menu.Item>
        <Menu.Item key={0}>
          <a className='dropdown-item' href='#'>
            <i className='icon-t'></i>
            Delete
          </a>
        </Menu.Item>
      </Menu>
    );
    if (item.isPaid) {
      badgeView = <span className='ps-badge success'>Paid</span>;
    } else {
      badgeView = <span className='ps-badge gray'>Unpaid</span>;
    }
    if (item.isComplete) {
      fullfillmentView = (
        <span className='ps-fullfillment success'>Completed</span>
      );
    } else if (item.isCancelled) {
      fullfillmentView = (
        <span className='ps-fullfillment danger'>Cancelled</span>
      );
    } else {
      fullfillmentView = (
        <span className='ps-fullfillment warning'>Pending</span>
      );
    }
    console.log('table bookings', bookings);
    const stylistCommision =
      (item?.service?.salePrice || 0) *
      (parseInt(vendor?.stylistCommision) / 100);
    const platformCommision =
      (item?.service?.salePrice || 0) * PLATFORM_COMMISION;
    const net =
      (item?.service?.salePrice || 0) - stylistCommision - platformCommision;
    return (
      <tr key={item?.id}>
        <td>
          <small> {moment(item?.dateTime).format('DD MMM YYYY')}</small>
        </td>
        <td>
          <Link href='/bookings/order-detail'>
            <small>
              <strong>{`${item?.user?.firstName} ${item?.user?.lastName}`}</strong>
            </small>
          </Link>
        </td>
        <td>
          <Link href='/bookings/order-detail'>
            <small>
              <strong>{item?.service?.name}</strong>
            </small>
          </Link>
        </td>
        <td>
          <Link href='/bookings/order-detail'>
            <small>
              <strong>{item?.stylist?.name}</strong>
            </small>
          </Link>
        </td>
        <td>{badgeView}</td>
        <td>{fullfillmentView}</td>
        <td>
          <Link href='/bookings/order-detail'>
            <small>
              <strong>{item?.time}</strong>
            </small>
          </Link>
        </td>
        <td>
          <strong>R{item?.service?.salePrice ?? 0}</strong>
        </td>
        <td>
          <strong>R{stylistCommision}</strong>
        </td>
        <td>
          <strong>R{platformCommision}</strong>
        </td>
        <td>
          <strong>R{net}</strong>
        </td>
        <td>
          <DropdownAction socket={socket} id={item.id} type='bookings' />
        </td>
      </tr>
    );
  });
  return (
    <div className='table-responsive'>
      <table className='table ps-table'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Service</th>
            <th>Stylist</th>
            <th>Paid</th>
            <th>Fullfillment</th>
            <th>Time</th>
            <th>Gross</th>
            <th>Stylist</th>
            <th>Platform</th>
            <th>Net</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{tableItemsView}</tbody>
        <tfoot>
          <tr>
            <td colSpan='7'>
              <strong>Total</strong>
            </td>
            <td colSpan='1'>
              <strong>
                R{' '}
                {bookings?.length > 0 ? (
                  <span>
                    {bookings?.reduce(
                      (acc, curr) => acc + parseFloat(curr?.service?.salePrice),
                      0
                    )}
                  </span>
                ) : (
                  <span>0</span>
                )}
              </strong>
            </td>
            <td colSpan='1'>
              <strong>
                R{' '}
                {bookings?.length > 0 ? (
                  <span>
                    {bookings?.reduce(
                      (acc, curr) =>
                        acc +
                        parseFloat(curr?.service?.salePrice) *
                          (parseFloat(vendor?.stylistCommision) / 100),
                      0
                    )}
                  </span>
                ) : (
                  <span>0</span>
                )}
              </strong>
            </td>
            <td colSpan='1'>
              <strong>
                R{' '}
                {bookings?.length > 0 ? (
                  <span>
                    {bookings?.reduce(
                      (acc, curr) =>
                        acc +
                        parseFloat(curr?.service?.salePrice) *
                          PLATFORM_COMMISION,
                      0
                    )}
                  </span>
                ) : (
                  <span>0</span>
                )}
              </strong>
            </td>
            <td colSpan='1'>
              <strong>
                R{' '}
                {bookings?.length > 0 ? (
                  <span>
                    {bookings?.reduce((acc, curr) => {
                      const stylistCommision =
                        parseFloat(curr?.service?.salePrice) *
                        (parseFloat(vendor?.stylistCommision) / 100);
                      const platformCommision =
                        parseFloat(curr?.service?.salePrice) *
                        PLATFORM_COMMISION;
                      const net =
                        parseFloat(curr?.service?.salePrice) -
                        stylistCommision -
                        platformCommision;
                      return acc + net;
                    }, 0)}
                  </span>
                ) : (
                  <span>0</span>
                )}
              </strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TableOrdersItems;
