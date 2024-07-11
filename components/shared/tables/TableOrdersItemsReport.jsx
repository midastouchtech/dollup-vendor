import React from 'react';
import Link from 'next/link';
import { Menu } from 'antd';
import DropdownAction from '~/components/elements/basic/DropdownAction';
import moment from 'moment';
import { PLATFORM_COMMISION } from '../cards/CardEarning';
import styled from 'styled-components';

const StyledTFOOT = styled.tfoot`
  width: 100%;
  td {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 700;
  }
`;

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
      badgeView = <span className='ps-badge success'>PAID</span>;
    } else {
      badgeView = <span className='ps-badge danger'>UNPAID</span>;
    }
    if (item.isComplete) {
      fullfillmentView = (
        <span className='ps-fullfillment success'>COMPLETE</span>
      );
    } else if (item.isCancelled) {
      fullfillmentView = (
        <span className='ps-fullfillment danger'>CANCELLED</span>
      );
    } else {
      fullfillmentView = (
        <span className='ps-fullfillment warning'>PENDING</span>
      );
    }
    const stylistCommision =
      (item?.service?.salePrice || 0) *
      (parseInt(vendor?.stylistCommision) / 100);
    const platformCommision =
      (item?.service?.salePrice || 0) * PLATFORM_COMMISION;
    const net =
      (item?.service?.salePrice || 0) - stylistCommision - platformCommision;
    const rowClass = item.isComplete
      ? 'complete-row'
      : item.isCancelled
      ? 'cancelled-row'
      : 'pending-row';
    return (
      <tr key={item?.id} className={`${rowClass}`}>
        <td>{item?.searchIndex}</td>
        <td>
          <small> {moment(item?.date).format('DD MMM YYYY')}</small>
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
              <strong>{item?.stylist?.name}</strong>
            </small>
          </Link>
        </td>
        <td>{badgeView}</td>
        <td>{fullfillmentView}</td>
        <td>R{item?.service?.salePrice ?? 0}</td>
        <td>R{stylistCommision}</td>
        <td>R{platformCommision}</td>
        <td>R{net}</td>
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
            <th>#</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Stylist</th>
            <th>Paid</th>
            <th>Fullfillment</th>
            <th>Gross</th>
            <th>Stylist</th>
            <th>Platform</th>
            <th>Net</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{tableItemsView}</tbody>
        <StyledTFOOT>
          <tr>
            <td colSpan='5'>
              <strong>Total</strong>
            </td>
            <td></td>
            <td colSpan='1'>
              <strong>
                R{' '}
                {bookings?.length > 0 ? (
                  <>
                    {bookings?.reduce(
                      (acc, curr) => acc + parseFloat(curr?.service?.salePrice),
                      0
                    )}
                  </>
                ) : (
                  <span>0</span>
                )}
              </strong>
            </td>
            <td colSpan='1'>
              <strong>
                R{' '}
                {bookings?.length > 0 ? (
                  <>
                    {bookings?.reduce(
                      (acc, curr) =>
                        acc +
                        parseFloat(curr?.service?.salePrice) *
                          (parseFloat(vendor?.stylistCommision) / 100),
                      0
                    )}
                  </>
                ) : (
                  <span>0</span>
                )}
              </strong>
            </td>
            <td colSpan='1'>
              <strong>
                R{' '}
                {bookings?.length > 0 ? (
                  <>
                    {bookings?.reduce(
                      (acc, curr) =>
                        acc +
                        parseFloat(curr?.service?.salePrice) *
                          PLATFORM_COMMISION,
                      0
                    )}
                  </>
                ) : (
                  <span>0</span>
                )}
              </strong>
            </td>
            <td colSpan='1'>
              <strong>
                R{' '}
                {bookings?.length > 0 ? (
                  <>
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
                  </>
                ) : (
                  <span>0</span>
                )}
              </strong>
            </td>
            <td></td>
          </tr>
        </StyledTFOOT>
      </table>
    </div>
  );
};

export default TableOrdersItems;
